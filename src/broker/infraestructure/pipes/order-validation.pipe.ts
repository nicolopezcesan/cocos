import { Injectable, BadRequestException, PipeTransform, ArgumentMetadata } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CreateOrderDto } from 'src/broker/infraestructure/dtos/create-order/create-order.dto';
import { ORDER_SIDE, ORDER_TYPE } from 'src/broker/infraestructure/enums/order.enum';

@Injectable()
export class CreateOrderValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    const request = plainToClass(CreateOrderDto, value);

    switch (request.side) {
      case ORDER_SIDE.BUY:
        await this.validateBuyOrder(request);
        return request;
      case ORDER_SIDE.SELL:
        await this.validateSellOrder(request);
        return request;
      case ORDER_SIDE.CASH_IN:
        await this.validateCashInOrder(request);
        return request;
      case ORDER_SIDE.CASH_OUT:
        await this.validateCashOutOrder(request);
        return request;
      default:
        throw new BadRequestException('Invalid order side');
    }
  }

  private async validateBuyOrder(order: CreateOrderDto) {
    switch (order.type) {
      case ORDER_TYPE.MARKET:
        await this.validateMarketOrder(order);
        break;
      case ORDER_TYPE.LIMIT:
        await this.validateLimitOrder(order);
        break;
      default:
        throw new BadRequestException('Invalid order type');
    }
  }

  private async validateMarketOrder(order: CreateOrderDto) {
    if (typeof order.price === 'number') {
      throw new BadRequestException('Price is not required for MARKET orders');
    }

    if (!order.size && !order.amount) {
      throw new BadRequestException(
        'Size or amount must be provided for MARKET orders',
      );
    }

    if (order.size && order.amount) {
      throw new BadRequestException(
        'Cannot provide both size and amount for MARKET orders',
      );
    }
  }

  private async validateLimitOrder(order: CreateOrderDto) {
    if (!order.size || !order?.price) {
      throw new BadRequestException(
        'Size or price must be provided for LIMIT orders',
      );
    }

    if (order.size % 1 !== 0 || order.size <= 0) {
      throw new BadRequestException('Order size must be a positive integer');
    }
  }

  private async validateCashInOrder(order: CreateOrderDto) {
    if (typeof order.instrumentid !== 'number') {
      throw new BadRequestException('Order size must be a positive integer');
    }

    if (typeof order.size !== 'number' || order.size <= 0) {
      throw new BadRequestException('Order size must be a positive integer');
    }
  }

  private async validateCashOutOrder(order: CreateOrderDto) {
    if (typeof order.instrumentid !== 'number') {
      throw new BadRequestException('Instrument ID must be a positive integer');
    }

    if (typeof order.size !== 'number') {
      throw new BadRequestException('Order size must be a positive integer');
    }
  }

  private async validateSellOrder(order: CreateOrderDto) {
    if (typeof order.instrumentid !== 'number') {
      throw new BadRequestException('Instrument ID must be a positive integer');
    }

    if (typeof order.size !== 'number') {
      throw new BadRequestException('Order size must be a positive integer');
    }
  }
}
