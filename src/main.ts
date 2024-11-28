import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './broker/infraestructure/interceptors/response.interceptor';
import { UserIdInterceptor } from './broker/infraestructure/interceptors/user.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

function setSwaggerConfig(app: INestApplication<any>) {
  const options = new DocumentBuilder()
    .setTitle('Cocos Challenge API')
    .setDescription('Descripción de la API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  setSwaggerConfig(app);

  app.setGlobalPrefix('v1');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  app.useGlobalInterceptors(new UserIdInterceptor());
  app.useGlobalInterceptors(new ResponseInterceptor());

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();