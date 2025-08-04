import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(role?: string) {
    const where = role ? { role: role as Role } : {};
    
    const users = await this.prisma.user.findMany({
      where,
      include: {
        subscriptions: {
          where: { active: true },
          take: 1,
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      subscriptionType: user.subscriptions[0]?.type || 'FREE',
      createdAt: user.createdAt,
      isActive: user.isActive
    }));
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        subscriptions: {
          where: { active: true },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      subscriptionType: user.subscriptions[0]?.type || 'FREE',
      createdAt: user.createdAt,
      isActive: user.isActive
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      include: {
        subscriptions: {
          where: { active: true },
          take: 1,
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    return {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      subscriptionType: updatedUser.subscriptions[0]?.type || 'FREE',
      createdAt: updatedUser.createdAt,
      isActive: updatedUser.isActive
    };
  }

  async toggleStatus(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { isActive: !user.isActive },
      include: {
        subscriptions: {
          where: { active: true },
          take: 1,
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    return {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      subscriptionType: updatedUser.subscriptions[0]?.type || 'FREE',
      createdAt: updatedUser.createdAt,
      isActive: updatedUser.isActive
    };
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    await this.prisma.user.delete({ where: { id } });
    return { message: 'Usuario eliminado exitosamente' };
  }

  async getStats() {
    const totalUsers = await this.prisma.user.count();
    const activeUsers = await this.prisma.user.count({ where: { isActive: true } });
    const usersByRole = await this.prisma.user.groupBy({
      by: ['role'],
      _count: { role: true }
    });

    const usersBySubscription = await this.prisma.subscription.groupBy({
      by: ['type'],
      where: { active: true },
      _count: { type: true }
    });

    return {
      totalUsers,
      activeUsers,
      inactiveUsers: totalUsers - activeUsers,
      usersByRole: usersByRole.reduce((acc, item) => {
        acc[item.role] = item._count.role;
        return acc;
      }, {}),
      usersBySubscription: usersBySubscription.reduce((acc, item) => {
        acc[item.type] = item._count.type;
        return acc;
      }, {})
    };
  }
}
