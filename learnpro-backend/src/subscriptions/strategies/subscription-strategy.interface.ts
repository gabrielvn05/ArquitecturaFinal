export interface SubscriptionStrategyData {
  userId: string;
  startDate?: Date;
}

export interface SubscriptionStrategy {
  createSubscription(data: SubscriptionStrategyData): Promise<any>;
  calculatePrice(): number;
  calculateEndDate(startDate: Date): Date;
  getFeatures(): string[];
}