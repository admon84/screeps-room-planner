import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  // A single config object, not an array -- and it must stay last so its rule-disables win.
  prettier,
  {
    rules: {
      // The @screeps/* packages ship no types, so src/types/declarations.d.ts is hand-written and
      // deliberately loose in places. Keep `any` visible without making it a build-stopper.
      '@typescript-eslint/no-explicit-any': 'warn',
      // Fires on mutating the GameRenderer instance held in state (e.g. `gameApp.zoomLevel = 0.2`).
      // An imperative WebGL handle is exactly the escape hatch React Compiler purity rules don't
      // model, and there is no non-mutating way to drive the renderer.
      'react-hooks/immutability': 'off',
    },
  },
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
]);
