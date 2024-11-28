import { Injectable, Logger } from '@nestjs/common';
import { MarketData } from 'src/broker/domain/market-data.domain';
import { Instrument } from 'src/broker/domain/instrument.domain';
import { InstrumentRepository } from '../repositories/instrument.repository';
import { GetInstrumentsQueryFilterDto } from '../dtos/get-assets/get-assets-filter.dto';
import { MarketDataRepository } from '../repositories/market-data.repository';

interface IMarketDataService {
  getLastMarketData(instruments: number[]): Promise<MarketData[]>;
  getInstruments(getInstrumentsQueryFilter: GetInstrumentsQueryFilterDto): Promise<Instrument[]>;
}

@Injectable()
export class MarketService implements IMarketDataService {
  private readonly logger = new Logger(MarketService.name);

  constructor(
    private readonly marketDataRepository: MarketDataRepository,
    private readonly instrumentRepository: InstrumentRepository,
  ) { }

  async getLastMarketData(instruments?: number[]): Promise<MarketData[]> {
    return await this.marketDataRepository.getLastMarketData(instruments);
  }

  async getInstruments(getInstrumentsQueryFilter: GetInstrumentsQueryFilterDto): Promise<Instrument[]> {
    return await this.instrumentRepository.getInstruments(getInstrumentsQueryFilter);
  }
}
