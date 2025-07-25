import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsEnum, IsOptional } from 'class-validator';
import { Role } from '@prisma/client';

export class RegisterDto {
  @ApiProperty({ example: 'john@example.com', description: 'Correo electrónico del usuario' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John Doe', description: 'Nombre completo del usuario' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'securePassword123', description: 'Contraseña del usuario' })
  @IsString()
  password: string;

  @ApiProperty({ example: 'STUDENT', description: 'Rol del usuario', enum: Role })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
