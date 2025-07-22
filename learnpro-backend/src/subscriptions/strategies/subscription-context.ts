import { SubscriptionStrategy } from './subscription-strategy.interface';

export class SubscriptionContext {
  private strategy: SubscriptionStrategy;

  constructor(strategy: SubscriptionStrategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy: SubscriptionStrategy) {
    this.strategy = strategy;
  }

  async create(data: any) {
    return this.strategy.createSubscription(data);
  }
}