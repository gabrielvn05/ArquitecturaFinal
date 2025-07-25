import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { SubscriptionService } from '../subscriptions/subscription.service';

@Injectable()
export class CoursesService {
  constructor(
    private prisma: PrismaService,
    private subscriptionService: SubscriptionService,
  ) {}

  async create(dto: CreateCourseDto, user: any) {
    if (!['INSTRUCTOR', 'ADMIN'].includes(user.role)) {
      throw new ForbiddenException('Only instructors or admins can create courses');
    }

    // Si es admin y se especifica instructorId, usarlo; si no, usar el usuario actual
    const instructorId = (user.role === 'ADMIN' && dto.instructorId) 
      ? dto.instructorId 
      : user.userId;

    return this.prisma.course.create({
      data: {
        title: dto.title,
        content: dto.content,
        subscriptionRequired: dto.subscriptionRequired || 'FREE',
        instructorId: instructorId,
      },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findAll(userId?: string) {
    const courses = await this.prisma.course.findMany({
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Si no hay userId, devolver todos los cursos con información básica
    if (!userId) {
      return courses.map(course => ({
        ...course,
        accessLevel: this.getAccessLevelInfo(course.subscriptionRequired),
      }));
    }

    // Si hay userId, verificar acceso para cada curso
    let userSubscription: any = null;
    try {
      userSubscription = await this.subscriptionService.getActiveSubscription(userId);
    } catch (error) {
      // Usuario no tiene suscripción activa
    }

    return courses.map(course => ({
      ...course,
      hasAccess: this.checkUserAccess(course.subscriptionRequired, userSubscription?.type),
      accessLevel: this.getAccessLevelInfo(course.subscriptionRequired),
      userSubscriptionRequired: !this.checkUserAccess(course.subscriptionRequired, userSubscription?.type),
    }));
  }

  async findOne(id: string, userId?: string) {
    const course = await this.prisma.course.findUnique({ 
      where: { id },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    
    if (!course) throw new NotFoundException('Course not found');

    // Si no hay userId, devolver curso con información básica
    if (!userId) {
      return {
        ...course,
        accessLevel: this.getAccessLevelInfo(course.subscriptionRequired),
      };
    }

    // Verificar acceso del usuario
    let userSubscription: any = null;
    try {
      userSubscription = await this.subscriptionService.getActiveSubscription(userId);
    } catch (error) {
      // Usuario no tiene suscripción activa
    }

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
      data: dto,
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

  // Métodos auxiliares para verificar acceso basado en suscripciones
  private checkUserAccess(requiredSubscription: string, userSubscription?: string): boolean {
    // Jerarquía de suscripciones: FREE < MONTHLY < ANNUAL
    const subscriptionLevels = {
      FREE: 0,
      MONTHLY: 1,
      ANNUAL: 2,
    };

    const requiredLevel = subscriptionLevels[requiredSubscription as keyof typeof subscriptionLevels] || 0;
    const userLevel = subscriptionLevels[userSubscription as keyof typeof subscriptionLevels] || 0;

    return userLevel >= requiredLevel;
  }

  private getAccessLevelInfo(subscriptionRequired: string) {
    const accessInfo = {
      FREE: {
        level: 'Gratuito',
        description: 'Acceso libre',
        icon: '🆓',
      },
      MONTHLY: {
        level: 'Premium',
        description: 'Requiere suscripción mensual o anual',
        icon: '⭐',
      },
      ANNUAL: {
        level: 'Premium Plus',
        description: 'Requiere suscripción anual',
        icon: '💎',
      },
    };

    return accessInfo[subscriptionRequired as keyof typeof accessInfo] || accessInfo.FREE;
  }

  // Método para obtener cursos disponibles según la suscripción del usuario
  async getAvailableCourses(userId: string) {
    let userSubscription: any = null;
    try {
      userSubscription = await this.subscriptionService.getActiveSubscription(userId);
    } catch (error) {
      // Usuario no tiene suscripción activa, solo acceso FREE
    }

    const subscriptionType = userSubscription?.type || 'FREE';
    
    return this.prisma.course.findMany({
      where: {
        subscriptionRequired: {
          in: this.getAllowedSubscriptionTypes(subscriptionType),
        },
      },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  private getAllowedSubscriptionTypes(userSubscription: string): any[] {
    const allowedTypes = {
      FREE: ['FREE'],
      MONTHLY: ['FREE', 'MONTHLY'],
      ANNUAL: ['FREE', 'MONTHLY', 'ANNUAL'],
    };

    return allowedTypes[userSubscription as keyof typeof allowedTypes] || ['FREE'];
  }
}
