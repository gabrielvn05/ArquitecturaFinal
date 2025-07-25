import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionService } from '../subscription.service';
import { FreeSubscriptionStrategy } from '../strategies/free-subscription.strategy';
import { MonthlySubscriptionStrategy } from '../strategies/monthly-subscription.strategy';
import { AnnualSubscriptionStrategy } from '../strategies/annual-subscription.strategy';
import { PrismaService } from '../../../prisma/prisma.service';

describe('SubscriptionService - Strategy Pattern Tests', () => {
  let service: SubscriptionService;
  let prismaService: PrismaService;

  const mockPrismaService = {
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionService,
        FreeSubscriptionStrategy,
        MonthlySubscriptionStrategy,
        AnnualSubscriptionStrategy,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<SubscriptionService>(SubscriptionService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Strategy Pattern Implementation', () => {
    it('should return correct info for free subscription', async () => {
      const info = await service.getSubscriptionInfo('free');
      
      expect(info.type).toBe('free');
      expect(info.price).toBe(0);
      expect(info.features).toContain('Acceso a cursos básicos limitados');
    });

    it('should return correct info for monthly subscription', async () => {
      const info = await service.getSubscriptionInfo('monthly');
      
      expect(info.type).toBe('monthly');
      expect(info.price).toBe(9.99);
      expect(info.features).toContain('Acceso a todos los cursos básicos');
    });

    it('should return correct info for annual subscription', async () => {
      const info = await service.getSubscriptionInfo('annual');
      
      expect(info.type).toBe('annual');
      expect(info.price).toBe(99.99);
      expect(info.features).toContain('Acceso a todos los cursos premium');
    });

    it('should throw error for unsupported subscription type', async () => {
      await expect(
        service.getSubscriptionInfo('unsupported' as any)
      ).rejects.toThrow('Tipo de suscripción no soportado');
    });
  });

  describe('Subscription Creation with Strategy Pattern', () => {
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      name: 'Test User',
    };

    beforeEach(() => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.subscription.findFirst.mockResolvedValue(null);
    });

    it('should create free subscription using FreeSubscriptionStrategy', async () => {
      const mockSubscription = {
        id: 'sub-123',
        type: 'FREE',
        userId: 'user-123',
        startDate: new Date(),
        endDate: new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000), // 100 years
        active: true,
        user: mockUser,
      };

      mockPrismaService.subscription.create.mockResolvedValue(mockSubscription);

      const result = await service.createSubscription({
        type: 'free',
        userId: 'user-123',
      });

      expect(result.type).toBe('FREE');
      expect(result.price).toBe(0);
      expect(result.features).toContain('Acceso a cursos básicos limitados');
    });

    it('should create monthly subscription using MonthlySubscriptionStrategy', async () => {
      const mockSubscription = {
        id: 'sub-124',
        type: 'MONTHLY',
        userId: 'user-123',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        active: true,
        user: mockUser,
      };

      mockPrismaService.subscription.create.mockResolvedValue(mockSubscription);

      const result = await service.createSubscription({
        type: 'monthly',
        userId: 'user-123',
      });

      expect(result.type).toBe('MONTHLY');
      expect(result.price).toBe(9.99);
      expect(result.features).toContain('Acceso a todos los cursos básicos');
    });

    it('should create annual subscription using AnnualSubscriptionStrategy', async () => {
      const mockSubscription = {
        id: 'sub-125',
        type: 'ANNUAL',
        userId: 'user-123',
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 365 days
        active: true,
        user: mockUser,
      };

      mockPrismaService.subscription.create.mockResolvedValue(mockSubscription);

      const result = await service.createSubscription({
        type: 'annual',
        userId: 'user-123',
      });

      expect(result.type).toBe('ANNUAL');
      expect(result.price).toBe(99.99);
      expect(result.features).toContain('Acceso a todos los cursos premium');
    });
  });
});
