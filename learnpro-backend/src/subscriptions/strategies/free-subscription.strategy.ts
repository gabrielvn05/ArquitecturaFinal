import { Injectable } from '@nestjs/common';
import { SubscriptionStrategy, SubscriptionStrategyData } from './subscription-strategy.interface';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class FreeSubscriptionStrategy implements SubscriptionStrategy {
  constructor(private readonly prisma: PrismaService) {}

  async createSubscription(data: SubscriptionStrategyData): Promise<any> {
    const startDate = data.startDate || new Date();
    const endDate = this.calculateEndDate(startDate);
    
    // Para suscripción gratuita, verificamos si ya existe una activa
    const existingFreeSubscription = await this.prisma.subscription.findFirst({
      where: {
        userId: data.userId,
        type: 'FREE',
        active: true,
      },
    });

    if (existingFreeSubscription) {
      throw new Error('El usuario ya tiene una suscripción gratuita activa');
    }

    const subscription = await this.prisma.subscription.create({
      data: {
        type: 'FREE',
        userId: data.userId,
        startDate,
        endDate,
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

    return {
      ...subscription,
      price: this.calculatePrice(),
      features: this.getFeatures(),
    };
  }

  calculatePrice(): number {
    return 0; // Precio gratuito
  }

  calculateEndDate(startDate: Date): Date {
    // La suscripción gratuita nunca expira
    const endDate = new Date(startDate);
    endDate.setFullYear(endDate.getFullYear() + 100); // 100 años en el futuro
    return endDate;
  }

  getFeatures(): string[] {
    return [
      'Acceso a cursos básicos limitados',
      'Soporte por comunidad',
      'Sin certificados',
      'Contenido limitado',
    ];
  }
}
