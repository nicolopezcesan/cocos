import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { ORDER_SIDE } from '../enums/order.enum';
import { Order } from 'src/broker/domain/order.domain';
import { OrderRepository } from '../repositories/order.repository';
import { OrderService } from './order.service';

interface IBalanceService {
  getAvailableBalanceByAccount(userId: number, accountOrders?: Order[]): Promise<number>;
  getQuantityAssetByAccount(instrumentId: number, userId: number): Promise<number>;
}

@Injectable()
export class BalanceService implements IBalanceService {
  private readonly logger = new Logger(BalanceService.name);

  constructor(
    private readonly orderService: OrderService
  ) { }

  async getAvailableBalanceByAccount(userId: number, _orders?: Order[]): Promise<number> {
    try {
      const orders = _orders ?? await this.orderService.getOrders(userId);
      let availableBalance = 0;

      orders.forEach((order: Order) => {
        const amount = parseFloat(order.size.toString()) * parseFloat(order.price.toString());

        switch (order.side) {
          case ORDER_SIDE.CASH_IN:
          case ORDER_SIDE.SELL:
            availableBalance += amount;
            break;
          case ORDER_SIDE.CASH_OUT:
          case ORDER_SIDE.BUY:
            availableBalance -= amount;
            break;
        }
      });

      return availableBalance;
    } catch (error) {
      this.logger.error('Error trying to get the available balance from account', error);
      throw new Error('Error calculating available balance');
    }
  }

  async getQuantityAssetByAccount(instrumentId: number, userId: number): Promise<number> {
    try {
      const orders = await this.orderService.getOrdersByInstrument(instrumentId, userId);

      const totalAssets = orders.reduce((acc, order) =>
        acc + (order.side === ORDER_SIDE.BUY ? order.size : -order.size),
        0
      );

      return totalAssets;
    } catch (error) {
      this.logger.error('Error trying to get quantity of asset', error);
      throw new Error('Error calculating asset quantity');
    }
  }
}
