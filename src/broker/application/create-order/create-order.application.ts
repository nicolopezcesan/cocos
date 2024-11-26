import { BadRequestException, Controller, Logger } from '@nestjs/common';
import { ORDER_SIDE, ORDER_STATUS, ORDER_TYPE } from 'src/broker/infraestructure/enums/order.enum';
import { BalanceService } from 'src/broker/infraestructure/services/balance.service';
import { MarketService } from 'src/broker/infraestructure/services/market.service';
import { OrderService } from 'src/broker/infraestructure/services/order.service';
import { CreateOrderDto } from 'src/broker/infraestructure/dtos/create-order/create-order.dto';

const ERROR_MESSAGES = {
  INSUFFICIENT_FUNDS: 'Balance cannot be less than the transaction amount',
  INSUFFICIENT_ASSETS: 'The amount of assets to be sold cannot be greater than your current assets',
  MISSES_DATA: 'Missing data in the request',
  INVALID_ORDER_SIDE: 'Invalid order side',
};

const USER_ID: number = 2;

@Controller()
export class CreateOrderApp {
  private readonly logger = new Logger(CreateOrderApp.name);

  constructor(
    private readonly balanceService: BalanceService,
    private readonly marketService: MarketService,
    private readonly orderService: OrderService,
  ) { }

  async execute(createOrderDto: CreateOrderDto): Promise<any> {
    await this.validateOrder(createOrderDto);
  }

  async validateOrder(createOrderDto: CreateOrderDto): Promise<any> {
    switch (createOrderDto.side) {
      case ORDER_SIDE.BUY:
        const newOrder = await this.validateAndCreateBuyOrder(createOrderDto);
        await this.orderService.createBuyOrder(newOrder);
        break;

      case ORDER_SIDE.SELL:
        await this.validateSellOrder(createOrderDto);
        break;

      case ORDER_SIDE.CASH_IN:
        await this.createCashIn(createOrderDto);
        break;

      case ORDER_SIDE.CASH_OUT:
        await this.createCashOut(createOrderDto);
        break;

      default:
        throw new BadRequestException(ERROR_MESSAGES.INVALID_ORDER_SIDE);
    }
  }

  async validateAndCreateBuyOrder(createOrderDto: CreateOrderDto): Promise<any> {
    const availableAccountBalance = await this.balanceService.getAvailableBalanceByAccount(USER_ID);
    const lastAssetPrice = await this.getMarketData([createOrderDto.instrumentid]);

    if (createOrderDto.type === ORDER_TYPE.MARKET) {
      return await this.validateMarketOrder(createOrderDto, availableAccountBalance, lastAssetPrice);
    } else if (createOrderDto.type === ORDER_TYPE.LIMIT) {
      return await this.validateLimitOrder(createOrderDto, availableAccountBalance);
    }
  }

  private async validateMarketOrder(createOrderDto: CreateOrderDto, availableAccountBalance, lastAssetPrice): Promise<any> {
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
      userid: USER_ID,
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
      userid: USER_ID,
    };

    return newOrder;
  }

  private async getMarketData(instrumentsId: Array<number>): Promise<number> {
    const [assetInMarket] = await this.marketService.getLastMarketData({ instruments: instrumentsId });
    return parseFloat(assetInMarket.close);
  }

  async validateSellOrder(createOrderDto: CreateOrderDto): Promise<any> {
    const quantityOfAsset = await this.balanceService.getQuantityAssetByAccount(createOrderDto.instrumentid, USER_ID);
    
    if (quantityOfAsset < createOrderDto.size) {
      this.logger.error(ERROR_MESSAGES.INSUFFICIENT_FUNDS);
      throw new BadRequestException(ERROR_MESSAGES.INSUFFICIENT_FUNDS);
    }
    
    const lastAssetPrice = await this.getMarketData([createOrderDto.instrumentid]);
    await this.orderService.createSellOrder(createOrderDto.instrumentid, quantityOfAsset, lastAssetPrice, USER_ID);
  }

  private async createCashIn(createOrderDto: CreateOrderDto): Promise<void> {
    await this.orderService.createCashInOrder(createOrderDto);
  }

  private async createCashOut(createOrderDto: CreateOrderDto): Promise<void> {
    await this.orderService.createCashOutOrder(createOrderDto);
  }

}