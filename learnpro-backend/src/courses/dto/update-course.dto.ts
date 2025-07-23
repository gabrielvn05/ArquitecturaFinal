import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCourseDto {
  @ApiPropertyOptional({
    description: 'El título del curso (opcional)',
    example: 'Curso avanzado de NestJS',  // Ejemplo opcional
  })
  title?: string;

  @ApiPropertyOptional({
    description: 'El contenido del curso (opcional)',
    example: 'Este curso cubre aspectos avanzados de NestJS.',  // Ejemplo opcional
  })
  content?: string;
}
