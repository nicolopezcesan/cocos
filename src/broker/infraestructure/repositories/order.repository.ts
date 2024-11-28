import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { OrderModel } from '../entities/order.entity';
import { ORDER_STATUS, ORDER_SIDE } from '../enums/order.enum';
import { Order } from 'src/broker/domain/order.domain';

interface IOrderRepository {
  getOrders(userId: number): Promise<Order[]>
  getOrdersByInstrument(instrumentId: number, userId: number): Promise<Order[]>
  createOrder(newOrder: any): Promise<void>
}

@Injectable()
export class OrderRepository implements IOrderRepository {
  private readonly logger = new Logger(OrderRepository.name);

  constructor(
    @InjectRepository(OrderModel)
    private readonly orderRepository: Repository<OrderModel>,
  ) { }

  async createOrder(newOrder: any): Promise<void> {
    try {
      await this.orderRepository.save(newOrder);
    } catch (error) {
      this.logger.error('Error trying to createOrder', error);
      throw new HttpException(error, HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  // TOOD: create a getOrderQueryFilter that allow receive filter params
  async getOrders(userId: number): Promise<Order[]> {
    try {
      const orders = await this.orderRepository.find({
        where: {
          userid: userId,
          status: Not(
            In([
              ORDER_STATUS.CANCELLED,
              ORDER_STATUS.REJECTED,
            ])
          ),
        },
      });
  
      return orders.map((o) => new Order(o));
    } catch (error) {
      this.logger.error('Error trying to getOrders', error);
      throw new HttpException(error, HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async getOrdersByInstrument(instrumentId: number, userId: number): Promise<Order[]> {
    try {
      const orders = await this.orderRepository.find({
        where: {
          userid: userId,
          instrumentid: instrumentId,
          side: In([
            ORDER_SIDE.BUY,
            ORDER_SIDE.SELL
          ]),
          status: Not(
            In([
              ORDER_STATUS.CANCELLED,
              ORDER_STATUS.REJECTED,
              ORDER_STATUS.NEW,
            ]),
          ),
        },
      });
  
      return orders.map((o) => new Order(o));
    } catch (error) {
      this.logger.error('Error trying to getOrdersByInstrument', error);
      throw new HttpException(error, HttpStatus.SERVICE_UNAVAILABLE);
    }
  }
}
