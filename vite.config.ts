import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { cpSync, readdirSync, statSync, existsSync, mkdirSync } from 'fs';
import { join, resolve } from 'path';

function copyPublicFilesPlugin() {
  return {
    name: 'copy-public-safe',
    closeBundle() {
      const publicDir = resolve(__dirname, 'public');
      const outDir = resolve(__dirname, 'dist');
      function copyDir(src: string, dest: string) {
        if (!existsSync(dest)) mkdirSync(dest, { recursive: true });
        for (const entry of readdirSync(src)) {
          if (entry.includes(' ')) continue;
          const srcPath = join(src, entry);
          const destPath = join(dest, entry);
          if (statSync(srcPath).isDirectory()) {
            copyDir(srcPath, destPath);
          } else {
            cpSync(srcPath, destPath);
          }
        }
      }
      copyDir(publicDir, outDir);
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), copyPublicFilesPlugin()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  publicDir: false,
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      input: 'index.html',
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          icons: ['lucide-react']
        }
      }
    }
  },
  base: './'
});