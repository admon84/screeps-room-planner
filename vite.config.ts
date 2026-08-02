import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // public/assets/ holds the renderer sprites and is copied to dist/assets/ verbatim. Emit bundled
    // output elsewhere so generated files and sprites never share a directory.
    assetsDir: 'bundle',
  },
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  optimizeDeps: {
    // Both @screeps packages are prebuilt webpack bundles with only a CJS `main` entry. Listing them
    // explicitly keeps the CJS->ESM interop stable and avoids a re-optimize on first canvas mount.
    include: ['@screeps/renderer', '@screeps/renderer-metadata', 'prismjs', 'prismjs/components/prism-json'],
  },
  server: { port: 3000 },
});
