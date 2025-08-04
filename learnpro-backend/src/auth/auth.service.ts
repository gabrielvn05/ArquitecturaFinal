import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existingUser) throw new UnauthorizedException('Email already in use');

    const hash = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hash,
        name: dto.name,
        role: dto.role ?? 'STUDENT',
      },
    });

    return this.generateToken(user);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });

    if (!user) throw new UnauthorizedException('User not found');
    if (!(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid password');
    }
    if (!user.isActive) throw new UnauthorizedException('User is inactive');

    return this.generateToken(user);
  }

  private generateToken(user: { id: string; email: string; role: string; name: string }) {
    const payload = { userId: user.id, email: user.email, role: user.role, name: user.name };

    return {
      access_token: this.jwt.sign(payload), // ✅ payload consistente
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
    };
  }
}
