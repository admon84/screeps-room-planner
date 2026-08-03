import * as Mui from '@mui/material';
import { Fragment } from 'react';
import StyledDialog from '@/components/dialog/StyledDialog';
import DialogTitle from '@/components/dialog/DialogTitle';

// A chord is keys pressed together, joined by "+". A row's bindings are equivalent ways to trigger
// the same action, stacked vertically. `adjacent` opts out of the "+" for key sets like the arrows,
// which are pressed individually rather than together.
type Chord = string[];
type Shortcut = { bindings: Chord[]; adjacent?: boolean; description: string };

// Mirrors the gesture predicates in utils/canvas.ts. Erase is tested before panning, so a modifier
// turns a click into an erase on either button; a bare right click always pans.
const MOUSE: Shortcut[] = [
  { bindings: [['Left Click']], description: 'Paint the selected brush (hold and drag)' },
  {
    bindings: [
      ['Ctrl', 'Left Click'],
      ['Cmd', 'Left Click'],
    ],
    description: 'Erase everything on the tile (hold and drag)',
  },
  {
    bindings: [['Right Click'], ['Middle Click'], ['Shift', 'Left Click']],
    description: 'Pan the camera (hold and drag)',
  },
  { bindings: [['Wheel'], ['Ctrl', 'Wheel']], description: 'Zoom in and out' },
];

const KEYBOARD: Shortcut[] = [
  {
    bindings: [
      ['Ctrl', 'Z'],
      ['Cmd', 'Z'],
    ],
    description: 'Undo',
  },
  {
    bindings: [
      ['Ctrl', 'Shift', 'Z'],
      ['Ctrl', 'Y'],
    ],
    description: 'Redo',
  },
  { bindings: [['+']], description: 'Zoom in' },
  { bindings: [['-']], description: 'Zoom out' },
  { bindings: [['0']], description: 'Fit room to view' },
  { bindings: [['←', '↑', '↓', '→']], adjacent: true, description: 'Pan the camera' },
  {
    bindings: [['Delete'], ['Backspace']],
    description: 'Remove structures on the hovered tile, keeping sources and minerals',
  },
  { bindings: [['Esc']], description: 'Deselect the current brush' },
  { bindings: [['?']], description: 'Open this dialog' },
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
        lineHeight: 1.4,
        px: 0.75,
        whiteSpace: 'nowrap',
      })}
    >
      {children}
    </Mui.Box>
  );
}

function Separator({ children }: { children: string }) {
  return (
    <Mui.Typography component='span' variant='body2' sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
      {children}
    </Mui.Typography>
  );
}

// Rows share a top border so it spans both grid columns; the first row opts out.
const rowSx = (index: number) => ({
  borderTop: index === 0 ? 'none' : '1px solid',
  borderColor: (theme: Mui.Theme) => Mui.alpha(theme.palette.divider, 0.5),
  pb: 0.75,
  pt: index === 0 ? 0 : 0.75,
});

function ShortcutList({ title, shortcuts }: { title: string; shortcuts: Shortcut[] }) {
  return (
    <>
      <Mui.Typography variant='subtitle2' sx={{ mb: 0.5 }}>
        {title}
      </Mui.Typography>
      <Mui.Box sx={{ alignItems: 'baseline', columnGap: 2, display: 'grid', gridTemplateColumns: 'auto 1fr' }}>
        {shortcuts.map(({ bindings, adjacent, description }, index) => (
          <Fragment key={description}>
            <Mui.Box sx={{ ...rowSx(index), alignItems: 'flex-start', display: 'flex', flexDirection: 'column' }}>
              {bindings.map((chord) => (
                <Mui.Box key={chord.join()} sx={{ alignItems: 'center', display: 'flex', gap: 0.5, py: 0.125 }}>
                  {chord.map((key, keyIndex) => (
                    <Fragment key={key}>
                      {keyIndex > 0 && !adjacent && <Separator>+</Separator>}
                      <Key>{key}</Key>
                    </Fragment>
                  ))}
                </Mui.Box>
              ))}
            </Mui.Box>
            <Mui.Typography variant='body2' color='text.secondary' sx={rowSx(index)}>
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
          <Mui.Divider sx={{ my: 1.5 }} />
          <ShortcutList title='Keyboard' shortcuts={KEYBOARD} />
        </Mui.Paper>
      </Mui.DialogContent>
    </StyledDialog>
  );
}
