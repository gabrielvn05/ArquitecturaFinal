import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'john@example.com', description: 'Correo electrónico del usuario' })
  email: string;

  @ApiProperty({ example: 'securePassword123', description: 'Contraseña del usuario' })
  password: string;
}
