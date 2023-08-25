import * as Mui from '@mui/material';
import { useHoverTile } from '../state/HoverTile';
import { getRoomPoint } from '../utils/helpers';

const HoverTilePanel = () => {
  const tile = useHoverTile((state) => state.tile);
  if (tile === null) {
    return null;
  }
  const { x, y } = getRoomPoint(tile);
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
