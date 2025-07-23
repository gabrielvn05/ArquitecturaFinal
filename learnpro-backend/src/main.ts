import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración de CORS
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('LearnPro API') // Título de la API
    .setDescription('La API de LearnPro para la gestión de cursos y usuarios') // Descripción de la API
    .setVersion('1.0') // Versión de la API
    .addTag('courses') // Etiqueta para los endpoints relacionados a cursos
    .addTag('users')   // Etiqueta para los endpoints relacionados a usuarios
    .addTag('suscription')
    .addBearerAuth()   // Si utilizas autenticación JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);  // 'api' es la ruta donde se mostrará la documentación

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
