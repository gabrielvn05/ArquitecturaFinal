import { IsString, IsNotEmpty, IsUUID, IsOptional, IsDateString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubscriptionDto {
  @ApiProperty({
    example: 'monthly',
    description: 'Tipo de suscripción',
    enum: ['free', 'monthly', 'annual'],
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['free', 'monthly', 'annual'])
  type: 'free' | 'monthly' | 'annual';

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID del usuario que se suscribe',
  })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    example: '2025-01-01T00:00:00Z',
    description: 'Fecha de inicio de la suscripción (opcional, por defecto es la fecha actual)',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;
}
