import { defineConfig, globalIgnores } from 'eslint/config';
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import prettier from 'eslint-config-prettier/flat';

export default defineConfig([
  js.configs.recommended,
  tseslint.configs.recommended,
  // `configs['recommended-latest']` is still the eslintrc shape; the flat equivalents live under
  // `configs.flat`.
  reactHooks.configs.flat['recommended-latest'],
  reactRefresh.configs.vite,
  // A single config object, not an array -- and it must stay last so its rule-disables win.
  prettier,
  {
    languageOptions: {
      globals: globals.browser,
    },
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
  globalIgnores(['dist/**', 'build/**']),
]);
