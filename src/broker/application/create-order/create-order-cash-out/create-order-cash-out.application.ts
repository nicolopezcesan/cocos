import { BadRequestException, Controller, Inject, Logger } from '@nestjs/common';
import { OrderService } from 'src/broker/infraestructure/services/order.service';
import { CreateOrderDto } from 'src/broker/infraestructure/dtos/create-order/create-order.dto';
import { REQUEST } from '@nestjs/core';
import { CreateOrderResponse } from '../create-order.application';

@Controller()
export class CreateOrderCashOutApp {
  private readonly logger = new Logger(CreateOrderCashOutApp.name);

  constructor(
    private readonly orderService: OrderService,
    @Inject(REQUEST) private request: Request & { userId: number },
  ) { }

  async execute(createOrderDto: CreateOrderDto): Promise<CreateOrderResponse> {
    try {
      await this.orderService.createCashOutOrder(createOrderDto, this.request.userId);
      return { message: 'Your withdrawal was successful' };
    } catch (error) {
      this.logger.error('Error trying to create a cash out order');
      throw new BadRequestException('Error trying to create a cash out order');
    }
  }
}
