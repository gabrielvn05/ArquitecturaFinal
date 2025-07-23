import { SubscriptionStrategy } from './subscription-strategy.interface';

export class AnnualSubscriptionStrategy implements SubscriptionStrategy {
  async createSubscription(data: any): Promise<any> {
    return { type: 'annual', ...data };
  }
}