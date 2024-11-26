import { Body, Controller, Get, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { GetPortfolioApp } from '../application/get-portfolio/get-portfolio.application';
import { GetAssetsApp } from '../application/get-assets/get-assets.application';
import { GetAssetsFilterDto } from '../infraestructure/dtos/get-assets/get-assets-filter.dto';
import { CreateOrderApp } from '../application/create-order/create-order.application';
import { CreateOrderDto } from '../infraestructure/dtos/create-order/create-order.dto';
import { CreateOrderValidationPipe } from '../infraestructure/pipes/order-validation.pipe';

// AJUSTES GENERALES
// 1. Manejo de errores en los servicios
// 2. Agregar repositories para pasar logicas a los servicios
// 3. Agregar interfaces a las clases
// 4. Tipar todo lo que pueda
// 5. Hacer test para proceso de create-order
// 6. Ajustar swagger para que muestre todo ok (no está pedido)
// 7. Agregué en la DB el instrumentId = 66 para CASH_ARS
// 8. Pasar el calculate balance application a usar el nuevo servicio de balance

// MEJORAS NECESARIAS
// 1. Hacer que se pueda filtrar por USER_ID en todos los endpoints
// 2. Cambiar a "availableAccountBalance"
// 3. Agregar try/catch a todos los servicios
// 4. Agregar las interfaces a todo lo que se pueda (services/repositories/applications)

// DUDAS GENERALES
// 1. Agrego entidades de negocio para manejar mejor los datos?
// 2. Como soluciono el tema de camelCase en nombre de campos de tablas
// 3. Agregar distinción de usuarios a traves de header

@Controller('')
export class AppController {
  constructor(
    private readonly getPortfolioApp: GetPortfolioApp,
    private readonly getAssetsApp: GetAssetsApp,
    private readonly createOrderApp: CreateOrderApp,
  ) { }

  @Get('portfolio')
  @UsePipes(ValidationPipe)
  // agregar el usuario, para que devuelva la data de la cartera de los diferentes usuarios
  async getPortfolio(@Query() getPortfolioData: any): Promise<any> {
    return await this.getPortfolioApp.execute();
  }

  // Este podría llamarse "instruments", siendo que activos se le llaman a los instrumentos ya en una cartera
  @Get('assets')
  @UsePipes(ValidationPipe)
  // corregir validación del filter dto, que no acepte cualquier cosa
  async getAssets(@Query() getAssetsFilter: GetAssetsFilterDto): Promise<any> {
    return await this.getAssetsApp.execute(getAssetsFilter);
  }

  @Post('create-order')
  @UsePipes(new CreateOrderValidationPipe())
  // corregir validación del filter dto, que no acepte cualquier cosa
  async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<any> {
    return await this.createOrderApp.execute(createOrderDto);
  }

  // @Post('/cancel-order')
}


