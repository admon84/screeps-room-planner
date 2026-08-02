import * as Mui from '@mui/material';
import * as Icons from '@mui/icons-material';
import LeftDrawer from './left-drawer/LeftDrawer';
import HoverTilePanel from './canvas/HoverTilePanel';
import { useState } from 'react';
import AppBarMenu from './AppBarMenu';
import CanvasWrapper from './canvas/CanvasWrapper';

export default function RoomPlanner() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      <Mui.CssBaseline />
      <Mui.Box sx={{ display: 'flex', flexGrow: 1 }}>
        <Mui.AppBar position='fixed' sx={(theme) => ({ zIndex: theme.zIndex.drawer + 1 })}>
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
            <Mui.Box sx={{ display: 'flex', flexGrow: 1 }} />
            <Mui.Box sx={{ alignItems: 'center', display: 'flex' }}>
              <Mui.Button
                size='small'
                href='https://github.com/admon84/screeps-room-planner'
                target='_blank'
                endIcon={<Icons.GitHub />}
                sx={{ px: 1.5 }}
              >
                View Source
              </Mui.Button>
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
          <Mui.Box
            sx={{
              display: 'flex',
              position: 'sticky',
              width: '100px',
              top: 33,
              left: { xs: '45%', md: '55%' },
              zIndex: 9999,
            }}
          >
            <HoverTilePanel />
          </Mui.Box>
          <Mui.Toolbar variant='dense' />
          <Mui.Box sx={{ position: 'relative', overflow: 'hidden' }}>
            <CanvasWrapper />
          </Mui.Box>
        </Mui.Box>
      </Mui.Box>
    </>
  );
}
