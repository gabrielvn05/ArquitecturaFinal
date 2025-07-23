import { Module } from '@nestjs/common';
import { SubscriptionContext } from './strategies/subscription-context';
import { MonthlySubscriptionStrategy } from './strategies/monthly-subscription.strategy';
import { AnnualSubscriptionStrategy } from './strategies/annual-subscription.strategy';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';

@Module({
  providers: [
    SubscriptionContext,
    MonthlySubscriptionStrategy,
    AnnualSubscriptionStrategy,
    SubscriptionService,
  ],
  controllers: [SubscriptionController],
  exports: [SubscriptionContext, SubscriptionService],
})
export class SubscriptionModule {}