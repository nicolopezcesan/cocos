import { Controller } from '@nestjs/common';
import { Instrument } from 'src/broker/domain/instrument.domain';
import { GetInstrumentsQueryFilter } from 'src/broker/infraestructure/dtos/get-assets/get-assets-filter.dto';
import { MarketService } from 'src/broker/infraestructure/services/market.service';

@Controller()
export class GetAssetsApp {
  constructor(private readonly marketService: MarketService) {}

  async execute(getInstruments: GetInstrumentsQueryFilter): Promise<Instrument[]> {
    return await this.marketService.getInstruments(getInstruments);
  }
}
