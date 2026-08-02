import * as Mui from '@mui/material';
import * as Icons from '@mui/icons-material';
import { useState } from 'react';
import { useSettings } from '@/stores/Settings';

export default function AppBarMenu() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const debug = useSettings((state) => state.settings.debug);
  const setDebug = useSettings((state) => state.setDebug);

  return (
    <>
      <Mui.Tooltip title='Settings'>
        <Mui.IconButton color='inherit' onClick={(e) => setAnchorEl(e.currentTarget)} size='small' sx={{ ml: 0.5 }}>
          <Icons.MoreVert fontSize='small' />
        </Mui.IconButton>
      </Mui.Tooltip>
      <Mui.Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { minWidth: 220, mt: 0.5 } } }}
      >
        <Mui.ListSubheader
          sx={({ palette }) => ({
            background: 'none',
            color: palette.text.secondary,
            fontSize: '0.7rem',
            letterSpacing: '0.08em',
            lineHeight: 2.2,
            textTransform: 'uppercase',
          })}
        >
          Developer
        </Mui.ListSubheader>
        <Mui.MenuItem onClick={() => setDebug(!debug)} sx={{ gap: 2, justifyContent: 'space-between' }}>
          <Mui.ListItemText slotProps={{ primary: { variant: 'body2' } }}>Debug Info</Mui.ListItemText>
          <Mui.Switch checked={debug} edge='end' size='small' tabIndex={-1} />
        </Mui.MenuItem>
      </Mui.Menu>
    </>
  );
}
