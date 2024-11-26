import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { CreateOrderDto } from '../dtos/create-order/create-order.dto';
import { ORDER_SIDE, ORDER_STATUS, ORDER_TYPE } from '../enums/order.enum';

@Injectable()
export class OrderService {

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) { }

  async createCashInOrder(createOrderDto: CreateOrderDto): Promise<any> {
    const newOrder = {
      ...createOrderDto,
      status: ORDER_STATUS.FILLED,
      type: ORDER_TYPE.MARKET,
      datetime: new Date(),
      userid: 2,
      price: 1,
    };

    return await this.orderRepository.save(newOrder);
  }

  async createCashOutOrder(createOrderDto: CreateOrderDto): Promise<any> {
    const newOrder = {
      ...createOrderDto,
      status: ORDER_STATUS.FILLED,
      type: ORDER_TYPE.MARKET,
      datetime: new Date(),
      userid: 2,
      price: 1,
    };

    return await this.orderRepository.save(newOrder);
  }

  async createBuyOrder(newOrder: any): Promise<any> {
    return await this.orderRepository.save(newOrder);
  }

  async createSellOrder(instrumentid: number, size, lastAssetPrice, userid: number): Promise<any> {
    const newOrder = {
      instrumentid,
      size,
      side: ORDER_SIDE.SELL,
      status: ORDER_STATUS.FILLED,
      type: ORDER_TYPE.MARKET,
      datetime: new Date(),
      userid,
      price: lastAssetPrice,
    };
    
    return await this.orderRepository.save(newOrder);
  }

}
