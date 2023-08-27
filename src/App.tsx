import * as Mui from '@mui/material';
import * as Icons from '@mui/icons-material';

import LeftDrawer from './left-drawer/LeftDrawer';
import RoomGrid from './room-grid/RoomGrid';
import BottomDrawer from './bottom-drawer/BottomDrawer';
import HoverTilePanel from './room-grid/HoverTilePanel';
import { useState } from 'react';

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Mui.Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Mui.CssBaseline />
      <Mui.AppBar position='fixed' sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Mui.Toolbar variant='dense'>
          <Mui.IconButton
            color='inherit'
            edge='start'
            onClick={handleDrawerToggle}
            sx={{ mr: 1, display: { md: 'none' } }}
          >
            <Icons.Menu />
          </Mui.IconButton>
          <Mui.Typography variant='h6' noWrap component='div' sx={{ display: { xs: 'none', sm: 'block' } }}>
            Screeps Room Planner
          </Mui.Typography>
          <Mui.Box display='flex' flexGrow={1} />
          <Mui.Box display='flex'>
            <Mui.Button
              size='small'
              href='https://github.com/admon84/screeps-room-planner'
              target='_blank'
              endIcon={<Icons.GitHub />}
              sx={{ px: 1.5 }}
            >
              View Source
            </Mui.Button>
          </Mui.Box>
        </Mui.Toolbar>
      </Mui.AppBar>
      <LeftDrawer mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
      <Mui.Box
        component='main'
        flexDirection='row'
        flexGrow={1}
        position='relative'
        sx={{ background: ({ palette }) => palette.secondary.dark }}
      >
        <Mui.Box
          display='flex'
          position='sticky'
          sx={{ width: '100px', top: 33, left: { xs: '45%', md: '55%' }, zIndex: 9999 }}
        >
          <HoverTilePanel />
        </Mui.Box>
        <Mui.Toolbar variant='dense' />
        <Mui.Box display='flex' justifyContent='center' padding={3} position='relative'>
          <RoomGrid />
        </Mui.Box>
      </Mui.Box>
      <BottomDrawer />
    </Mui.Box>
  );
}
