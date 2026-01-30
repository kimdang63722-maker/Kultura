import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        rollupOptions: {
          external: [
            // Исключаем серверные файлы из браузерной сборки
            'server/utils/subscribers.ts',
            'server/utils/bot-handler.ts',
            'server/config/telegram.ts',
            'server/telegram-server.js',
            'server/scripts/setup-bot.js'
          ]
        }
      }
    };
});
