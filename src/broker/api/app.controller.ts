import { Body, Controller, Get, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { GetPortfolioApp } from '../application/get-portfolio/get-portfolio.application';
import { GetAssetsApp } from '../application/get-instrument/get-instrument.application';
import { CreateOrderApp, CreateOrderResponse } from '../application/create-order/create-order.application';
import { CreateOrderDto } from '../infraestructure/dtos/create-order/create-order.dto';
import { CreateOrderValidationPipe } from '../infraestructure/pipes/order-validation.pipe';
import { Instrument } from 'src/broker/domain/instrument.domain';
import { Portfolio } from 'src/broker/domain/portfolio.domain';
import { GetInstrumentsQueryFilterDto } from '../infraestructure/dtos/get-assets/get-assets-filter.dto';
import { ApiTags, ApiResponse, ApiOperation, ApiBody, ApiHeader } from '@nestjs/swagger';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(
    private readonly getPortfolioApp: GetPortfolioApp,
    private readonly getAssetsApp: GetAssetsApp,
    private readonly createOrderApp: CreateOrderApp,
  ) { }

  @Get('health')
  @ApiHeader({ name: 'USER_ID', description: 'Numeric User ID', required: true })
  @ApiResponse({ status: 200, description: 'Service working correctly' })
  @ApiOperation({ summary: 'Check the status of the API', description: 'You get a message indicating that the service is working correctly.' })
  getHealthApi(): { message: string } {
    return { message: 'Service working correctly' };
  }

  @Get('portfolio')
  @ApiHeader({ name: 'USER_ID', description: 'Numeric User ID', required: true })
  @ApiResponse({ status: 200, description: 'Portfolio information', type: Portfolio })
  @ApiOperation({ summary: 'Gets the portfolio', description: 'Returns the complete portfolio information.' })
  async getPortfolio(): Promise<Portfolio> {
    return await this.getPortfolioApp.execute();
  }

  @Get('assets')
  @ApiHeader({ name: 'USER_ID', description: 'Numeric User ID', required: true })
  @ApiResponse({ status: 200, description: 'List of instruments' })
  @ApiOperation({ summary: 'Gets the assets', description: 'Returns a list of instruments filtered according to the provided parameters.' })
  @UsePipes(new ValidationPipe())
  async getAssets(@Query() filter?: GetInstrumentsQueryFilterDto): Promise<Instrument[]> {
    return await this.getAssetsApp.execute(filter);
  }

  @Post('create-order')
  @ApiHeader({ name: 'USER_ID', description: 'Numeric User ID', required: true })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({ type: [CreateOrderDto] })
  @ApiOperation({ summary: 'Create an order', description: 'Create a new buy, sell, cash in or cash out order for the specified instruments.' })
  @UsePipes(new CreateOrderValidationPipe())
  async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<CreateOrderResponse> {
    return await this.createOrderApp.execute(createOrderDto);
  }
}
