import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import theme from '@/utils/theme';
import RoomPlanner from '@/components/RoomPlanner';
// Latin-only. The unprefixed entry points pull cyrillic and greek too, which nothing here needs.
import '@fontsource/inter/latin-300.css';
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-500.css';
import '@fontsource/inter/latin-700.css';
// The wordmark and the room JSON editor use JetBrains Mono, so only the one weight they render at is
// loaded -- anything else in that stack must stay at weight 500 or be synthesized.
import '@fontsource/jetbrains-mono/latin-500.css';
import '@/styles/prism.css';

// Emotion needs no CacheProvider here: MUI's default cache is correct for a client-only app, and
// the ordering problem AppRouterCacheProvider solved only exists across an SSR boundary.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <RoomPlanner />
    </ThemeProvider>
  </StrictMode>
);
