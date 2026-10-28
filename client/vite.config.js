import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/local-emergency-resource-finder/',
  server: {
    port: 5173,
    host: true
  }
});
