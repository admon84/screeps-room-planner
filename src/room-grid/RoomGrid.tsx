import { CSSProperties, useRef } from 'react';
import { Box, Paper } from '@mui/material';
import { useElementSize } from '../hooks/useElementSize';
import { StructureBrush } from '../utils/types';
import {
  ROOM_SIZE,
  STRUCTURE_CONTAINER,
  STRUCTURE_RAMPART,
  STRUCTURE_ROAD,
  TERRAIN_SWAMP,
  TERRAIN_WALL,
} from '../utils/constants';
import { getRoomPosition, getRoomTile, positionIsValid, structureCanBePlaced } from '../utils/helpers';
import { useSettings } from '../contexts/SettingsContext';
import { useRoomGrid } from '../contexts/RoomGridContext';
import { useRoomStructures } from '../contexts/RoomStructuresContext';
import { useRoomTerrain } from '../contexts/RoomTerrainContext';
import { useHoverTile } from '../contexts/HoverTileContext';

export default function RoomGrid(props: { structureBrushes: StructureBrush[] }) {
  const { hoverTile, setHoverTile, resetHoverTile } = useHoverTile();
  const { settings, updateSettings } = useSettings();
  const { brush, rcl } = settings;
  const { roomGrid, addRoomGridStructure, removeRoomGridStructure } = useRoomGrid();
  const { roomStructures, updateRoomStructures } = useRoomStructures();
  const { roomTerrain } = useRoomTerrain();

  const ref = useRef<HTMLHeadingElement>(null);
  const { width } = useElementSize(ref);
  const size = Math.max(ROOM_SIZE, width) / ROOM_SIZE;
  const roomTiles = [...Array(ROOM_SIZE)];
  const tileClass = 'tile';

  const getTileElement = (target: HTMLElement): { tile: number; x: number; y: number } => {
    if (target.classList.contains(tileClass)) {
      const tile = +target.dataset.tile!;
      return { tile, ...getRoomPosition(tile) };
    }
    return getTileElement(target.parentElement as HTMLElement);
  };

  const handleMouseEvent = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    const { tile, x, y } = getTileElement(e.target as HTMLElement);
    setHoverTile({ tile, x, y });
    if (e.buttons === 1) {
      addStructure(tile, x, y);
    } else if (e.buttons === 2) {
      props.structureBrushes.forEach(({ key }) => removeStructure(tile, x, y, key));
    }
  };

  const structuresToRemove = (skipBrush = false) =>
    brush === STRUCTURE_RAMPART
      ? []
      : Object.keys(roomStructures).reduce(
          (acc: string[], structure) =>
            (skipBrush && brush === structure) ||
            structure === STRUCTURE_RAMPART ||
            (brush === STRUCTURE_CONTAINER && structure === STRUCTURE_ROAD) ||
            (brush === STRUCTURE_ROAD && structure === STRUCTURE_CONTAINER)
              ? acc
              : [...acc, structure],
          []
        );

  const addStructure = (tile: number, x: number, y: number) => {
    if (!brush) return;
    const placed = roomStructures[brush]?.length || 0;
    const terrain = roomTerrain[tile];
    if (structureCanBePlaced(brush, rcl, placed, terrain)) {
      // remove existing structures at this position except ramparts
      structuresToRemove().forEach((structure) => removeStructure(tile, x, y, structure));
      // add structures
      updateRoomStructures({ type: 'add_structure', structure: brush, x, y });
      addRoomGridStructure(tile, brush);
      // deselect active brush when 0 remaining
      if (!structureCanBePlaced(brush, rcl, placed + 1, terrain)) {
        updateSettings({ type: 'unset_brush' });
      }
    }
  };

  const removeStructure = (tile: number, x: number, y: number, structure: string) => {
    removeRoomGridStructure(tile, structure);
    updateRoomStructures({ type: 'remove_structure', structure, x, y });
  };

  const getCellContent = (tile: number): React.ReactNode => {
    const terrain = roomTerrain[tile];
    const placed = brush && roomStructures[brush] ? roomStructures[brush].length : 0;
    const previewIcon =
      !!brush &&
      hoverTile.tile === tile &&
      brush !== STRUCTURE_ROAD &&
      structureCanBePlaced(brush, rcl, placed, terrain) &&
      !positionHasStructure(tile, brush);

    let structures: string[] = [];
    if (roomGrid[tile]) {
      structures.push(...roomGrid[tile]);
    }
    if (previewIcon) {
      structures.push(brush);
      const previewRemove = structuresToRemove(true);
      structures = structures.filter((s) => !previewRemove.includes(s));
    }

    const width = '100%';
    const positionAbsolute: CSSProperties = {
      position: 'absolute',
      left: 0,
      top: 0,
    };
    const backgroundSizeProps = {
      backgroundSize: width,
      height: width,
      width,
    };
    const roadStyle = { ...positionAbsolute, height: width, width };

    return (
      <>
        <Box
          sx={{
            ...backgroundSizeProps,
            ...positionAbsolute,
            ...(terrain && terrain === TERRAIN_WALL
              ? {
                  backgroundColor: '#111111',
                }
              : terrain === TERRAIN_SWAMP
              ? {
                  backgroundColor: '#292b18',
                  boxShadow: `inset #252715 0 0 0 1px`,
                }
              : {
                  boxShadow: 'inset rgba(0, 0, 0, 0.05) 0 0 0 1px',
                }),
          }}
        />
        {structures && structures.includes(STRUCTURE_RAMPART) && (
          <Box
            sx={{
              ...backgroundSizeProps,
              ...positionAbsolute,
              backgroundColor: '#314b31',
              boxShadow: 'inset rgba(67, 134, 67, 0.6) 0 0 0 1px',
            }}
          />
        )}
        {getRoadLines(tile, roadStyle, previewIcon)}
        {structures &&
          props.structureBrushes
            .filter((o) => o.key !== STRUCTURE_RAMPART && o.key !== STRUCTURE_ROAD && structures.includes(o.key))
            .map(({ key, image }) => (
              <Box
                key={key}
                sx={{
                  ...backgroundSizeProps,
                  ...positionAbsolute,
                  backgroundImage: `url(${image})`,
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'contain',
                  opacity: previewIcon ? 0.5 : 1,
                }}
              />
            ))}
      </>
    );
  };

  const positionHasStructure = (tile: number, structure: string) => {
    const placedStructures = roomGrid[tile];
    return placedStructures && placedStructures.includes(structure);
  };

  const positionHasRoad = (tile: number) => positionHasStructure(tile, STRUCTURE_ROAD);

  const getRoadLines = (tile: number, roadStyle: CSSProperties, previewIcon = false) => {
    const tileHasRoad = positionHasRoad(tile);
    const preview = brush === STRUCTURE_ROAD && !tileHasRoad && hoverTile.tile === tile;
    const previewColor = 'rgba(107,107,107,0.4)';
    const solidColor = '#6b6b6b';
    const roadColor = preview || previewIcon ? previewColor : solidColor;

    if (preview || tileHasRoad) {
      return [-1, 0, 1].map((rx) =>
        [-1, 0, 1].map((ry) => {
          if (rx === 0 && ry === 0) {
            return (
              <svg key={tile} height={size} style={roadStyle} width={size}>
                <circle cx='50%' cy='50%' r='1' fill={roadColor} />
              </svg>
            );
          }

          const { x, y } = getRoomPosition(tile);
          const [cx, cy] = [x + rx, y + ry];
          const ctile = getRoomTile(cx, cy);
          const ctileHasRoad = positionHasRoad(ctile);
          const cpreview = brush === STRUCTURE_ROAD && !ctileHasRoad && hoverTile.tile === ctile;
          const croadColor = cpreview || preview || previewIcon ? previewColor : solidColor;
          if (positionIsValid(cx, cy) && (cpreview || ctileHasRoad)) {
            return rx === -1 && ry === -1 ? (
              <svg key={ctile} height={size} style={roadStyle} width={size}>
                <line x1='0' y1='0' x2='50%' y2='50%' stroke={croadColor} strokeWidth={2} />
              </svg>
            ) : rx === 0 && ry === -1 ? (
              <svg key={ctile} height={size} style={roadStyle} width={size}>
                <line x1='50%' y1='0' x2='50%' y2='50%' stroke={croadColor} strokeWidth={2} />
              </svg>
            ) : rx === 1 && ry === -1 ? (
              <svg key={ctile} height={size} style={roadStyle} width={size}>
                <line x1='100%' y1='0' x2='50%' y2='50%' stroke={croadColor} strokeWidth={2} />
              </svg>
            ) : rx === 1 && ry === 0 ? (
              <svg key={ctile} height={size} style={roadStyle} width={size}>
                <line x1='100%' y1='50%' x2='50%' y2='50%' stroke={croadColor} strokeWidth={2} />
              </svg>
            ) : rx === 1 && ry === 1 ? (
              <svg key={ctile} height={size} style={roadStyle} width={size}>
                <line x1='100%' y1='100%' x2='50%' y2='50%' stroke={croadColor} strokeWidth={2} />
              </svg>
            ) : rx === 0 && ry === 1 ? (
              <svg key={ctile} height={size} style={roadStyle} width={size}>
                <line x1='50%' y1='100%' x2='50%' y2='50%' stroke={croadColor} strokeWidth={2} />
              </svg>
            ) : rx === -1 && ry === 1 ? (
              <svg key={ctile} height={size} style={roadStyle} width={size}>
                <line x1='0' y1='100%' x2='50%' y2='50%' stroke={croadColor} strokeWidth={2} />
              </svg>
            ) : rx === -1 && ry === 0 ? (
              <svg key={ctile} height={size} style={roadStyle} width={size}>
                <line x1='0' y1='50%' x2='50%' y2='50%' stroke={croadColor} strokeWidth={2} />
              </svg>
            ) : null;
          }
          return null;
        })
      );
    }
    return null;
  };

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
              return (
                <Box
                  key={tile}
                  className={tileClass}
                  component='div'
                  data-tile={tile}
                  onMouseDown={handleMouseEvent}
                  onMouseOver={handleMouseEvent}
                  onMouseOut={resetHoverTile}
                  onContextMenu={(e) => e.preventDefault()}
                  sx={{
                    backgroundColor: ({ palette }) => palette.secondary.light,
                    height: sizePx,
                    position: 'relative',
                    width: 'auto',
                    ':after': {
                      backgroundColor: 'rgba(255,255,255,0.08)',
                      boxShadow: 'inset rgba(0,0,0,0.05) 0 0 0 1px',
                      content: '""',
                      height: sizePx,
                      left: 0,
                      opacity: 0,
                      position: 'absolute',
                      top: 0,
                      width: sizePx,
                    },
                    ':hover:after': {
                      opacity: 1,
                    },
                  }}
                >
                  {getCellContent(tile)}
                </Box>
              );
            })
          )}
      </Box>
    </Paper>
  );
}
