import { SubscriptionStrategy, SubscriptionStrategyData } from './subscription-strategy.interface';

export class SubscriptionContext {
  private strategy: SubscriptionStrategy;

  constructor(strategy: SubscriptionStrategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy: SubscriptionStrategy) {
    this.strategy = strategy;
  }

  async create(data: SubscriptionStrategyData) {
    return this.strategy.createSubscription(data);
  }

  getPrice(): number {
    return this.strategy.calculatePrice();
  }

  getFeatures(): string[] {
    return this.strategy.getFeatures();
  }

  calculateEndDate(startDate: Date): Date {
    return this.strategy.calculateEndDate(startDate);
  }
}