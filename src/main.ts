import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  // Configuración Swagger
  const config = new DocumentBuilder()
    .setTitle('API de Autenticación LDAP')
    .setDescription('Documentación del sistema de autenticación')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Ingrese el token JWT',
        in: 'header'
      },
      'Bearer'
    )
    .build();

    const document = SwaggerModule.createDocument(app,config);
    SwaggerModule.setup('docs', app,document, {
      swaggerOptions: {
        persistAuthorization:true,
      },
    });
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
