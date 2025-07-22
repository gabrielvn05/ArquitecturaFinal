import { SubscriptionStrategy } from './subscription-strategy.interface';

export class AnnualSubscriptionStrategy implements SubscriptionStrategy {
  async createSubscription(data: any): Promise<any> {
    // Lógica específica para suscripción anual
    return { type: 'annual', ...data };
  }
}