import { BadRequestException, Controller, Logger } from '@nestjs/common';
import { ORDER_SIDE } from 'src/broker/infraestructure/enums/order.enum';
import { CreateOrderDto } from 'src/broker/infraestructure/dtos/create-order/create-order.dto';
import { CreateOrderBuyApp } from './create-order-buy/create-order-buy.application';
import { CreateOrderSellApp } from './create-order-sell/create-order-sell.application';
import { CreateOrderCashInApp } from './create-order-cash-in/create-order-cash-in.application';
import { CreateOrderCashOutApp } from './create-order-cash-out/create-order-cash-out.application';

interface ICreateOrderApp {
  execute(createOrderDto: CreateOrderDto): Promise<any>;
}

export interface CreateOrderResponse {
  message: string;
}

@Controller()
export class CreateOrderApp implements ICreateOrderApp {
  private readonly logger = new Logger(CreateOrderApp.name);

  constructor(
    private readonly createOrderBuyApp: CreateOrderBuyApp,
    private readonly createOrderSellApp: CreateOrderSellApp,
    private readonly createOrderCashInApp: CreateOrderCashInApp,
    private readonly createOrderCashOutApp: CreateOrderCashOutApp,
  ) { }

  async execute(createOrderDto: CreateOrderDto): Promise<CreateOrderResponse> {
    return await this.createOrder(createOrderDto);
  }

  private async createOrder(createOrderDto: CreateOrderDto): Promise<CreateOrderResponse> {
    switch (createOrderDto.side) {
      case ORDER_SIDE.BUY:
        return await this.createOrderBuyApp.execute(createOrderDto);
      case ORDER_SIDE.SELL:
        return await this.createOrderSellApp.execute(createOrderDto);
      case ORDER_SIDE.CASH_IN:
        return await this.createOrderCashInApp.execute(createOrderDto);
      case ORDER_SIDE.CASH_OUT:
        return await this.createOrderCashOutApp.execute(createOrderDto);
      default:
        this.logger.error('Invalid order side');
        throw new BadRequestException('Invalid order side');
    }
  }
}
