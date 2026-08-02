import * as React from 'react';
import * as Mui from '@mui/material';

type Props = {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
};

/**
 * Trigger for a room action in the app bar: labeled next to the wordmark on desktop, icon-only
 * below `md` where the toolbar center section needs the space. `aria-label` keeps the icon-only
 * state accessible.
 */
export default function AppBarButton({ icon, label, onClick }: Props) {
  return (
    <Mui.Button
      color='inherit'
      size='small'
      onClick={onClick}
      startIcon={icon}
      aria-label={label}
      sx={{
        minWidth: 0,
        px: 1,
        '& .MuiButton-startIcon': { ml: 0, mr: { xs: 0, md: 0.75 } },
      }}
    >
      <Mui.Box component='span' sx={{ display: { xs: 'none', md: 'inline' } }}>
        {label}
      </Mui.Box>
    </Mui.Button>
  );
}
