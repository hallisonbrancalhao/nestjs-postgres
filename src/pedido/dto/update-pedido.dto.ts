import { IsEnum } from 'class-validator';
import { StatusPedido } from '../../produto/enum/status-pedido.enum';

export class UpdatePedidoDTO {
  @IsEnum(StatusPedido)
  status: StatusPedido;
}
