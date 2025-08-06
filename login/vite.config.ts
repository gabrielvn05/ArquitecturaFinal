import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist', // carpeta de salida correcta
    rollupOptions: {
      input: 'index.html', // sin la barra inicial
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://arquitecturafinal.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
