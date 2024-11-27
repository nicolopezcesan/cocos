
export interface IPortfolio {
  availableBalance: number;
  totalBalance: number;
  assets: Array<any>;
}

export class Portfolio implements IPortfolio {
  public availableBalance: number;
  public totalBalance: number;
  public assets: Array<any>;

  constructor(availableBalance: number, totalBalance: number, assets: Array<any>) {
    this.availableBalance = availableBalance;
    this.totalBalance = totalBalance;
    this.assets = assets;
  }
}