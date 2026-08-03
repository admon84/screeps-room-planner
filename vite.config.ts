import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// screeps.com does not send CORS headers, so the app reaches the Screeps API through the
// same-origin `/screeps-api` prefix. In production a vercel.json rewrite does the forwarding; this
// proxy mirrors it for dev and preview. Keep the prefix aligned with src/utils/screepsApi.ts.
const screepsApiProxy = {
  '/screeps-api': {
    target: 'https://screeps.com',
    changeOrigin: true,
    rewrite: (path: string) => path.replace(/^\/screeps-api/, ''),
  },
};

export default defineConfig({
  plugins: [react()],
  build: {
    // public/assets/ holds the renderer sprites and is copied to dist/assets/ verbatim. Emit bundled
    // output elsewhere so generated files and sprites never share a directory.
    assetsDir: 'bundle',
    // The two big chunks are as small as they can get: Canvas (~870 kB) is the prebuilt
    // @screeps/renderer UMD bundle, already isolated behind React.lazy and not tree-shakeable, and
    // index (~600 kB) is the MUI/React shell needed at first paint. Raise the limit past both so the
    // default 500 kB warning stops firing on every build but still flags a regression past 1 MB.
    chunkSizeWarningLimit: 1000,
  },
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  optimizeDeps: {
    // Both @screeps packages are prebuilt webpack bundles with only a CJS `main` entry. Listing them
    // explicitly keeps the CJS->ESM interop stable and avoids a re-optimize on first canvas mount.
    include: ['@screeps/renderer', '@screeps/renderer-metadata'],
  },
  server: { port: 3000, proxy: screepsApiProxy },
  preview: { proxy: screepsApiProxy },
});
