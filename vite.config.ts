import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: 'localhost',
    port: 8080,
    open: true, // 自动打开浏览器
    proxy: {
      ['/api/']: {
        target: 'http://localhost:3000',
        changeOrigin: true,
        // rewrite: (path) => path.replace(new RegExp("^" + env.VITE_APP_BASE_API), ""),
      },
    },
  },
  plugins: [vue()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.vue'],
    alias: {
      '@': path.resolve('./src'), //@代替scr
      '#': path.resolve('./types'), //#代替types
    },
  },
});
