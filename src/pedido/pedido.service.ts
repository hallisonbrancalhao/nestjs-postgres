import { Injectable } from '@nestjs/common';
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

  async createPedido(usuarioId: string, dadosDoPedido: CreatePedidoDTO) {
    const usuario = await this.usuarioRepository.findOneBy({ id: usuarioId });
    const produtosIds = dadosDoPedido.itensPedido.map(
      (itemPedido) => itemPedido.produtoId,
    );

    const produtosRelacionados = await this.produtoRepository.findBy({
      id: In(produtosIds),
    });

    const pedido = new PedidoEntity();

    pedido.usuario = usuario;
    pedido.status = StatusPedido.EM_PROCESSAMENTO;

    const itensPedido = dadosDoPedido.itensPedido.map((itemPedido) => {
      const produtoRelacionado = produtosRelacionados.find(
        (produto) => produto.id === itemPedido.produtoId,
      );

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

    Object.assign(pedido, dto);

    return this.pedidoRepository.save(pedido);
  }
}
