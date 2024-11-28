import { BadRequestException, Controller, Inject, Logger } from '@nestjs/common';
import { BalanceService } from 'src/broker/infraestructure/services/balance.service';
import { MarketService } from 'src/broker/infraestructure/services/market.service';
import { createSellOrder, OrderService } from 'src/broker/infraestructure/services/order.service';
import { CreateOrderDto } from 'src/broker/infraestructure/dtos/create-order/create-order.dto';
import { REQUEST } from '@nestjs/core';
import { CreateOrderResponse } from '../create-order.application';

@Controller()
export class CreateOrderSellApp {
  private readonly logger = new Logger(CreateOrderSellApp.name);

  constructor(
    private readonly balanceService: BalanceService,
    private readonly marketService: MarketService,
    private readonly orderService: OrderService,
    @Inject(REQUEST) private request: Request & { userId: number },
  ) { }

  async execute(createOrderDto: CreateOrderDto): Promise<CreateOrderResponse> {
    await this.validateSellOrder(createOrderDto);
    const [lastAssetPrice] = await this.marketService.getLastMarketData([createOrderDto.instrumentid]);

    await this.orderService.createSellOrder({
      instrumentid: createOrderDto.instrumentid,
      size: createOrderDto.size,
      lastAssetPrice: lastAssetPrice.close,
    } as createSellOrder, this.request.userId);

    return { message: 'Your assets were successfully sold' };
  }

  async validateSellOrder(createOrderDto: CreateOrderDto): Promise<any> {
    try {
      const quantityOfAvailableAssets = await this.balanceService.getQuantityAssetByAccount(
        createOrderDto.instrumentid, 
        this.request.userId
      );
      
      if (quantityOfAvailableAssets < createOrderDto.size) {
        this.logger.error('You do not have the amount of assets you are requesting to sell');
        throw new BadRequestException('You do not have the amount of assets you are requesting to sell');
      }

      return { quantityOfAvailableAssets };
    } catch (error) {
      this.logger.error('Error trying to validate a sell order');
      throw error;
    }
  }
}
