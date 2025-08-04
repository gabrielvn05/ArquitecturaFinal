import { defineConfig } from 'vite';

export default defineConfig({
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
