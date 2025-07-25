import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({
    description: 'El título del curso',
    example: 'Introducción a NestJS',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'El contenido del curso',
    example: 'Curso introductorio sobre NestJS',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'Tipo de suscripción requerida para acceder al curso',
    example: 'FREE',
    enum: ['FREE', 'MONTHLY', 'ANNUAL'],
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsIn(['FREE', 'MONTHLY', 'ANNUAL'])
  subscriptionRequired?: 'FREE' | 'MONTHLY' | 'ANNUAL';

  @ApiProperty({
    description: 'ID del instructor asignado al curso',
    example: 'clm123abc456',
    required: false,
  })
  @IsOptional()
  @IsString()
  instructorId?: string;
}
