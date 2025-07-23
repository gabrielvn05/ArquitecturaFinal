import { ApiProperty } from '@nestjs/swagger';

export class CreateCourseDto {
  @ApiProperty({
    description: 'El título del curso',
    example: 'Introducción a NestJS',  // Ejemplo de lo que espera recibir
  })
  title: string;

  @ApiProperty({
    description: 'El contenido del curso',
    example: 'Curso introductorio sobre NestJS',  // Ejemplo de lo que espera recibir
  })
  content: string;
}
