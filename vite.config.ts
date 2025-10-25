import path from 'path';
import checker from 'vite-plugin-checker';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';

// ----------------------------------------------------------------------

const PORT = 3039;

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    checker({
      typescript: true,
      eslint: {
        useFlatConfig: true,
        lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}"',
        dev: { logLevel: ['warn'] }, // changed from 'error' to 'warn'
      },
      overlay: true, // still show overlay for dev errors
    }),
  ],
  resolve: {
    alias: [
      {
        find: /^src(.+)/,
        replacement: path.resolve(process.cwd(), 'src/$1'),
      },
      {
        find: '@',
        replacement: path.resolve(__dirname, 'src'),
      },
    ],
  },
  server: {
    port: PORT,
    host: true,
    strictPort: false,
    allowedHosts: [
      '2eb2c21a3889.ngrok-free.app',
    ],
  },
  preview: {
    port: PORT,
    host: true,
    strictPort: false,
    allowedHosts: [
      '2eb2c21a3889.ngrok-free.app',
    ],
  },
});
