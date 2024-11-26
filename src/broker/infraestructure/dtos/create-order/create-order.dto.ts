import { IsNumber, Min, IsOptional, IsEnum } from 'class-validator';
import { ORDER_SIDE, ORDER_TYPE } from 'src/broker/infraestructure/enums/order.enum';

export class CreateOrderDto {
  @IsNumber()
  @Min(1)
  instrumentid: number;

  @IsEnum(ORDER_SIDE)
  side: ORDER_SIDE;

  @IsOptional()
  @IsEnum(ORDER_TYPE)
  type?: ORDER_TYPE;

  @IsOptional()
  @IsNumber()
  size?: number;

  @IsOptional()
  @Min(1)
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsNumber()
  price?: number;
}