import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    // This ensures that if the sitemap script runs, Vite doesn't 
    // clear the directory in a way that confuses the Vercel deployment.
    emptyOutDir: true, 
    outDir: 'dist',
  }
});