import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCourseDto, user: any) {
    if (!['INSTRUCTOR', 'ADMIN'].includes(user.role)) {
      throw new ForbiddenException('Only instructors or admins can create courses');
    }

    return this.prisma.course.create({
      data: {
        ...dto,
        instructorId: user.userId,
      },
    });
  }

  findAll() {
    return this.prisma.course.findMany({
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

  async findOne(id: string) {
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course) throw new NotFoundException('Course not found');
    return course;
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
}
