import { IsString, IsNotEmpty, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubscriptionDto {
  @ApiProperty({
    example: 'premium',
    description: 'Tipo de suscripción (por ejemplo: free, basic, premium)',
  })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    example: { userId: 'uuid', duration: 30 },
    description: 'Datos adicionales relacionados con la suscripción',
    type: Object,
  })
  @IsObject()
  @IsNotEmpty()
  data: object;
}
