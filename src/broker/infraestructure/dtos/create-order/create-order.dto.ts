import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min, IsOptional, IsEnum } from 'class-validator';
import {
  ORDER_SIDE,
  ORDER_TYPE,
} from 'src/broker/infraestructure/enums/order.enum';

export class CreateOrderDto {
  @ApiProperty()
  @IsNumber()
  @Min(1)
  instrumentid: number;

  @ApiProperty()
  @IsOptional()
  @IsEnum(ORDER_SIDE)
  side: ORDER_SIDE;

  @ApiProperty({required: false })
  @IsOptional()
  @IsEnum(ORDER_TYPE)
  type?: ORDER_TYPE;
  
  @ApiProperty({required: false })
  @IsOptional()
  @IsNumber()
  size?: number;
  
  @ApiProperty({required: false })
  @IsOptional()
  @Min(1)
  @IsNumber()
  amount?: number;
  
  @ApiProperty({required: false })
  @IsOptional()
  @IsNumber()
  price?: number;
}
