import * as Mui from '@mui/material';
import { useGameAppStore } from '@/stores/useGameAppStore';

const HoverTilePanel = () => {
  const hoverRoomPos = useGameAppStore((state) => state.hoverRoomPos);
  if (hoverRoomPos === null) {
    return null;
  }
  const { x, y } = hoverRoomPos;
  return (
    <Mui.Chip
      label={`X: ${x}, Y: ${y}`}
      size='small'
      sx={{ fontSize: '.7rem', fontVariantNumeric: 'tabular-nums', fontWeight: 300 }}
      variant='outlined'
    />
  );
};

export default HoverTilePanel;
