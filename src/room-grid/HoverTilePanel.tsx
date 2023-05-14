import * as Mui from '@mui/material';
import { initialState, useHoverTile } from '../contexts/HoverTileContext';

const HoverTilePanel = () => {
  const { hoverTile } = useHoverTile();

  if (hoverTile.tile === initialState.tile) {
    return null;
  }

  return (
    <Mui.Chip
      label={`X: ${hoverTile.x}, Y: ${hoverTile.y}`}
      size='small'
      sx={{ fontSize: '.7rem', fontWeight: 300, position: 'absolute', bottom: -2 }}
      variant='outlined'
    />
  );
};

export default HoverTilePanel;
