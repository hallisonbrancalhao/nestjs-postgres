import { Controller, Post, Param } from '@nestjs/common';
import { PedidoService } from './pedido.service';

@Controller('pedido')
export class PedidoController {
  constructor(private readonly pedidoService: PedidoService) {}

  @Post()
  create(@Param() userId: string) {
    return this.pedidoService.createPedido(userId);
  }
}
