import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Instrument } from '../entities/instrument.entity';
import { In, Not, Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { MarketData } from '../entities/market-data.entity';
import { User } from '../entities/user.entity';
import { GetAssetsFilterDto } from '../dtos/get-assets/get-assets-filter.dto';
import { ORDER_STATUS } from '../enums/order.enum';

@Injectable()
export class MarketService {

  constructor(
    @InjectRepository(MarketData)
    private readonly marketDataRepository: Repository<MarketData>,
  ) { }

  // ver si es posible parametrizar la busqueda by fecha
  async getLastMarketData(marketDataFilters: { instruments?: Array<number> }): Promise<any> {
    const whereClause: any = {};
  
    if (marketDataFilters.instruments?.length > 0) {
      whereClause.instrumentid = In(marketDataFilters.instruments);
    }
  
    return await this.marketDataRepository.find({
      relations: ['instrument'],
      where: {
        ...whereClause,
        date: new Date('2023-07-15')
      }
    });
  }

}
