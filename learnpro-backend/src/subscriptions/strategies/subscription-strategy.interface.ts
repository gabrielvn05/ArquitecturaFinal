export interface SubscriptionStrategy {
  createSubscription(data: any): Promise<any>;
}