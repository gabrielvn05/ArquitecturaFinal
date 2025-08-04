import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración crítica para Render
  const port = process.env.PORT || 3000;
  const host = '0.0.0.0'; // ¡Esencial para Render!

  // CORS - Ajusta según tus necesidades
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'https://arquitectura-final.vercel.app/',
    credentials: true,
  });

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('LearnPro API')
    .setDescription('La API de LearnPro para la gestión de cursos y usuarios')
    .setVersion('1.0')
    .addTag('courses')
    .addTag('users')
    .addTag('subscription')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Iniciar servidor
  await app.listen(port, host);
  console.log(`🚀 Servidor ejecutándose en http://${host}:${port}`);
}

bootstrap();