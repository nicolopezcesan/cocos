import { BadRequestException, Controller, Inject, Logger } from '@nestjs/common';
import { OrderService } from 'src/broker/infraestructure/services/order.service';
import { CreateOrderDto } from 'src/broker/infraestructure/dtos/create-order/create-order.dto';
import { REQUEST } from '@nestjs/core';
import { CreateOrderResponse } from '../create-order.application';

const USER_ID: number = 2;

@Controller()
export class CreateOrderCashInApp {
  private readonly logger = new Logger(CreateOrderCashInApp.name);

  constructor(
    private readonly orderService: OrderService,
    @Inject(REQUEST) private request: Request & { userId: number },
  ) { }

  async execute(createOrderDto: CreateOrderDto): Promise<CreateOrderResponse> {
    try {
      await this.orderService.createCashInOrder(createOrderDto, this.request.userId);
      return { message: 'Your account has been funded successfully' }
    } catch (error) {
      this.logger.error('Error trying to create a cash in order');
      throw new BadRequestException('Error trying to create a cash in order');
    }
  }
}
