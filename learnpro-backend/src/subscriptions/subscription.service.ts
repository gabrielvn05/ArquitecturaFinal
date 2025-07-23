import { Injectable } from '@nestjs/common';
import { SubscriptionContext } from './strategies/subscription-context';
import { MonthlySubscriptionStrategy } from './strategies/monthly-subscription.strategy';
import { AnnualSubscriptionStrategy } from './strategies/annual-subscription.strategy';

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly monthlyStrategy: MonthlySubscriptionStrategy,
    private readonly annualStrategy: AnnualSubscriptionStrategy,
  ) {}

  async createSubscription(type: string, data: any) {
    let context: SubscriptionContext;

    if (type === 'monthly') {
      context = new SubscriptionContext(this.monthlyStrategy);
    } else if (type === 'annual') {
      context = new SubscriptionContext(this.annualStrategy);
    } else {
      throw new Error('Tipo de suscripción no soportado');
    }

    return context.create(data);
  }
}