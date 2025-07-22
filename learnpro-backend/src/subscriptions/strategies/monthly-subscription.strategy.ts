import { SubscriptionStrategy } from './subscription-strategy.interface';

export class MonthlySubscriptionStrategy implements SubscriptionStrategy {
  async createSubscription(data: any): Promise<any> {
    // Lógica específica para suscripción mensual
    return { type: 'monthly', ...data };
  }
}