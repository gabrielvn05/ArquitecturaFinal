import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CoursesModule } from './courses/courses.module';
import { UsersModule } from './users/users.module';
import { TestController } from './test.controller';

@Module({
  imports: [AuthModule, CoursesModule, UsersModule], // SubscriptionModule
  controllers: [AppController, TestController],
  providers: [AppService],
})
export class AppModule {}
