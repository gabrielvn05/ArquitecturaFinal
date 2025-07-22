# LearnPro - Fullstack App

LearnPro es una aplicación fullstack compuesta por un **backend con NestJS + Prisma** y un **frontend con React + TypeScript (Vite)**. Esta guía explica cómo instalar las dependencias y ejecutar ambos entornos de desarrollo localmente.

## Estructura del Proyecto

learnpro/

├── learnpro-backend/ # Backend con NestJS y Prisma

└── login/ # Frontend con React + Vite + TypeScript


## Requisitos Previos

Asegúrate de tener instalados:

- Node.js (v16 o superior)
- npm
- Prisma CLI (`npm install -g prisma`)
- Una base de datos (por ejemplo PostgreSQL o SQLite)

## Instalación y Ejecución del Backend

cd learnpro-backend

npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt

npm install --save-dev @types/passport-jwt @types/bcrypt

## Creamos el archivo .env y agregamos lo siguiente

DATABASE_URL="ubicar aqui cadena de coneccion a bd postgres sin eliminar comillar"

JWT_SECRET="poner clave secreta y eliminar comillas"

## Migramos la Base de datos y luego ejecutamos el servicio
 
npx prisma migrate dev --name init

npm run start:dev

cd ..

## Instalación y Ejecución del Frontend

cd login

npm create vite@latest login -- --template react-ts

npm install

npm install react-router-dom

npm install --save-dev @types/react-router-dom

npm run dev

