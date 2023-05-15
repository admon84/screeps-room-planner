import * as Mui from '@mui/material';

import LeftDrawer from './left-drawer/LeftDrawer';
import RoomGrid from './room-grid/RoomGrid';
import { getStructureBrushes } from './utils/helpers';
import BottomDrawer from './bottom-drawer/BottomDrawer';
import { useSettings } from './contexts/SettingsContext';
import HoverTilePanel from './room-grid/HoverTilePanel';
import { HoverTileProvider } from './contexts/HoverTileContext';

export default function App() {
  const { settings } = useSettings();
  const brushes = getStructureBrushes(settings.rcl);

  return (
    <Mui.Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Mui.CssBaseline />
      <Mui.AppBar position='fixed' sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Mui.Toolbar variant='dense'>
          <Mui.Typography variant='h6' noWrap component='div'>
            Screeps Room Planner
          </Mui.Typography>
        </Mui.Toolbar>
      </Mui.AppBar>
      <LeftDrawer structureBrushes={brushes} />
      <Mui.Box
        component='main'
        flexDirection='row'
        flexGrow={1}
        position='relative'
        sx={{ background: ({ palette }) => palette.secondary.dark }}
      >
        <Mui.Toolbar variant='dense' />
        <Mui.Box display='flex' justifyContent='center' padding={3} position='relative'>
          <HoverTileProvider>
            <HoverTilePanel />
            <RoomGrid structureBrushes={brushes} />
          </HoverTileProvider>
        </Mui.Box>
      </Mui.Box>
      <BottomDrawer />
    </Mui.Box>
  );
}
