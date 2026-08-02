import * as Mui from '@mui/material';
import { alpha } from '@mui/material/styles';
import { MONO_FONT_FAMILY } from '@/utils/theme';

/**
 * App wordmark: the repo name set as a monospace badge, so it reads to a Screeps audience the way a
 * GitHub repo slug does. The border and tint are the same treatment as the outlined buttons, so it
 * sits in the app bar as a deliberate mark rather than as an unstyled title.
 */
export default function Wordmark() {
  return (
    <Mui.Typography
      component='h1'
      noWrap
      sx={({ palette }) => ({
        alignItems: 'center',
        backgroundColor: alpha(palette.primary.main, 0.06),
        border: `1px solid ${alpha(palette.primary.main, 0.35)}`,
        borderRadius: 1.5,
        color: palette.primary.light,
        display: { xs: 'none', sm: 'inline-flex' },
        fontFamily: MONO_FONT_FAMILY,
        fontSize: '0.875rem',
        fontWeight: 500,
        // JetBrains Mono runs wide; without this the mark crowds the toolbar center section.
        letterSpacing: '-0.02em',
        lineHeight: 1.6,
        px: 1,
      })}
    >
      screeps-room-planner
    </Mui.Typography>
  );
}
