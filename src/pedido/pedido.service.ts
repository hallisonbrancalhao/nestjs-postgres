import { Injectable } from '@nestjs/common';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PedidoEntity } from './pedido.entity';
import { Repository } from 'typeorm';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { StatusPedido } from '../produto/enum/status-pedido.enum';

@Injectable()
export class PedidoService {
  constructor(
    @InjectRepository(PedidoEntity)
    private pedidoRepository: Repository<PedidoEntity>,
    @InjectRepository(UsuarioEntity)
    private usuarioRepository: Repository<UsuarioEntity>,
  ) {}

  async createPedido(userId: string) {
    const usuario = await this.usuarioRepository.findOneBy({ id: userId });
    const pedidoCreate = new PedidoEntity();

    pedidoCreate.valorTotal = 0;
    pedidoCreate.status = StatusPedido.EM_PROCESSAMENTO;
    pedidoCreate.usuario = usuario;

    const createdPedido = await this.pedidoRepository.save(pedidoCreate);

    return this.pedidoRepository.save(createdPedido);
  }
}
