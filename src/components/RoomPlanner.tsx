import * as Mui from '@mui/material';
import * as Icons from '@mui/icons-material';
import LeftDrawer from './left-drawer/LeftDrawer';
import HoverTilePanel from './canvas/HoverTilePanel';
import { useState } from 'react';
import AppBarActions from './AppBarActions';
import AppBarMenu from './AppBarMenu';
import BrushIndicator from './BrushIndicator';
import CanvasWrapper from './canvas/CanvasWrapper';
import KeyboardShortcuts from '@/components/KeyboardShortcuts';
import Notifications from '@/components/Notifications';
import Wordmark from '@/components/Wordmark';
import { ICON_EDGE_GUTTER } from '@/utils/theme';
import { useHistoryStore } from '@/stores/useHistoryStore';
import { useUiStore } from '@/stores/useUiStore';

export default function RoomPlanner() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const canUndo = useHistoryStore((state) => state.past.length > 0);
  const canRedo = useHistoryStore((state) => state.future.length > 0);
  const undo = useHistoryStore((state) => state.undo);
  const redo = useHistoryStore((state) => state.redo);

  const shortcutsOpen = useUiStore((state) => state.shortcutsOpen);
  const setShortcutsOpen = useUiStore((state) => state.setShortcutsOpen);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      <Mui.CssBaseline />
      <Mui.Box sx={{ display: 'flex', flexGrow: 1 }}>
        <Mui.AppBar position='fixed' sx={(theme) => ({ zIndex: theme.zIndex.drawer + 1 })}>
          {/* The right-hand controls are icon buttons, so the toolbar's right gutter is pulled in to
              ICON_EDGE_GUTTER -- that puts their glyphs, not their hit areas, on the gutter line the
              wordmark and the canvas overlay controls share. */}
          <Mui.Toolbar variant='dense' sx={{ pr: `${ICON_EDGE_GUTTER}px` }}>
            <Mui.IconButton
              color='inherit'
              edge='start'
              onClick={handleDrawerToggle}
              sx={{ mr: 1, display: { md: 'none' } }}
            >
              <Icons.Menu />
            </Mui.IconButton>
            <Wordmark />
            <AppBarActions />
            <Mui.Box
              sx={{ alignItems: 'center', display: 'flex', flexGrow: 1, gap: 1, justifyContent: 'center', px: 2 }}
            >
              <BrushIndicator />
              <HoverTilePanel />
            </Mui.Box>
            <Mui.Box sx={{ alignItems: 'center', display: 'flex', gap: 0.5 }}>
              {/* Tooltips do not fire on a disabled button, so each one needs a wrapper that keeps
                  pointer events -- the label matters most in exactly that state. */}
              <Mui.Tooltip title='Undo'>
                <span>
                  <Mui.IconButton size='small' color='inherit' onClick={undo} disabled={!canUndo}>
                    <Icons.UndoRounded fontSize='small' />
                  </Mui.IconButton>
                </span>
              </Mui.Tooltip>
              <Mui.Tooltip title='Redo'>
                <span>
                  <Mui.IconButton size='small' color='inherit' onClick={redo} disabled={!canRedo}>
                    <Icons.RedoRounded fontSize='small' />
                  </Mui.IconButton>
                </span>
              </Mui.Tooltip>
              <AppBarMenu />
            </Mui.Box>
          </Mui.Toolbar>
        </Mui.AppBar>
        <LeftDrawer mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
        <Mui.Box
          component='main'
          sx={({ palette }) => ({
            flexDirection: 'row',
            flexGrow: 1,
            position: 'relative',
            minHeight: '100vh',
            background: palette.secondary.dark,
          })}
        >
          <Mui.Toolbar variant='dense' />
          <Mui.Box sx={{ position: 'relative', overflow: 'hidden' }}>
            <CanvasWrapper />
          </Mui.Box>
        </Mui.Box>
      </Mui.Box>
      <KeyboardShortcuts open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
      <Notifications />
    </>
  );
}
