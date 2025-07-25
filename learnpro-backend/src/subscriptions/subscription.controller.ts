import { Controller, Post, Get, Patch, Body, Param, Query } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  async createSubscription(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return this.subscriptionService.createSubscription(createSubscriptionDto);
  }

  @Get('user/:userId')
  async getUserSubscriptions(@Param('userId') userId: string) {
    return this.subscriptionService.getUserSubscriptions(userId);
  }

  @Get('user/:userId/active')
  async getActiveSubscription(@Param('userId') userId: string) {
    return this.subscriptionService.getActiveSubscription(userId);
  }

  @Patch(':id/cancel')
  async cancelSubscription(@Param('id') id: string) {
    return this.subscriptionService.cancelSubscription(id);
  }

  @Get('info')
  async getSubscriptionInfo(@Query('type') type: 'free' | 'monthly' | 'annual') {
    return this.subscriptionService.getSubscriptionInfo(type);
  }

  @Get('plans')
  async getAllSubscriptions() {
    return this.subscriptionService.getAllSubscriptions();
  }
}
