import * as Mui from '@mui/material';
import { Fragment } from 'react';
import StyledDialog from '@/components/dialog/StyledDialog';
import DialogTitle from '@/components/dialog/DialogTitle';

// `keys` is a chord to press together; `alt` lists equivalent alternatives, rendered with an "or" so
// Ctrl+Z does not read the same as Delete/Backspace.
type Shortcut = { keys: string[]; alt?: string[]; description: string };

// Descriptions mirror the gesture predicates in utils/canvas.ts. Erase is tested before panning, so
// a modifier turns a click into an erase on either button; a bare right click always pans.
const MOUSE: Shortcut[] = [
  { keys: ['Left click'], description: 'Paint the selected brush -- hold and drag to paint a stroke' },
  { keys: ['Ctrl', 'Left click'], description: 'Erase everything on the tile -- hold and drag to erase' },
  { keys: ['Cmd', 'Left click'], description: 'Erase everything on the tile (macOS)' },
  { keys: ['Right click'], description: 'Hold and drag to pan the camera' },
  { keys: ['Middle click'], description: 'Hold and drag to pan the camera' },
  { keys: ['Shift', 'Left click'], description: 'Hold and drag to pan the camera' },
  { keys: ['Wheel'], description: 'Zoom in and out' },
  { keys: ['Ctrl', 'Wheel'], description: 'Zoom in and out (trackpad pinch)' },
];

const KEYBOARD: Shortcut[] = [
  { keys: ['Ctrl', 'Z'], description: 'Undo' },
  { keys: ['Ctrl', 'Shift', 'Z'], alt: ['Ctrl', 'Y'], description: 'Redo' },
  { keys: ['+'], alt: ['-'], description: 'Zoom in and out' },
  { keys: ['0'], description: 'Fit room to view' },
  { keys: ['Arrows'], description: 'Pan the camera' },
  {
    keys: ['Delete'],
    alt: ['Backspace'],
    description: 'Remove structures on the hovered tile, keeping sources and minerals',
  },
  { keys: ['Esc'], description: 'Deselect the current brush' },
  { keys: ['?'], description: 'Open this dialog' },
];

function Key({ children }: { children: string }) {
  return (
    <Mui.Box
      component='kbd'
      sx={({ palette }) => ({
        border: `1px solid ${palette.divider}`,
        backgroundColor: palette.background.default,
        borderRadius: 0.75,
        color: palette.text.primary,
        fontFamily: 'inherit',
        fontSize: '0.75rem',
        lineHeight: 1.6,
        px: 0.75,
        whiteSpace: 'nowrap',
      })}
    >
      {children}
    </Mui.Box>
  );
}

function ShortcutList({ title, shortcuts }: { title: string; shortcuts: Shortcut[] }) {
  return (
    <>
      <Mui.Typography variant='subtitle2' sx={{ mb: 1 }}>
        {title}
      </Mui.Typography>
      <Mui.Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr', columnGap: 2, rowGap: 1 }}>
        {shortcuts.map(({ keys, alt, description }) => (
          <Fragment key={description + keys.join()}>
            <Mui.Box sx={{ alignItems: 'center', display: 'flex', gap: 0.5 }}>
              {keys.map((key) => (
                <Key key={key}>{key}</Key>
              ))}
              {alt && (
                <>
                  <Mui.Typography variant='body2' sx={{ color: 'text.secondary', mx: 0.25 }}>
                    or
                  </Mui.Typography>
                  {alt.map((key) => (
                    <Key key={key}>{key}</Key>
                  ))}
                </>
              )}
            </Mui.Box>
            <Mui.Typography variant='body2' color='text.secondary'>
              {description}
            </Mui.Typography>
          </Fragment>
        ))}
      </Mui.Box>
    </>
  );
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function KeyboardShortcuts({ open, onClose }: Props) {
  const { palette } = Mui.useTheme();

  return (
    <StyledDialog fullWidth maxWidth='sm' open={open} onClose={onClose}>
      <DialogTitle onClose={onClose}>Controls</DialogTitle>
      <Mui.DialogContent dividers sx={{ backgroundColor: palette.divider }}>
        <Mui.Paper sx={{ p: 2 }}>
          <ShortcutList title='Mouse' shortcuts={MOUSE} />
          <Mui.Divider sx={{ my: 2 }} />
          <ShortcutList title='Keyboard' shortcuts={KEYBOARD} />
        </Mui.Paper>
      </Mui.DialogContent>
    </StyledDialog>
  );
}
