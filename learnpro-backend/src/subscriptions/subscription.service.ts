import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { SubscriptionContext } from './strategies/subscription-context';
import { SubscriptionStrategyData } from './strategies/subscription-strategy.interface';
import { FreeSubscriptionStrategy } from './strategies/free-subscription.strategy';
import { MonthlySubscriptionStrategy } from './strategies/monthly-subscription.strategy';
import { AnnualSubscriptionStrategy } from './strategies/annual-subscription.strategy';

@Injectable()
export class SubscriptionService {
  private readonly freeStrategy: FreeSubscriptionStrategy;
  private readonly monthlyStrategy: MonthlySubscriptionStrategy;
  private readonly annualStrategy: AnnualSubscriptionStrategy;

  constructor(private readonly prisma: PrismaService) {
    this.freeStrategy = new FreeSubscriptionStrategy(prisma);
    this.monthlyStrategy = new MonthlySubscriptionStrategy(prisma);
    this.annualStrategy = new AnnualSubscriptionStrategy(prisma);
  }

  async createSubscription(createSubscriptionDto: CreateSubscriptionDto) {
    // Verificar si el usuario existe
    const user = await this.prisma.user.findUnique({
      where: { id: createSubscriptionDto.userId },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Verificar si ya tiene una suscripción activa
    const existingSubscription = await this.prisma.subscription.findFirst({
      where: {
        userId: createSubscriptionDto.userId,
        active: true,
      },
    });

    if (existingSubscription) {
      throw new BadRequestException('El usuario ya tiene una suscripción activa');
    }

    // Seleccionar estrategia basada en el tipo
    let context: SubscriptionContext;
    
    if (createSubscriptionDto.type === 'free') {
      context = new SubscriptionContext(this.freeStrategy);
    } else if (createSubscriptionDto.type === 'monthly') {
      context = new SubscriptionContext(this.monthlyStrategy);
    } else if (createSubscriptionDto.type === 'annual') {
      context = new SubscriptionContext(this.annualStrategy);
    } else {
      throw new BadRequestException('Tipo de suscripción no válido');
    }

    const strategyData: SubscriptionStrategyData = {
      userId: createSubscriptionDto.userId,
      startDate: createSubscriptionDto.startDate ? new Date(createSubscriptionDto.startDate) : undefined,
    };

    return context.create(strategyData);
  }

  async getUserSubscriptions(userId: string) {
    // Verificar si el usuario existe
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return this.prisma.subscription.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getActiveSubscription(userId: string) {
    // Verificar si el usuario existe
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const subscription = await this.prisma.subscription.findFirst({
      where: {
        userId,
        active: true,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!subscription) {
      throw new NotFoundException('No se encontró una suscripción activa');
    }

    return subscription;
  }

  async cancelSubscription(subscriptionId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!subscription) {
      throw new NotFoundException('Suscripción no encontrada');
    }

    if (!subscription.active) {
      throw new BadRequestException('La suscripción ya está cancelada');
    }

    return this.prisma.subscription.update({
      where: { id: subscriptionId },
      data: { active: false },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async getSubscriptionInfo(type: 'free' | 'monthly' | 'annual') {
    let context: SubscriptionContext;
    
    if (type === 'free') {
      context = new SubscriptionContext(this.freeStrategy);
    } else if (type === 'monthly') {
      context = new SubscriptionContext(this.monthlyStrategy);
    } else if (type === 'annual') {
      context = new SubscriptionContext(this.annualStrategy);
    } else {
      throw new BadRequestException('Tipo de suscripción no válido');
    }

    return {
      type: type.toUpperCase(),
      price: context.getPrice(),
      features: context.getFeatures(),
      duration: context.calculateEndDate(new Date()),
    };
  }

  async getAllSubscriptions() {
    return this.prisma.subscription.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
