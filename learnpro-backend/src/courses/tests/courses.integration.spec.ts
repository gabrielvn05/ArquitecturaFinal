import { Test, TestingModule } from '@nestjs/testing';
import { CoursesService } from '../courses.service';
import { SubscriptionService } from '../../subscriptions/subscription.service';
import { PrismaService } from '../../../prisma/prisma.service';

describe('Courses and Subscriptions Integration', () => {
  let coursesService: CoursesService;
  let subscriptionService: SubscriptionService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    course: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
    subscription: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockSubscriptionService = {
    getActiveSubscription: jest.fn(),
    createSubscription: jest.fn(),
    getUserSubscriptions: jest.fn(),
    cancelSubscription: jest.fn(),
    getSubscriptionInfo: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoursesService,
        {
          provide: SubscriptionService,
          useValue: mockSubscriptionService,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    coursesService = module.get<CoursesService>(CoursesService);
    subscriptionService = module.get<SubscriptionService>(SubscriptionService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('Course Access Control', () => {
    const mockFreeCourse = {
      id: 'course-free-1',
      title: 'Curso Gratuito',
      content: 'Contenido del curso gratuito',
      subscriptionRequired: 'FREE',
      instructor: {
        id: 'instructor-1',
        name: 'Juan Instructor',
        email: 'juan@instructor.com',
      },
    };

    const mockMonthlyCourse = {
      id: 'course-monthly-1',
      title: 'Curso Premium Mensual',
      content: 'Contenido premium del curso',
      subscriptionRequired: 'MONTHLY',
      instructor: {
        id: 'instructor-1',
        name: 'Juan Instructor',
        email: 'juan@instructor.com',
      },
    };

    const mockAnnualCourse = {
      id: 'course-annual-1',
      title: 'Curso Elite Anual',
      content: 'Contenido elite del curso',
      subscriptionRequired: 'ANNUAL',
      instructor: {
        id: 'instructor-1',
        name: 'Juan Instructor',
        email: 'juan@instructor.com',
      },
    };

    describe('Usuario con suscripción FREE', () => {
      beforeEach(() => {
        mockSubscriptionService.getActiveSubscription.mockRejectedValue(
          new Error('No subscription found')
        );
      });

      it('debe tener acceso a cursos FREE', async () => {
        mockPrismaService.course.findUnique.mockResolvedValue(mockFreeCourse);

        const result: any = await coursesService.findOne('course-free-1', 'user-free');

        expect(result.hasAccess).toBe(true);
        expect(result.content).toBe('Contenido del curso gratuito');
        expect(result.userSubscriptionRequired).toBe(false);
        expect(result.accessLevel.level).toBe('Gratuito');
      });

      it('NO debe tener acceso a cursos MONTHLY', async () => {
        mockPrismaService.course.findUnique.mockResolvedValue(mockMonthlyCourse);

        const result: any = await coursesService.findOne('course-monthly-1', 'user-free');

        expect(result.hasAccess).toBe(false);
        expect(result.content).toBe('Contenido restringido - Se requiere suscripción');
        expect(result.userSubscriptionRequired).toBe(true);
        expect(result.accessLevel.level).toBe('Premium');
      });

      it('NO debe tener acceso a cursos ANNUAL', async () => {
        mockPrismaService.course.findUnique.mockResolvedValue(mockAnnualCourse);

        const result: any = await coursesService.findOne('course-annual-1', 'user-free');

        expect(result.hasAccess).toBe(false);
        expect(result.content).toBe('Contenido restringido - Se requiere suscripción');
        expect(result.userSubscriptionRequired).toBe(true);
        expect(result.accessLevel.level).toBe('Premium Plus');
      });
    });

    describe('Usuario con suscripción MONTHLY', () => {
      beforeEach(() => {
        mockSubscriptionService.getActiveSubscription.mockResolvedValue({
          id: 'sub-monthly',
          type: 'MONTHLY',
          userId: 'user-monthly',
          active: true,
        });
      });

      it('debe tener acceso a cursos FREE', async () => {
        mockPrismaService.course.findUnique.mockResolvedValue(mockFreeCourse);

        const result: any = await coursesService.findOne('course-free-1', 'user-monthly');

        expect(result.hasAccess).toBe(true);
        expect(result.content).toBe('Contenido del curso gratuito');
      });

      it('debe tener acceso a cursos MONTHLY', async () => {
        mockPrismaService.course.findUnique.mockResolvedValue(mockMonthlyCourse);

        const result: any = await coursesService.findOne('course-monthly-1', 'user-monthly');

        expect(result.hasAccess).toBe(true);
        expect(result.content).toBe('Contenido premium del curso');
        expect(result.userSubscriptionRequired).toBe(false);
      });

      it('NO debe tener acceso a cursos ANNUAL', async () => {
        mockPrismaService.course.findUnique.mockResolvedValue(mockAnnualCourse);

        const result: any = await coursesService.findOne('course-annual-1', 'user-monthly');

        expect(result.hasAccess).toBe(false);
        expect(result.content).toBe('Contenido restringido - Se requiere suscripción');
        expect(result.userSubscriptionRequired).toBe(true);
      });
    });

    describe('Usuario con suscripción ANNUAL', () => {
      beforeEach(() => {
        mockSubscriptionService.getActiveSubscription.mockResolvedValue({
          id: 'sub-annual',
          type: 'ANNUAL',
          userId: 'user-annual',
          active: true,
        });
      });

      it('debe tener acceso a TODOS los cursos', async () => {
        // Test FREE course
        mockPrismaService.course.findUnique.mockResolvedValue(mockFreeCourse);
        const freeResult: any = await coursesService.findOne('course-free-1', 'user-annual');
        expect(freeResult.hasAccess).toBe(true);

        // Test MONTHLY course
        mockPrismaService.course.findUnique.mockResolvedValue(mockMonthlyCourse);
        const monthlyResult: any = await coursesService.findOne('course-monthly-1', 'user-annual');
        expect(monthlyResult.hasAccess).toBe(true);

        // Test ANNUAL course
        mockPrismaService.course.findUnique.mockResolvedValue(mockAnnualCourse);
        const annualResult: any = await coursesService.findOne('course-annual-1', 'user-annual');
        expect(annualResult.hasAccess).toBe(true);
        expect(annualResult.content).toBe('Contenido elite del curso');
      });
    });
  });

  describe('Available Courses Filter', () => {
    const allCourses = [
      {
        id: 'course-1',
        title: 'Curso Free',
        subscriptionRequired: 'FREE',
        instructor: { id: '1', name: 'Instructor', email: 'test@test.com' },
      },
      {
        id: 'course-2',
        title: 'Curso Monthly',
        subscriptionRequired: 'MONTHLY',
        instructor: { id: '1', name: 'Instructor', email: 'test@test.com' },
      },
      {
        id: 'course-3',
        title: 'Curso Annual',
        subscriptionRequired: 'ANNUAL',
        instructor: { id: '1', name: 'Instructor', email: 'test@test.com' },
      },
    ];

    it('debe filtrar cursos disponibles para usuario FREE', async () => {
      mockSubscriptionService.getActiveSubscription.mockRejectedValue(
        new Error('No subscription')
      );
      mockPrismaService.course.findMany.mockResolvedValue([allCourses[0]]);

      const result = await coursesService.getAvailableCourses('user-free');

      expect(mockPrismaService.course.findMany).toHaveBeenCalledWith({
        where: {
          subscriptionRequired: {
            in: ['FREE'],
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
      expect(result).toHaveLength(1);
      expect(result[0].subscriptionRequired).toBe('FREE');
    });

    it('debe filtrar cursos disponibles para usuario MONTHLY', async () => {
      mockSubscriptionService.getActiveSubscription.mockResolvedValue({
        type: 'MONTHLY',
      });
      mockPrismaService.course.findMany.mockResolvedValue([allCourses[0], allCourses[1]]);

      const result = await coursesService.getAvailableCourses('user-monthly');

      expect(mockPrismaService.course.findMany).toHaveBeenCalledWith({
        where: {
          subscriptionRequired: {
            in: ['FREE', 'MONTHLY'],
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
      expect(result).toHaveLength(2);
    });

    it('debe devolver todos los cursos para usuario ANNUAL', async () => {
      mockSubscriptionService.getActiveSubscription.mockResolvedValue({
        type: 'ANNUAL',
      });
      mockPrismaService.course.findMany.mockResolvedValue(allCourses);

      const result = await coursesService.getAvailableCourses('user-annual');

      expect(mockPrismaService.course.findMany).toHaveBeenCalledWith({
        where: {
          subscriptionRequired: {
            in: ['FREE', 'MONTHLY', 'ANNUAL'],
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
      expect(result).toHaveLength(3);
    });
  });

  describe('Access Level Information', () => {
    it('debe devolver información correcta para cada nivel', async () => {
      const service = coursesService as any;

      const freeInfo = service.getAccessLevelInfo('FREE');
      expect(freeInfo.level).toBe('Gratuito');
      expect(freeInfo.icon).toBe('🆓');

      const monthlyInfo = service.getAccessLevelInfo('MONTHLY');
      expect(monthlyInfo.level).toBe('Premium');
      expect(monthlyInfo.icon).toBe('⭐');

      const annualInfo = service.getAccessLevelInfo('ANNUAL');
      expect(annualInfo.level).toBe('Premium Plus');
      expect(annualInfo.icon).toBe('💎');
    });
  });

  describe('Course Creation with Subscription Level', () => {
    it('debe crear curso con nivel de suscripción específico', async () => {
      const createCourseDto = {
        title: 'Curso Premium',
        content: 'Contenido premium',
        subscriptionRequired: 'MONTHLY' as const,
      };

      const mockUser = {
        userId: 'instructor-1',
        role: 'INSTRUCTOR',
      };

      const expectedCourse = {
        id: 'new-course-id',
        ...createCourseDto,
        instructorId: 'instructor-1',
      };

      mockPrismaService.course.create.mockResolvedValue(expectedCourse);

      const result = await coursesService.create(createCourseDto, mockUser);

      expect(mockPrismaService.course.create).toHaveBeenCalledWith({
        data: {
          title: createCourseDto.title,
          content: createCourseDto.content,
          subscriptionRequired: 'MONTHLY',
          instructorId: 'instructor-1',
        },
      });

      expect(result.subscriptionRequired).toBe('MONTHLY');
    });

    it('debe usar FREE como valor por defecto si no se especifica nivel', async () => {
      const createCourseDto = {
        title: 'Curso Sin Nivel',
        content: 'Contenido sin nivel específico',
      };

      const mockUser = {
        userId: 'instructor-1',
        role: 'INSTRUCTOR',
      };

      mockPrismaService.course.create.mockResolvedValue({
        id: 'new-course-id',
        ...createCourseDto,
        subscriptionRequired: 'FREE',
        instructorId: 'instructor-1',
      });

      await coursesService.create(createCourseDto, mockUser);

      expect(mockPrismaService.course.create).toHaveBeenCalledWith({
        data: {
          title: createCourseDto.title,
          content: createCourseDto.content,
          subscriptionRequired: 'FREE',
          instructorId: 'instructor-1',
        },
      });
    });
  });
});
