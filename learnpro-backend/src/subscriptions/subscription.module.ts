import { Module } from '@nestjs/common';
import { SubscriptionContext } from './strategies/subscription-context';
import { FreeSubscriptionStrategy } from './strategies/free-subscription.strategy';
import { MonthlySubscriptionStrategy } from './strategies/monthly-subscription.strategy';
import { AnnualSubscriptionStrategy } from './strategies/annual-subscription.strategy';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  providers: [
    PrismaService,
    SubscriptionContext,
    FreeSubscriptionStrategy,
    MonthlySubscriptionStrategy,
    AnnualSubscriptionStrategy,
    SubscriptionService,
  ],
  controllers: [SubscriptionController],
  exports: [SubscriptionContext, SubscriptionService],
})
export class SubscriptionModule {}