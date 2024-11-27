import { Controller, HttpException, HttpStatus, Inject, Logger } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { number } from 'joi';
import { async } from 'rxjs';
import { IOrder } from 'src/broker/domain/order.domain';
import { Portfolio } from 'src/broker/domain/portfolio.domain';
import { BalanceService } from 'src/broker/infraestructure/services/balance.service';
import { MarketService } from 'src/broker/infraestructure/services/market.service';

interface IGetPortfolioApp {
  execute(): Promise<Portfolio>;
}

interface IAssetsBalanceFromOrders {
  quantityOfBuy: number,
  currentAssets: number,
  totalBuyAmount: number,
}

interface IYieldFromAssets {
  instrumentid: number;
  ticker: string;
  quantity: number;
  lastMarketPrice: number;
  averageBuyPrice: number;
  balance: number;
  yieldAmount: string;
  yieldPercentage: string;
}

@Controller()
export class GetPortfolioApp implements IGetPortfolioApp {
  private readonly logger = new Logger(MarketService.name);
  
  constructor(
    private readonly balanceService: BalanceService,
    private readonly marketService: MarketService,
    @Inject(REQUEST) private request: Request & { userId: number },
  ) { }

  async execute(): Promise<Portfolio> {
    try {
      const orders = await this.balanceService.getOrders(this.request.userId);
      const availableBalance = await this.balanceService.getAvailableBalanceByAccount(this.request.userId, orders);
  
      const assetsBalance = this.calculateBalanceFromOrders(orders);
      const assetsYield = await this.calculateYieldFromAssets(assetsBalance);
      const balanceInAssets = this.calculateBalanceInAssets(assetsYield);
  
      return new Portfolio(
        availableBalance,
        availableBalance + balanceInAssets,
        assetsYield,
      );
    } catch (error) {
      this.logger.error('Error trying to get portfolio', error);
      throw error;
    }
  }

  private calculateBalanceFromOrders(orders: IOrder[]): IAssetsBalanceFromOrders {
    try {
      const processedOrders = orders.reduce((acc, order) => {
        if (!order.isBuyOrSell() || !order.isStatusFilled()) {
          return acc;
        }
  
        const { instrumentid } = order;
  
        if (!acc[instrumentid]) {
          acc[instrumentid] = {
            quantityOfBuy: 0,
            currentAssets: 0,
            totalBuyAmount: 0,
          };
        }
  
        const asset = acc[instrumentid];
        asset.currentAssets += order.isBuy() ? order.size : -order.size;
        asset.quantityOfBuy += order.isBuy() ? order.size : 0;
  
        const amount = parseFloat(order.size.toString()) * parseFloat(order.price);
  
        if (order.isBuy()) {
          asset.totalBuyAmount += amount;
        }
  
        return acc;
      }, {} as IAssetsBalanceFromOrders);

      return processedOrders;
    } catch (error) {
      this.logger.error('Error trying to calculateBalanceFromOrders', error);
      throw new HttpException(error, HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  private async calculateYieldFromAssets(assets: IAssetsBalanceFromOrders): Promise<IYieldFromAssets[]> {
    try {
      const instrumentsid = Object.keys(assets).map((instrumentid) => parseInt(instrumentid, 10));
      const marketData = await this.marketService.getLastMarketData(instrumentsid);
  
      return instrumentsid.map((instrumentid) => {
        const asset = assets[instrumentid];
        const quantity = asset.currentAssets;
  
        const assetInMarket = marketData.find((md) => md.instrumentid === instrumentid);
  
        const lastMarketPrice = assetInMarket.close;
        const averageBuyPrice = asset.totalBuyAmount / asset.quantityOfBuy;
        const balance = quantity * lastMarketPrice;
        const yieldAmount = (assetInMarket.close - averageBuyPrice).toFixed(2);
        const yieldPercentage = (((assetInMarket.close - averageBuyPrice) / averageBuyPrice) * 100).toFixed(2);
  
        return {
          instrumentid,
          ticker: assetInMarket.instrument.ticker,
          quantity,
          lastMarketPrice,
          averageBuyPrice,
          balance,
          yieldAmount,
          yieldPercentage,
        };
      });
    } catch (error) {
      this.logger.error('Error trying to calculateYieldFromAssets', error);
      throw new HttpException(error, HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  private calculateBalanceInAssets(assets: IYieldFromAssets[]): number {
    return assets.reduce((acc, assets) => acc += assets.balance, 0);
  }

}
