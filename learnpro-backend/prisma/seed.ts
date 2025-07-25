import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Limpiar datos existentes
  await prisma.subscription.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  // Crear usuarios de demo con contraseñas específicas
  const studentPassword = await bcrypt.hash('student123', 10);
  const adminPassword = await bcrypt.hash('admin123', 10);
  const instructorPassword = await bcrypt.hash('instructor123', 10);

  // Usuario Estudiante para demo
  const student = await prisma.user.create({
    data: {
      email: 'student@test.com',
      password: studentPassword,
      name: 'Juan Estudiante',
      role: 'STUDENT',
    },
  });

  // Usuario Administrador para demo
  const admin = await prisma.user.create({
    data: {
      email: 'admin@test.com',
      password: adminPassword,
      name: 'Administrador',
      role: 'ADMIN',
    },
  });

  const instructor = await prisma.user.create({
    data: {
      email: 'instructor@test.com',
      password: instructorPassword,
      name: 'Instructor Test',
      role: 'INSTRUCTOR',
    },
  });

  // Crear cursos de prueba
  const freeCourse = await prisma.course.create({
    data: {
      title: 'Curso Gratuito: Introducción a la Programación',
      content: 'Este es un curso gratuito para aprender los conceptos básicos de programación.',
      subscriptionRequired: 'FREE',
      instructorId: instructor.id,
    },
  });

  const monthlyCourse = await prisma.course.create({
    data: {
      title: 'Curso Premium: JavaScript Avanzado',
      content: 'Aprende JavaScript avanzado con ejemplos prácticos y proyectos reales.',
      subscriptionRequired: 'MONTHLY',
      instructorId: instructor.id,
    },
  });

  const annualCourse = await prisma.course.create({
    data: {
      title: 'Curso Exclusivo: Arquitectura de Software',
      content: 'Curso avanzado sobre patrones de diseño y arquitectura de software empresarial.',
      subscriptionRequired: 'ANNUAL',
      instructorId: instructor.id,
    },
  });

  // Crear suscripción gratuita para el estudiante
  await prisma.subscription.create({
    data: {
      type: 'FREE',
      userId: student.id,
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 año
      active: true,
    },
  });

  // Crear suscripción annual para el admin
  await prisma.subscription.create({
    data: {
      type: 'ANNUAL',
      userId: admin.id,
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 año
      active: true,
    },
  });

  console.log('✅ Datos de demo creados exitosamente:');
  console.log('👨‍🎓 Estudiante: student@test.com / student123');
  console.log('👑 Administrador: admin@test.com / admin123');
  console.log('👨‍🏫 Instructor: instructor@test.com / instructor123');
  console.log('👨‍💼 Admin: admin@test.com / 123456');
  console.log('📚 Cursos creados: 3 (FREE, MONTHLY, ANNUAL)');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
