import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist', // Directorio de salida
  },
  server: {
    proxy: {
      // Redirigir las solicitudes a tu backend de Render
      '/api': {
        target: 'https://arquitecturafinal.onrender.com', // URL de tu backend en Render
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
