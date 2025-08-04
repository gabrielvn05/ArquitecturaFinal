import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { SubscriptionService } from '../subscriptions/subscription.service';
import { SubscriptionType } from '@prisma/client';

@Injectable()
export class CoursesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  async create(dto: CreateCourseDto, user: any) {
    if (!['INSTRUCTOR', 'ADMIN'].includes(user.role)) {
      throw new ForbiddenException('Only instructors or admins can create courses');
    }

    const instructorId =
      user.role === 'ADMIN' && dto.instructorId ? dto.instructorId : user.userId;

    return this.prisma.course.create({
      data: {
        title: dto.title,
        content: dto.content,
        subscriptionRequired: (dto.subscriptionRequired as SubscriptionType) || SubscriptionType.FREE,
        instructorId,
        image: (dto as any).image ?? null,
      },
      include: {
        instructor: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async findAll(userId?: string) {
    const courses = await this.prisma.course.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        subscriptionRequired: true,
        createdAt: true,
        updatedAt: true,
        instructorId: true,
        image: true,
        instructor: { select: { id: true, name: true, email: true } },
      },
    });

    if (!userId) {
      return courses.map((course) => ({
        ...course,
        accessLevel: this.getAccessLevelInfo(course.subscriptionRequired),
      }));
    }

    let userSubscription: any = null;
    try {
      userSubscription = await this.subscriptionService.getActiveSubscription(userId);
    } catch {}

    return courses.map((course) => ({
      ...course,
      hasAccess: this.checkUserAccess(course.subscriptionRequired, userSubscription?.type),
      accessLevel: this.getAccessLevelInfo(course.subscriptionRequired),
      userSubscriptionRequired: !this.checkUserAccess(course.subscriptionRequired, userSubscription?.type),
    }));
  }

  async findOne(id: string, userId?: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        content: true,
        subscriptionRequired: true,
        createdAt: true,
        updatedAt: true,
        instructorId: true,
        image: true,
        instructor: { select: { id: true, name: true, email: true } },
      },
    });

    if (!course) throw new NotFoundException('Course not found');

    if (!userId) {
      return { ...course, accessLevel: this.getAccessLevelInfo(course.subscriptionRequired) };
    }

    let userSubscription: any = null;
    try {
      userSubscription = await this.subscriptionService.getActiveSubscription(userId);
    } catch {}

    const hasAccess = this.checkUserAccess(course.subscriptionRequired, userSubscription?.type);

    return {
      ...course,
      hasAccess,
      accessLevel: this.getAccessLevelInfo(course.subscriptionRequired),
      userSubscriptionRequired: !hasAccess,
      content: hasAccess ? course.content : 'Contenido restringido - Se requiere suscripción',
    };
  }

  async update(id: string, dto: UpdateCourseDto, user: any) {
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course) throw new NotFoundException('Course not found');

    if (course.instructorId !== user.userId && user.role !== 'ADMIN') {
      throw new ForbiddenException('You are not allowed to update this course');
    }

    return this.prisma.course.update({
      where: { id },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.content && { content: dto.content }),
        ...(dto.subscriptionRequired && { subscriptionRequired: dto.subscriptionRequired as SubscriptionType }),
        ...(dto.image && { image: dto.image }),
      },
    });
  }

  async updateImage(id: string, imageUrl: string, user: any) {
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course) throw new NotFoundException('Course not found');

    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('Only admins can change course images');
    }

    return this.prisma.course.update({
      where: { id },
      data: { image: imageUrl },
      select: { id: true, title: true, image: true },
    });
  }

  async remove(id: string, user: any) {
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course) throw new NotFoundException('Course not found');

    if (course.instructorId !== user.userId && user.role !== 'ADMIN') {
      throw new ForbiddenException('You are not allowed to delete this course');
    }

    return this.prisma.course.delete({ where: { id } });
  }

  private checkUserAccess(requiredSubscription: string, userSubscription?: string): boolean {
    const subscriptionLevels = { FREE: 0, MONTHLY: 1, ANNUAL: 2 };
    const requiredLevel = subscriptionLevels[requiredSubscription as keyof typeof subscriptionLevels] || 0;
    const userLevel = subscriptionLevels[userSubscription as keyof typeof subscriptionLevels] || 0;
    return userLevel >= requiredLevel;
  }

  private getAccessLevelInfo(subscriptionRequired: string) {
    const accessInfo = {
      FREE: { level: 'Gratuito', description: 'Acceso libre', icon: '🆓' },
      MONTHLY: { level: 'Premium', description: 'Requiere suscripción mensual o anual', icon: '⭐' },
      ANNUAL: { level: 'Premium Plus', description: 'Requiere suscripción anual', icon: '💎' },
    };
    return accessInfo[subscriptionRequired as keyof typeof accessInfo] || accessInfo.FREE;
  }

  async getAvailableCourses(userId: string) {
    let userSubscription: any = null;
    try {
      userSubscription = await this.subscriptionService.getActiveSubscription(userId);
    } catch {}

    const subscriptionType = userSubscription?.type || SubscriptionType.FREE;

    return this.prisma.course.findMany({
      where: {
        subscriptionRequired: {
          in: this.getAllowedSubscriptionTypes(subscriptionType), // ✅ ahora devuelve SubscriptionType[]
        },
      },
      select: {
        id: true,
        title: true,
        content: true,
        subscriptionRequired: true,
        createdAt: true,
        updatedAt: true,
        instructorId: true,
        image: true,
        instructor: { select: { id: true, name: true, email: true } },
      },
    });
  }

  private getAllowedSubscriptionTypes(userSubscription: SubscriptionType): SubscriptionType[] {
    const allowedTypes: Record<SubscriptionType, SubscriptionType[]> = {
      FREE: [SubscriptionType.FREE],
      MONTHLY: [SubscriptionType.FREE, SubscriptionType.MONTHLY],
      ANNUAL: [SubscriptionType.FREE, SubscriptionType.MONTHLY, SubscriptionType.ANNUAL],
    };
    return allowedTypes[userSubscription] || [SubscriptionType.FREE];
  }
}
