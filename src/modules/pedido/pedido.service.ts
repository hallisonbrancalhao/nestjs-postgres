import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PedidoEntity } from './pedido.entity';
import { In, Repository } from 'typeorm';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { StatusPedido } from '../produto/enum/status-pedido.enum';
import { CreatePedidoDTO } from './dto/create-pedido.dto';
import { ItemPedidoEntity } from './item-pedido.entity';
import { ProdutoEntity } from '../produto/produto.entity';
import { UpdatePedidoDTO } from './dto/update-pedido.dto';

@Injectable()
export class PedidoService {
  constructor(
    @InjectRepository(PedidoEntity)
    private pedidoRepository: Repository<PedidoEntity>,
    @InjectRepository(UsuarioEntity)
    private usuarioRepository: Repository<UsuarioEntity>,
    @InjectRepository(ProdutoEntity)
    private produtoRepository: Repository<ProdutoEntity>,
  ) {}

  private async buscaUsuario(id: string) {
    const usuario = await this.usuarioRepository.findOneBy({ id });
    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return usuario;
  }

  private trataDadosDoPedido(
    dadosDoPedido: CreatePedidoDTO,
    produtosRelacionados: ProdutoEntity[],
  ) {
    dadosDoPedido.itensPedido.forEach((itemPedido) => {
      const produtoRelacionado = produtosRelacionados.find(
        (produto) => produto.id === itemPedido.produtoId,
      );

      if (produtoRelacionado === undefined)
        throw new NotFoundException('Produto não encontrado');
    });
  }
  async createPedido(usuarioId: string, dadosDoPedido: CreatePedidoDTO) {
    const usuario = await this.buscaUsuario(usuarioId);
    const produtosIds = dadosDoPedido.itensPedido.map(
      (itemPedido) => itemPedido.produtoId,
    );

    const produtosRelacionados = await this.produtoRepository.findBy({
      id: In(produtosIds),
    });

    this.trataDadosDoPedido(dadosDoPedido, produtosRelacionados);

    const pedido = new PedidoEntity();

    pedido.usuario = usuario;
    pedido.status = StatusPedido.EM_PROCESSAMENTO;

    const itensPedido = dadosDoPedido.itensPedido.map((itemPedido) => {
      const produtoRelacionado = produtosRelacionados.find(
        (produto) => produto.id === itemPedido.produtoId,
      );

      if (produtoRelacionado === undefined)
        throw new NotFoundException('Produto não encontrado');

      const itemPedidoEntity = new ItemPedidoEntity();
      itemPedidoEntity.produto = produtoRelacionado;
      itemPedidoEntity.precoVenda = produtoRelacionado.valor;
      itemPedidoEntity.quantidade = itemPedido.quantidade;
      itemPedidoEntity.produto.quantidadeDisponivel -= itemPedido.quantidade;
      return itemPedidoEntity;
    });

    const valorTotal = itensPedido.reduce((total, item) => {
      return total + item.precoVenda * item.quantidade;
    }, 0);

    pedido.valorTotal = valorTotal;

    const createdPedido = await this.pedidoRepository.save(pedido);

    return createdPedido;
  }

  async obtemPedidosDeUsuario(usuarioId: string) {
    return this.pedidoRepository.find({
      where: {
        usuario: { id: usuarioId },
      },
      relations: {
        usuario: true,
      },
    });
  }

  async atualizaPedido(id: string, dto: UpdatePedidoDTO) {
    const pedido = await this.pedidoRepository.findOneBy({ id });

    if (!pedido) {
      throw new NotFoundException('Pedido não encontrado');
    }

    Object.assign(pedido, dto);

    return this.pedidoRepository.save(pedido);
  }
}
