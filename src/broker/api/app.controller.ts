import { Body, Controller, Get, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { GetPortfolioApp } from '../application/get-portfolio/get-portfolio.application';
import { GetAssetsApp } from '../application/get-assets/get-assets.application';
import { GetAssetsFilterDto } from '../infraestructure/dtos/get-assets/get-assets-filter.dto';
import { CreateOrderApp, CreateOrderResponse } from '../application/create-order/create-order.application';
import { CreateOrderDto } from '../infraestructure/dtos/create-order/create-order.dto';
import { CreateOrderValidationPipe } from '../infraestructure/pipes/order-validation.pipe';
import { Instrument } from 'src/broker/domain/instrument.domain';
import { Portfolio } from 'src/broker/domain/portfolio.domain';

@Controller()
export class AppController {
  constructor(
    private readonly getPortfolioApp: GetPortfolioApp,
    private readonly getAssetsApp: GetAssetsApp,
    private readonly createOrderApp: CreateOrderApp,
  ) { }

  @Get('health')
  getHealthApi(): { message: string } {
    return { message: 'Service working correctly' };;
  }

  @Get('portfolio')
  async getPortfolio(): Promise<Portfolio> {
    return await this.getPortfolioApp.execute();
  }

  @Get('assets')
  @UsePipes(ValidationPipe)
  async getAssets(@Query() getAssetsFilter: GetAssetsFilterDto): Promise<Instrument[]> {
    return await this.getAssetsApp.execute(getAssetsFilter);
  }

  @Post('create-order')
  @UsePipes(new CreateOrderValidationPipe())
  async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<CreateOrderResponse> {
    return await this.createOrderApp.execute(createOrderDto);
  }
}