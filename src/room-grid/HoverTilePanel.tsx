import * as Mui from '@mui/material';
import { useHoverTile } from '../contexts/HoverTileContext';
import { getRoomPosition } from '../utils/helpers';

const HoverTilePanel = () => {
  const { hover } = useHoverTile();
  if (hover.tile === null) {
    return null;
  }
  const { x, y } = getRoomPosition(hover.tile);
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
