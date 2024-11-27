import { IsNumber, IsString } from 'class-validator';

export class getPortfolioDto {
  @IsString()
  accountId: string;
}
