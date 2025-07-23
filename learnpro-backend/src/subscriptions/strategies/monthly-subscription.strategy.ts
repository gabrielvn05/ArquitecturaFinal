import { SubscriptionStrategy } from './subscription-strategy.interface';

export class MonthlySubscriptionStrategy implements SubscriptionStrategy {
  async createSubscription(data: any): Promise<any> {
    return { type: 'monthly', ...data };
  }
}