import * as Mui from '@mui/material';
import * as Icons from '@mui/icons-material';
import { useState } from 'react';
import { useSettings } from '@/stores/Settings';
import { useUiStore } from '@/stores/useUiStore';

const SOURCE_URL = 'https://github.com/admon84/screeps-room-planner';

const SectionHeading = Mui.styled(Mui.ListSubheader)(({ theme }) => ({
  background: 'none',
  color: theme.palette.text.secondary,
  fontSize: '0.7rem',
  letterSpacing: '0.08em',
  lineHeight: 2.2,
  textTransform: 'uppercase',
}));

const itemSx = { gap: 2, justifyContent: 'space-between' };

export default function AppBarMenu() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const debug = useSettings((state) => state.settings.debug);
  const setDebug = useSettings((state) => state.setDebug);
  const setShortcutsOpen = useUiStore((state) => state.setShortcutsOpen);

  const close = () => setAnchorEl(null);

  return (
    <>
      <Mui.Tooltip title='Menu'>
        <Mui.IconButton color='inherit' onClick={(e) => setAnchorEl(e.currentTarget)} size='small'>
          <Icons.MoreVert fontSize='small' />
        </Mui.IconButton>
      </Mui.Tooltip>
      <Mui.Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={close}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { minWidth: 220, mt: 0.5 } } }}
      >
        <SectionHeading>Help</SectionHeading>
        <Mui.MenuItem
          onClick={() => {
            close();
            setShortcutsOpen(true);
          }}
          sx={itemSx}
        >
          <Mui.ListItemText slotProps={{ primary: { variant: 'body2' } }}>Keyboard Shortcuts</Mui.ListItemText>
          <Icons.Keyboard fontSize='small' />
        </Mui.MenuItem>
        <Mui.MenuItem component='a' href={SOURCE_URL} target='_blank' rel='noreferrer' onClick={close} sx={itemSx}>
          <Mui.ListItemText slotProps={{ primary: { variant: 'body2' } }}>View Source</Mui.ListItemText>
          <Icons.GitHub fontSize='small' />
        </Mui.MenuItem>

        <SectionHeading sx={{ mt: 1.5 }}>Developer</SectionHeading>
        <Mui.MenuItem onClick={() => setDebug(!debug)} sx={itemSx}>
          <Mui.ListItemText slotProps={{ primary: { variant: 'body2' } }}>Debug Info</Mui.ListItemText>
          <Mui.Switch checked={debug} edge='end' size='small' tabIndex={-1} />
        </Mui.MenuItem>
      </Mui.Menu>
    </>
  );
}
