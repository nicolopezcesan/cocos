import { Controller } from '@nestjs/common';
import { ORDER_SIDE, ORDER_STATUS, ORDER_TYPE } from 'src/broker/infraestructure/enums/order.enum';
import { BalanceService } from 'src/broker/infraestructure/services/balance.service';
import { MarketService } from 'src/broker/infraestructure/services/market.service';

interface IOrder {
  id: number;
  size: number;
  price: string;
  type: ORDER_TYPE;
  side: ORDER_SIDE;
  status: ORDER_STATUS;
  datetime: string;
  instrumentid: number;
  instrument: {
    ticker: string;
    name: string;
    type: string;
  };
}

interface IBalance {
  availableBalance: number,
  totalBalance: number,
  orders: any,
  assets: any,
}

const USER_ID: number = 2;

@Controller()
export class GetPortfolioApp {
  constructor(
    private readonly balanceService: BalanceService,
    private readonly marketService: MarketService,
  ) { }

  async execute(): Promise<any> {
    const orders = await this.balanceService.getOrders(USER_ID);

    const { availableBalance, assetsBalance } = this.calculateBalanceFromOrders(orders);
    const assets = await this.calculateYieldsFromAssetsBalance(assetsBalance);

    const balanceInAssets = assets.reduce((acc, assets) => {
      return acc += assets.balance;
    }, 0)

    return { 
      availableBalance,
      totalBalance: availableBalance + balanceInAssets, 
      assets,
    };
  }

  private calculateBalanceFromOrders(orders: IOrder[]): any {
    const initialBalance: any = {
      availableBalance: 0,
      assets: {}
    };

    const processedOrders = orders.reduce((acc, order) => {
      this.calculateAvailableBalance(acc, order);
      this.calculateAssetBalance(acc, order);
      return acc;
    }, initialBalance);

    return {
      availableBalance: processedOrders.availableBalance,
      assetsBalance: processedOrders.assets,
    };
  }

  // Usar método del balanceService
  private calculateAvailableBalance(balance: any, order: IOrder): void {
    const amount = parseFloat(order.size.toString()) * parseFloat(order.price);

    switch (order.side) {
      case ORDER_SIDE.CASH_IN:
      case ORDER_SIDE.SELL:
        balance.availableBalance += amount;
        break;
      case ORDER_SIDE.CASH_OUT:
      case ORDER_SIDE.BUY:
        balance.availableBalance -= amount;
        break;
    }
  }

  private calculateAssetBalance(balance: any, order: IOrder): void {
    if ([ORDER_SIDE.BUY, ORDER_SIDE.SELL].includes(order.side) && order.status === ORDER_STATUS.FILLED) {
      const { instrumentid } = order;

      if (!balance.assets[instrumentid]) {
        balance.assets[instrumentid] = {
          quantityOfBuy: 0,
          quantityOfSell: 0,
          currentAssets: 0,
          totalBuyAmount: 0,
          totalSellAmount: 0
        };
      }

      const amount = parseFloat(order.size.toString()) * parseFloat(order.price);

      const asset = balance.assets[instrumentid];
      asset.currentAssets += order.side === ORDER_SIDE.BUY ? order.size : -order.size;
      asset.quantityOfBuy += order.side === ORDER_SIDE.BUY ? order.size : 0;
      asset.quantityOfSell += order.side === ORDER_SIDE.SELL ? order.size : 0;

      if (order.side === ORDER_SIDE.BUY) {
        asset.totalBuyAmount += amount
      } else if (order.side === ORDER_SIDE.SELL) {
        asset.totalSellAmount += amount
      }
    }
  }
  private async calculateYieldsFromAssetsBalance(assets: any): Promise<any> {
    const assetsKey = Object.keys(assets);

    const marketData = await this.marketService.getLastMarketData({
      instruments: assetsKey.map(instrumentid => parseInt(instrumentid, 10)),
    });

    return assetsKey.map(instrumentId => {
      const asset = assets[instrumentId];
      const quantity = asset.currentAssets;

      const averageBuyPrice = asset.totalBuyAmount / asset.quantityOfBuy;
      // const averageSellPrice = asset.totalSellAmount / asset.quantityOfSell;

      const assetInMarket = marketData.find(md => md.instrumentid == instrumentId)

      return {
        instrumentId,
        ticker: assetInMarket.instrument.ticker,
        quantity,
        averageBuyPrice,
        lastMarketPrice: assetInMarket.close,
        balance: quantity * averageBuyPrice,
        yield: (assetInMarket.close - averageBuyPrice).toFixed(2),
        yielPercentage: (((assetInMarket.close - averageBuyPrice) / averageBuyPrice) * 100).toFixed(2),
      }
    });
  }

}
