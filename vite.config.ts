import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import dns from 'dns';

dns.setDefaultResultOrder('ipv4first');

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      appType: 'spa',
      server: {
        port: 3002,
        strictPort: true,
        host: '0.0.0.0',
        proxy: {
          '/api': {
            target: 'http://localhost:3001',
            changeOrigin: true,
            configure: (proxy) => {
              proxy.on('error', (err, req, res) => {
                if (!res.headersSent) {
                  res.writeHead(200, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ success: false, message: 'Local API server unavailable' }));
                }
              });
            }
          }
        }
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
          input: {
            main: path.resolve(__dirname, 'index.html')
          }
        }
      }
    };
});
