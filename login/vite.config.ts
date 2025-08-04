import { defineConfig } from 'vite';

export default defineConfig({
   build: {
    outDir: 'dist', // Asegúrate de que los archivos de salida estén en dist
    rollupOptions: {
      input: '/index.html', // Asegúrate de que el archivo HTML sea el correcto
    },},
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
