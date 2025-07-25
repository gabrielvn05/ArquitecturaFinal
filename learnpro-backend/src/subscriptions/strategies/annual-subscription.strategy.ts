 import { Injectable } from '@nestjs/common';
import { SubscriptionStrategy, SubscriptionStrategyData } from './subscription-strategy.interface';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class AnnualSubscriptionStrategy implements SubscriptionStrategy {
  constructor(private readonly prisma: PrismaService) {}

  async createSubscription(data: SubscriptionStrategyData): Promise<any> {
    const startDate = data.startDate || new Date();
    const endDate = this.calculateEndDate(startDate);
    
    const subscription = await this.prisma.subscription.create({
      data: {
        type: 'ANNUAL',
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
    return 99.99; // Precio anual (equivalente a 10 meses pagando mensual)
  }

  calculateEndDate(startDate: Date): Date {
    const endDate = new Date(startDate);
    endDate.setFullYear(endDate.getFullYear() + 1);
    return endDate;
  }

  getFeatures(): string[] {
    return [
      'Acceso a todos los cursos premium',
      'Soporte prioritario 24/7',
      'Certificados de finalización',
      'Acceso a contenido exclusivo',
      'Mentorías personalizadas',
      'Descuentos en cursos adicionales',
    ];
  }
}