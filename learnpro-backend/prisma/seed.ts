import { PrismaClient, SubscriptionType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // 🔹 Limpiar datos existentes
  await prisma.subscription.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  // 🔹 Crear contraseñas encriptadas
  const studentPassword = await bcrypt.hash('student123', 10);
  const adminPassword = await bcrypt.hash('admin123', 10);
  const instructorPassword = await bcrypt.hash('instructor123', 10);

  // 🔹 Crear usuarios de demo
  const student = await prisma.user.create({
    data: {
      email: 'student@test.com',
      password: studentPassword,
      name: 'Juan Estudiante',
      role: 'STUDENT',
    },
  });

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

  // ✅ Crear cursos de prueba usando prisma.course.create
  await prisma.course.create({
    data: {
      title: 'Curso Gratuito: Introducción a la Programación',
      content: 'Este es un curso gratuito para aprender los conceptos básicos de programación.',
      subscriptionRequired: SubscriptionType.FREE,
      instructorId: instructor.id,
      image: 'https://picsum.photos/seed/free/600/400',
    },
  });

  await prisma.course.create({
    data: {
      title: 'Curso Premium: JavaScript Avanzado',
      content: 'Aprende JavaScript avanzado con ejemplos prácticos y proyectos reales.',
      subscriptionRequired: SubscriptionType.MONTHLY,
      instructorId: instructor.id,
      image: 'https://picsum.photos/seed/monthly/600/400',
    },
  });

  await prisma.course.create({
    data: {
      title: 'Curso Exclusivo: Arquitectura de Software',
      content: 'Curso avanzado sobre patrones de diseño y arquitectura de software empresarial.',
      subscriptionRequired: SubscriptionType.ANNUAL,
      instructorId: instructor.id,
      image: 'https://picsum.photos/seed/annual/600/400',
    },
  });

  // 🔹 Crear suscripciones de ejemplo
  await prisma.subscription.create({
    data: {
      type: SubscriptionType.FREE,
      userId: student.id,
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      active: true,
    },
  });

  await prisma.subscription.create({
    data: {
      type: SubscriptionType.ANNUAL,
      userId: admin.id,
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      active: true,
    },
  });

  console.log('✅ Datos de demo creados exitosamente:');
  console.log('👨‍🎓 Estudiante: student@test.com / student123');
  console.log('👑 Administrador: admin@test.com / admin123');
  console.log('👨‍🏫 Instructor: instructor@test.com / instructor123');
  console.log('📚 Cursos creados: 3 (FREE, MONTHLY, ANNUAL)');
}

main()
  .catch((e) => {
    console.error('❌ Error al seedear la base de datos:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
