import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './broker/infraestructure/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.setGlobalPrefix('v1');
  
  // const config = new DocumentBuilder()
  //   .setTitle('Broker API')
  //   .setVersion('1.0')
  //   .build();

  // const document = SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup('docs', app, document, {
  //   customSiteTitle: 'Broker API Docs',
  // });

  app.useGlobalPipes(
    new ValidationPipe({ 
      transform: true,
      whitelist: true,
     })
  );

  app.useGlobalInterceptors(new ResponseInterceptor());

  await app.listen(process.env.PORT || 3000, () => {
    console.log('Broker API started successfully', {
      port: process.env.PORT,
      environment: process.env.ENVIRONMENT,
    });
  });
  
  // await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
