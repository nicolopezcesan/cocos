import { ApiProperty } from "@nestjs/swagger";

export interface IPortfolio {
  availableBalance: number;
  totalBalance: number;
  assets: Array<any>;
}

export class Portfolio implements IPortfolio {
  @ApiProperty({ description: 'Current available balance to operate' })
  public availableBalance: number;
  @ApiProperty({ description: 'Total balance between available balance to operate and balance in assets' })
  public totalBalance: number;
  @ApiProperty({ description: 'Current balance in assets' })
  public assets: Array<any>;

  constructor(availableBalance: number, totalBalance: number, assets: Array<any>) {
    this.availableBalance = availableBalance;
    this.totalBalance = totalBalance;
    this.assets = assets;
  }
}