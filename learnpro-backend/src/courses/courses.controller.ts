import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

@ApiTags('Courses')  // Agrupamos los endpoints bajo la etiqueta 'Courses'
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  @ApiOperation({ summary: 'Obtiene todos los cursos' })  // Descripción de la operación
  @ApiResponse({ status: 200, description: 'Lista de cursos obtenida correctamente.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  findAll() {
    return this.coursesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtiene un curso por su ID' })
  @ApiResponse({ status: 200, description: 'Curso obtenido correctamente.' })
  @ApiResponse({ status: 404, description: 'Curso no encontrado.' })
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()  // Si usas autenticación JWT, esta es la forma de documentarlo
  @ApiOperation({ summary: 'Crea un nuevo curso' })
  @ApiResponse({ status: 201, description: 'Curso creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Error en los datos enviados.' })
  create(@Body() dto: CreateCourseDto, @Request() req) {
    return this.coursesService.create(dto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualiza un curso existente' })
  @ApiResponse({ status: 200, description: 'Curso actualizado correctamente.' })
  @ApiResponse({ status: 404, description: 'Curso no encontrado.' })
  update(@Param('id') id: string, @Body() dto: UpdateCourseDto, @Request() req) {
    return this.coursesService.update(id, dto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Elimina un curso' })
  @ApiResponse({ status: 200, description: 'Curso eliminado correctamente.' })
  @ApiResponse({ status: 404, description: 'Curso no encontrado.' })
  remove(@Param('id') id: string, @Request() req) {
    return this.coursesService.remove(id, req.user);
  }
}
