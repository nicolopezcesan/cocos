import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Instrument } from '../entities/instrument.entity';
import { In, Not, Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { GetAssetsFilterDto } from '../dtos/get-assets/get-assets-filter.dto';
import { ORDER_SIDE, ORDER_STATUS } from '../enums/order.enum';

@Injectable()
export class BalanceService {
  private readonly logger = new Logger(BalanceService.name);

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Instrument)
    private readonly instrumentRepository: Repository<Instrument>,
  ) { }

  async getOrders(userId: number): Promise<any> {
    try {
      return await this.orderRepository.find({
        where: {
          userid: userId,
          status: Not(In([
            ORDER_STATUS.CANCELLED,
            ORDER_STATUS.REJECTED
          ]))
        }
      });
    } catch (error) {
      this.logger.error('Error trying to get lastest orders');
      throw new HttpException('Error trying to get lastest orders', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async getAssets(getAssetsFilter: GetAssetsFilterDto): Promise<any> {
    try {
      return await this.instrumentRepository.findBy(getAssetsFilter);
    } catch (error) {
      this.logger.error('Error trying to get assets');
      throw new HttpException('Error trying to get assets', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async getAvailableBalanceByAccount(userId: number): Promise<any> {
    try {
      const orders = await this.getOrders(userId);

      const availableBalance = orders.reduce((acc: number, order) => {
        const amount = parseFloat(order.size.toString()) * parseFloat(order.price);

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

      return await Promise.resolve(availableBalance);
    } catch (error) {
      this.logger.error('Error trying to get the available balance from account');
      throw new HttpException('Error trying to get the available balance from account', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async getQuantityAssetByAccount(instrumentid: number, userId: number): Promise<any> {
    try {
      const orders = await this.orderRepository.find({
        where: {
          userid: userId,
          instrumentid,
          side: In([
            ORDER_SIDE.BUY,
            ORDER_SIDE.SELL,
          ]),
          status: Not(In([
            ORDER_STATUS.CANCELLED,
            ORDER_STATUS.REJECTED,
            ORDER_STATUS.NEW,
          ]))
        }
      });

      const totalAssets = orders.reduce((acc, order) => {
        return acc += (order.side === ORDER_SIDE.BUY) ? order.size : -(order.size);
      }, 0)

      return totalAssets;
    } catch (error) {
      this.logger.error('Error trying to get quantity of asset');
      throw new HttpException('Error trying to get quantity of asset', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

}
