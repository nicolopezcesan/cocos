import { Controller } from '@nestjs/common';
import { Instrument } from 'src/broker/domain/instrument.domain';
import { GetAssetsFilterDto } from 'src/broker/infraestructure/dtos/get-assets/get-assets-filter.dto';
import { BalanceService } from 'src/broker/infraestructure/services/balance.service';

@Controller()
export class GetAssetsApp {
  constructor(private readonly portfolioService: BalanceService) {}

  async execute(getAssetsFilter: GetAssetsFilterDto): Promise<Instrument[]> {
    return await this.portfolioService.getAssets(getAssetsFilter);
  }
}
