import { Box, Paper } from '@mui/material';
import { StructureBrush } from '../utils/types';
import { ROOM_SIZE } from '../utils/constants';
import { getRoomTile } from '../utils/helpers';
import RoomGridTile from './RoomGridTile';

export default function RoomGrid(props: { structureBrushes: StructureBrush[] }) {
  const roomTiles = [...Array(ROOM_SIZE)];

  return (
    <Paper
      elevation={6}
      sx={{
        borderRadius: 0,
        minWidth: '500px',
        maxWidth: 'calc(100vh - 6.25rem)',
        width: '100%',
      }}
    >
      <Box display='grid' gridTemplateColumns='repeat(50, minmax(2%, 1fr))' gap={0}>
        {roomTiles.map((_, y) =>
          roomTiles.map((_, x) => {
            const tile = getRoomTile(x, y);
            return <RoomGridTile {...props} key={tile} tile={tile} />;
          })
        )}
      </Box>
    </Paper>
  );
}
