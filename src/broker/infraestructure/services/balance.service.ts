import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InstrumentModel } from '../entities/instrument.entity';
import { In, Like, Not, Repository } from 'typeorm';
import { OrderModel } from '../entities/order.entity';
import { GetAssetsFilterDto } from '../dtos/get-assets/get-assets-filter.dto';
import { ORDER_SIDE, ORDER_STATUS } from '../enums/order.enum';
import { Order } from 'src/broker/domain/order.domain';
import { Instrument } from 'src/broker/domain/instrument.domain';

interface IBalanceService {
  getOrders(userid: number): Promise<Array<Order>>
  getAssets(filters: GetAssetsFilterDto): Promise<Instrument[]>
}

@Injectable()
export class BalanceService implements IBalanceService {
  private readonly logger = new Logger(BalanceService.name);

  constructor(
    @InjectRepository(OrderModel)
    private readonly orderRepository: Repository<OrderModel>,
    @InjectRepository(InstrumentModel)
    private readonly instrumentRepository: Repository<InstrumentModel>,
  ) { }

  async getOrders(userid: number): Promise<Array<Order>> {
    try {
      const orders = await this.orderRepository.find({
        where: {
          userid: userid,
          status: Not(In([ORDER_STATUS.CANCELLED, ORDER_STATUS.REJECTED])),
        },
      });
      return orders.map((o) => new Order(o));
    } catch (error) {
      this.logger.error('Error trying to get lastest orders');
      throw new HttpException(error, HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async getAssets(getAssetsFilter: GetAssetsFilterDto): Promise<Array<Instrument>> {
    try {

      const whereClause: any = {};

      if (getAssetsFilter?.name) {
        whereClause.name = Like(`${getAssetsFilter.name}%`);
      }

      if (getAssetsFilter?.ticker) {
        whereClause.ticker = Like(`${getAssetsFilter.ticker}%`);
      }

      const instruments = await this.instrumentRepository.find({ where: whereClause });
      return instruments.map((i) => new Instrument(i));
    } catch (error) {
      this.logger.error('Error trying to get assets');
      throw new HttpException(error, HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async getAvailableBalanceByAccount(userId: number, accountOrders?: Array<Order>): Promise<any> {
    try {
      const orders = accountOrders ?? await this.getOrders(userId);

      const availableBalance = orders.reduce((acc: number, order) => {
        const amount =
          parseFloat(order.size.toString()) * parseFloat(order.price);

        switch (order.side) {
          case ORDER_SIDE.CASH_IN:
          case ORDER_SIDE.SELL:
            acc += amount;
            break;
          case ORDER_SIDE.CASH_OUT:
          case ORDER_SIDE.BUY:
            acc -= amount;
            break;
        }

        return acc;
      }, 0);

      return availableBalance;
    } catch (error) {
      this.logger.error('Error trying to get the available balance from account',);
      throw new HttpException(error, HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async getQuantityAssetByAccount(
    instrumentid: number,
    userId: number,
  ): Promise<any> {
    try {
      const orders = await this.orderRepository.find({
        where: {
          userid: userId,
          instrumentid,
          side: In([ORDER_SIDE.BUY, ORDER_SIDE.SELL]),
          status: Not(
            In([
              ORDER_STATUS.CANCELLED,
              ORDER_STATUS.REJECTED,
              ORDER_STATUS.NEW,
            ]),
          ),
        },
      });

      const totalAssets = orders.reduce((acc, order) => {
        return (acc +=
          order.side === ORDER_SIDE.BUY ? order.size : -order.size);
      }, 0);

      return totalAssets;
    } catch (error) {
      this.logger.error('Error trying to get quantity of asset');
      throw new HttpException(error, HttpStatus.SERVICE_UNAVAILABLE);
    }
  }
}
