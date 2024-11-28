import { BadRequestException, Controller, Inject, Logger } from '@nestjs/common';
import { ORDER_STATUS, ORDER_TYPE } from 'src/broker/infraestructure/enums/order.enum';
import { BalanceService } from 'src/broker/infraestructure/services/balance.service';
import { MarketService } from 'src/broker/infraestructure/services/market.service';
import { OrderService } from 'src/broker/infraestructure/services/order.service';
import { CreateOrderDto } from 'src/broker/infraestructure/dtos/create-order/create-order.dto';
import { REQUEST } from '@nestjs/core';
import { CreateOrderResponse } from '../create-order.application';

const ERROR_MESSAGES = {
  INSUFFICIENT_FUNDS: 'Balance cannot be less than the transaction amount',
  INSUFFICIENT_ASSETS: 'The amount of assets to be sold cannot be greater than your current assets',
  MISSES_DATA: 'Missing data in the request',
  INVALID_ORDER_SIDE: 'Invalid order side',
};

@Controller()
export class CreateOrderBuyApp {
  private readonly logger = new Logger(CreateOrderBuyApp.name);

  constructor(
    private readonly balanceService: BalanceService,
    private readonly marketService: MarketService,
    private readonly orderService: OrderService,
    @Inject(REQUEST) private request: Request & { userId: number },
  ) { }

  async execute(createOrderDto: CreateOrderDto): Promise<CreateOrderResponse> {
    const newOrder = await this.validateAndCreateBuyOrder(createOrderDto);
    await this.orderService.createBuyOrder(newOrder);
    return { message: `Your order for ${newOrder.size} assets was completed successfully` }
  }

  async validateAndCreateBuyOrder(createOrderDto: CreateOrderDto): Promise<any> {
    const availableAccountBalance = await this.balanceService.getAvailableBalanceByAccount(this.request.userId);
    const lastAssetPrice = await this.getMarketData([
      createOrderDto.instrumentid,
    ]);

    if (createOrderDto.type === ORDER_TYPE.MARKET) {
      return await this.validateMarketOrder(
        createOrderDto,
        availableAccountBalance,
        lastAssetPrice,
      );
    } else if (createOrderDto.type === ORDER_TYPE.LIMIT) {
      return await this.validateLimitOrder(
        createOrderDto,
        availableAccountBalance,
      );
    }
  }

  private async validateMarketOrder(createOrderDto: CreateOrderDto, availableAccountBalance: number, lastAssetPrice: number): Promise<any> {
    let quantityToBuy = 0;

    if (createOrderDto.amount) {
      if (availableAccountBalance < createOrderDto.amount) {
        this.logger.error(ERROR_MESSAGES.INSUFFICIENT_FUNDS);
        throw new BadRequestException(ERROR_MESSAGES.INSUFFICIENT_FUNDS);
      }

      const maxQuantityCanBuy = Math.floor(createOrderDto.amount / lastAssetPrice);
      if (maxQuantityCanBuy === 0) {
        this.logger.error(ERROR_MESSAGES.INSUFFICIENT_FUNDS);
        throw new BadRequestException(ERROR_MESSAGES.INSUFFICIENT_FUNDS);
      }

      quantityToBuy = maxQuantityCanBuy;
    }

    if (createOrderDto.size) {
      if (availableAccountBalance < createOrderDto.size * lastAssetPrice) {
        this.logger.error(ERROR_MESSAGES.INSUFFICIENT_FUNDS);
        throw new BadRequestException(ERROR_MESSAGES.INSUFFICIENT_FUNDS);
      }
      quantityToBuy = createOrderDto.size;
    }

    const newOrder = {
      instrumentid: createOrderDto.instrumentid,
      size: quantityToBuy,
      side: createOrderDto.side,
      type: createOrderDto.type,
      price: lastAssetPrice,
      status: ORDER_STATUS.FILLED,
      datetime: new Date(),
      userid: this.request.userId,
    };

    return newOrder;
  }

  private async validateLimitOrder(createOrderDto: CreateOrderDto, availableAccountBalance): Promise<any> {
    if (availableAccountBalance < createOrderDto.size * createOrderDto.price) {
      this.logger.error(ERROR_MESSAGES.INSUFFICIENT_ASSETS);
      throw new BadRequestException(ERROR_MESSAGES.INSUFFICIENT_ASSETS);
    }

    const newOrder = {
      instrumentid: createOrderDto.instrumentid,
      size: createOrderDto.size,
      side: createOrderDto.side,
      type: createOrderDto.type,
      price: createOrderDto.price,
      status: ORDER_STATUS.NEW,
      datetime: new Date(),
      userid: this.request.userId,
    };

    return newOrder;
  }

  private async getMarketData(instrumentsid: number[]): Promise<number> {
    const [assetInMarket] = await this.marketService.getLastMarketData(instrumentsid);
    return parseFloat(assetInMarket.close.toString());
  }
}
