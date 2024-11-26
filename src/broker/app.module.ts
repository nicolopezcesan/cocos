import { Module } from '@nestjs/common';
import { AppController } from './api/app.controller';
import { GetPortfolioApp } from './application/get-portfolio/get-portfolio.application';
// import { OperationRepository } from './infraestructure/repositories/operation.repository';
import { BalanceService } from './infraestructure/services/balance.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Instrument } from './infraestructure/entities/instrument.entity';
import { MarketData } from './infraestructure/entities/market-data.entity';
import { Order } from './infraestructure/entities/order.entity';
import { User } from './infraestructure/entities/user.entity';
import { GetAssetsApp } from './application/get-assets/get-assets.application';
import { CreateOrderApp } from './application/create-order/create-order.application';
import { MarketService } from './infraestructure/services/market.service';
import { OrderService } from './infraestructure/services/order.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Instrument,
      MarketData,
      Order,
      User,
    ])
  ],
  controllers: [AppController],
  providers: [
    // applications
    GetPortfolioApp,
    GetAssetsApp,
    CreateOrderApp,
    // services
    BalanceService,
    OrderService,
    MarketService
    // repositories
  ],
})

export class BrokerModule {}
