import { Module } from '@nestjs/common';
import { AppController } from './api/app.controller';
import { GetPortfolioApp } from './application/get-portfolio/get-portfolio.application';
import { BalanceService } from './infraestructure/services/balance.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstrumentModel } from './infraestructure/entities/instrument.entity';
import { MarketDataModel } from './infraestructure/entities/market-data.entity';
import { OrderModel } from './infraestructure/entities/order.entity';
import { User } from './infraestructure/entities/user.entity';
import { GetAssetsApp } from './application/get-instrument/get-instrument.application';
import { CreateOrderApp } from './application/create-order/create-order.application';
import { MarketService } from './infraestructure/services/market.service';
import { OrderService } from './infraestructure/services/order.service';
import { CreateOrderBuyApp } from './application/create-order/create-order-buy/create-order-buy.application';
import { CreateOrderSellApp } from './application/create-order/create-order-sell/create-order-sell.application';
import { CreateOrderCashInApp } from './application/create-order/create-order-cash-in/create-order-cash-in.application';
import { CreateOrderCashOutApp } from './application/create-order/create-order-cash-out/create-order-cash-out.application';
import { OrderRepository } from './infraestructure/repositories/order.repository';
import { MarketDataRepository } from './infraestructure/repositories/market-data.repository';
import { InstrumentRepository } from './infraestructure/repositories/instrument.repository';

@Module({
  imports: [TypeOrmModule.forFeature([
    InstrumentModel, 
    MarketDataModel, 
    OrderModel, 
    User
  ])],
  controllers: [AppController],
  providers: [
    // applications
    GetPortfolioApp,
    GetAssetsApp,
    CreateOrderApp,
    CreateOrderBuyApp,
    CreateOrderSellApp,
    CreateOrderCashInApp,
    CreateOrderCashOutApp,
    // services
    BalanceService,
    OrderService,
    MarketService,
    // repositories
    OrderRepository,
    MarketDataRepository,
    InstrumentRepository,
  ],
})
export class BrokerModule {}
