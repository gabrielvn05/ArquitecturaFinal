import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'john@example.com', description: 'Correo electrónico del usuario' })
  email: string;

  @ApiProperty({ example: 'John Doe', description: 'Nombre completo del usuario' })
  name: string;

  @ApiProperty({ example: 'securePassword123', description: 'Contraseña del usuario' })
  password: string;
}
