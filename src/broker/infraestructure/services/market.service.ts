import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { MarketDataModel } from '../entities/market-data.entity';
import { MarketData } from 'src/broker/domain/market-data.domain';

interface IMarketDataService {
  getLastMarketData(instruments: Array<number>): Promise<MarketData[]>;
}

@Injectable()
export class MarketService implements IMarketDataService {
  private readonly logger = new Logger(MarketService.name);

  constructor(
    @InjectRepository(MarketDataModel)
    private readonly marketDataRepository: Repository<MarketDataModel>,
  ) { }

  async getLastMarketData(instruments?: Array<number>): Promise<MarketData[]> {
    try {
      const whereClause: any = {};

      if (instruments?.length > 0) {
        whereClause.instrumentid = In(instruments);
      }

      const data = await this.marketDataRepository.find({
        relations: ['instrument'],
        where: {
          ...whereClause,
          date: new Date('2023-07-15'),
        },
      });

      return data.map((i) => new MarketData(i));
    } catch (error) {
      this.logger.error('Error trying to get last market data', error);
      throw new HttpException(error, HttpStatus.SERVICE_UNAVAILABLE);
    }
  }
}
