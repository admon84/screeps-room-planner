import * as Mui from '@mui/material';
import { initialState, useHoverTile } from '../contexts/HoverTileContext';

const HoverTilePanel = () => {
  const { tile, x, y } = useHoverTile();

  if (tile === initialState.tile) {
    return null;
  }

  return (
    <Mui.Chip
      label={`X: ${x}, Y: ${y}`}
      size='small'
      sx={{ fontSize: '.7rem', fontWeight: 300, position: 'absolute', bottom: -2 }}
      variant='outlined'
    />
  );
};

export default HoverTilePanel;
