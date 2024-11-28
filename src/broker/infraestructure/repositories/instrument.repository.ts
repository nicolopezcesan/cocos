import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { InstrumentModel } from '../entities/instrument.entity';
import { Instrument } from 'src/broker/domain/instrument.domain';
import { GetInstrumentsQueryFilter } from '../dtos/get-assets/get-assets-filter.dto';

interface IInstrumentRepository {
  getInstruments(getInstrumentsQueryFilter: GetInstrumentsQueryFilter): Promise<Instrument[]>
}

@Injectable()
export class InstrumentRepository implements IInstrumentRepository {
  private readonly logger = new Logger(InstrumentRepository.name);

  constructor(
    @InjectRepository(InstrumentModel)
    private readonly instrumentRepository: Repository<InstrumentModel>,
  ) { }

  async getInstruments(getInstrumentsQueryFilter: GetInstrumentsQueryFilter): Promise<Instrument[]> {
    try {
      const whereClause: any = {};

      if (getInstrumentsQueryFilter?.name) {
        whereClause.name = Like(`${getInstrumentsQueryFilter.name}%`);
      }

      if (getInstrumentsQueryFilter?.ticker) {
        whereClause.ticker = Like(`${getInstrumentsQueryFilter.ticker}%`);
      }

      const instruments = await this.instrumentRepository.find({ where: whereClause });
      return instruments.map((i) => new Instrument(i));
    } catch (error) {
      this.logger.error('Error trying to getInstruments');
      throw new HttpException(error, HttpStatus.SERVICE_UNAVAILABLE);
    }
  }
}
