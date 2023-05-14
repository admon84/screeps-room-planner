import { useRef } from 'react';
import { Box, Paper } from '@mui/material';
import { useElementSize } from '../hooks/useElementSize';
import { StructureBrush } from '../utils/types';
import { ROOM_SIZE } from '../utils/constants';
import { getRoomTile } from '../utils/helpers';
import RoomGridTile from './RoomGridTile';

export default function RoomGrid(props: { structureBrushes: StructureBrush[] }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const { width } = useElementSize(ref);
  const size = Math.max(ROOM_SIZE, width) / ROOM_SIZE;
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
      <Box display='grid' gridTemplateColumns='repeat(50, 1fr)' gap={0} ref={ref}>
        {width > 0 &&
          roomTiles.map((_, y) =>
            roomTiles.map((_, x) => {
              const tile = getRoomTile(x, y);
              const sizePx = `${size}px`;
              return <RoomGridTile {...props} tile={tile} sizePx={sizePx} />;
            })
          )}
      </Box>
    </Paper>
  );
}
