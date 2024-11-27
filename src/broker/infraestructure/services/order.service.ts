import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderModel } from '../entities/order.entity';
import { CreateOrderDto } from '../dtos/create-order/create-order.dto';
import { ORDER_SIDE, ORDER_STATUS, ORDER_TYPE } from '../enums/order.enum';

interface IOrderService {
  createCashInOrder(createOrderDto: CreateOrderDto, userid: number): Promise<any>;
  createCashOutOrder(createOrderDto: CreateOrderDto, userid: number): Promise<any>;
  createBuyOrder(newOrder: any): Promise<any>;
  createSellOrder(createSellOrder: createSellOrder, userid: number): Promise<any>
}

export interface createSellOrder {
  instrumentid: number,
  size: number,
  lastAssetPrice: number,
  userid: number
}

@Injectable()
export class OrderService implements IOrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    @InjectRepository(OrderModel)
    private readonly orderRepository: Repository<OrderModel>,
  ) { }

  async createCashInOrder(createOrderDto: CreateOrderDto, userid: number): Promise<any> {
    try {
      const newOrder = {
        ...createOrderDto,
        status: ORDER_STATUS.FILLED,
        type: ORDER_TYPE.MARKET,
        datetime: new Date(),
        userid: userid,
        price: 1,
      };

      return await this.orderRepository.save(newOrder);
    } catch (error) {
      this.logger.error('Error trying to create cash in order');
      throw new HttpException(error, HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async createCashOutOrder(createOrderDto: CreateOrderDto, userid: number): Promise<any> {
    try {
      const newOrder = {
        ...createOrderDto,
        status: ORDER_STATUS.FILLED,
        type: ORDER_TYPE.MARKET,
        datetime: new Date(),
        userid,
        price: 1,
      };

      return await this.orderRepository.save(newOrder);
    } catch (error) {
      this.logger.error('Error trying to create cash out order');
      throw new HttpException(error, HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async createBuyOrder(newOrder: any): Promise<any> {
    try {
      return await this.orderRepository.save(newOrder);
    } catch (error) {
      this.logger.error('Error trying to create a buy order');
      throw new HttpException(error, HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async createSellOrder(createSellOrder: createSellOrder, userid: number): Promise<any> {
    try {
      const newOrder = {
        instrumentid: createSellOrder.instrumentid,
        size: createSellOrder.size,
        side: ORDER_SIDE.SELL,
        status: ORDER_STATUS.FILLED,
        type: ORDER_TYPE.MARKET,
        datetime: new Date(),
        price: createSellOrder.lastAssetPrice,
        userid,
      };

      return await this.orderRepository.save(newOrder);
    } catch (error) {
      this.logger.error('Error trying to create a sell order');
      throw new HttpException(error, HttpStatus.SERVICE_UNAVAILABLE);
    }
  }
}
