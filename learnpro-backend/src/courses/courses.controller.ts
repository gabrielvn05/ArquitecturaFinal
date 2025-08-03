import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Patch,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

@ApiTags('Courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  @ApiOperation({ summary: 'Obtiene todos los cursos con información de acceso' })
  @ApiQuery({ name: 'userId', required: false, description: 'ID del usuario para verificar acceso' })
  @ApiResponse({ status: 200, description: 'Lista de cursos obtenida correctamente.' })
  findAll(@Query('userId') userId?: string) {
    return this.coursesService.findAll(userId);
  }

  @Get('available/:userId')
  @ApiOperation({ summary: 'Obtiene cursos disponibles según la suscripción del usuario' })
  @ApiResponse({ status: 200, description: 'Lista de cursos disponibles para el usuario.' })
  getAvailableCourses(@Param('userId') userId: string) {
    return this.coursesService.getAvailableCourses(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtiene un curso por su ID con verificación de acceso' })
  @ApiQuery({ name: 'userId', required: false, description: 'ID del usuario para verificar acceso' })
  findOne(@Param('id') id: string, @Query('userId') userId?: string) {
    return this.coursesService.findOne(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crea un nuevo curso' })
  create(@Body() dto: CreateCourseDto, @Request() req) {
    return this.coursesService.create(dto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualiza un curso existente' })
  update(@Param('id') id: string, @Body() dto: UpdateCourseDto, @Request() req) {
    return this.coursesService.update(id, dto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/image')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualiza solo la imagen del curso (solo ADMIN)' })
  updateCourseImage(@Param('id') id: string, @Body('image') image: string, @Request() req) {
    return this.coursesService.updateImage(id, image, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Elimina un curso' })
  remove(@Param('id') id: string, @Request() req) {
    return this.coursesService.remove(id, req.user);
  }
}
