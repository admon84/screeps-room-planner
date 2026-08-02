import * as React from 'react';
import * as Mui from '@mui/material';

type Props = {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
};

/**
 * Trigger for a room action in the app bar: labeled next to the wordmark on desktop, icon-only
 * below `md` where the toolbar center section needs the space. The tooltip carries the label in
 * both states, matching the undo/redo buttons.
 */
export default function AppBarButton({ icon, label, onClick }: Props) {
  return (
    <Mui.Tooltip title={label}>
      <Mui.Button
        color='inherit'
        size='small'
        onClick={onClick}
        startIcon={icon}
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
    </Mui.Tooltip>
  );
}
