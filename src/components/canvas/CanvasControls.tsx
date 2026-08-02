import * as Mui from '@mui/material';
import * as Icons from '@mui/icons-material';

// IconButton is a circle by default; these are squared off to read as map controls.
const buttonSx = {
  background: 'rgba(0,0,0,0.3)',
  borderRadius: 1,
  color: 'white',
  ':hover': { background: 'rgba(0,0,0,0.5)' },
};

interface Props {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitRoom: () => void;
}

export default function CanvasControls({ onZoomIn, onZoomOut, onFitRoom }: Props) {
  return (
    <Mui.Stack spacing={0.5} sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}>
      <Mui.Tooltip title='Zoom in' placement='left'>
        <Mui.IconButton size='small' onClick={onZoomIn} sx={buttonSx}>
          <Icons.Add fontSize='small' />
        </Mui.IconButton>
      </Mui.Tooltip>
      <Mui.Tooltip title='Zoom out' placement='left'>
        <Mui.IconButton size='small' onClick={onZoomOut} sx={buttonSx}>
          <Icons.Remove fontSize='small' />
        </Mui.IconButton>
      </Mui.Tooltip>
      <Mui.Tooltip title='Fit room' placement='left'>
        <Mui.IconButton size='small' onClick={onFitRoom} sx={buttonSx}>
          <Icons.FitScreen fontSize='small' />
        </Mui.IconButton>
      </Mui.Tooltip>
    </Mui.Stack>
  );
}
