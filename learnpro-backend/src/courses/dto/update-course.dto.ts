import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsIn } from 'class-validator';

export class UpdateCourseDto {
  @ApiPropertyOptional({ description: 'El título del curso', example: 'Curso avanzado NestJS' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'El contenido del curso', example: 'Contenido actualizado' })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({
    description: 'Tipo de suscripción requerida',
    enum: ['FREE', 'MONTHLY', 'ANNUAL'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['FREE', 'MONTHLY', 'ANNUAL'])
  subscriptionRequired?: 'FREE' | 'MONTHLY' | 'ANNUAL';

  @ApiPropertyOptional({
    description: 'URL de la imagen del curso',
    example: 'https://mi-servidor.com/curso.jpg',
  })
  @IsOptional()
  @IsString()
  image?: string;
}
