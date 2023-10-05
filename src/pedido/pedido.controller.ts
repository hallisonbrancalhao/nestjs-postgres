import {
  Controller,
  Post,
  Param,
  Get,
  Query,
  Body,
  Patch,
} from '@nestjs/common';
import { PedidoService } from './pedido.service';
import { CreatePedidoDTO } from './dto/create-pedido.dto';
import { UpdatePedidoDTO } from './dto/update-pedido.dto';

@Controller('pedido')
export class PedidoController {
  constructor(private readonly pedidoService: PedidoService) {}

  @Post()
  async criaPedido(
    @Query('usuarioId') usuarioId: string,
    @Body() dadosDoPedido: CreatePedidoDTO,
  ) {
    const pedidoCriado = await this.pedidoService.createPedido(
      usuarioId,
      dadosDoPedido,
    );
    return pedidoCriado;
  }

  @Get()
  async obtemPedidosDeUsuario(@Query('usuarioId') usuarioId: string) {
    const pedidos = await this.pedidoService.obtemPedidosDeUsuario(usuarioId);

    return pedidos;
  }

  @Patch(':id')
  atualizaPedido(
    @Param('id') pedidoId: string,
    @Body() dadosDeAtualizacao: UpdatePedidoDTO,
  ) {
    return this.pedidoService.atualizaPedido(pedidoId, dadosDeAtualizacao);
  }
}
