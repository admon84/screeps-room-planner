import { CSSProperties } from 'react';
import { Box } from '@mui/material';
import {
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
import { StructureBrush } from '../utils/types';

export default function RoomGridTile(props: { structureBrushes: StructureBrush[]; tile: number }) {
  const { hoverTile, setHoverTile, resetHoverTile } = useHoverTile();
  const { settings, resetBrush } = useSettings();
  const { brush, rcl } = settings;
  const { roomGrid, addRoomGridStructure, removeRoomGridStructure } = useRoomGrid();
  const { roomStructures, addRoomStructure, removeRoomStructure } = useRoomStructures();
  const { roomTerrain } = useRoomTerrain();
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
      addRoomStructure(brush, { x, y });
      addRoomGridStructure(tile, brush);
      // deselect active brush when 0 remaining
      if (!structureCanBePlaced(brush, rcl, placed + 1, terrain)) {
        resetBrush();
      }
    }
  };

  const removeStructure = (tile: number, x: number, y: number, structure: string) => {
    removeRoomGridStructure(tile, structure);
    removeRoomStructure(structure, { x, y });
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
      return [-1, 0, 1].map((dx) =>
        [-1, 0, 1].map((dy) => {
          if (dx === 0 && dy === 0) {
            return (
              <svg key={tile} style={roadStyle}>
                <circle cx='50%' cy='50%' r='1' fill={roadColor} />
              </svg>
            );
          }

          const { x, y } = getRoomPosition(tile);
          const [cx, cy] = [x + dx, y + dy];
          const ctile = getRoomTile(cx, cy);
          const ctileHasRoad = positionHasRoad(ctile);
          const cpreview = brush === STRUCTURE_ROAD && !ctileHasRoad && hoverTile.tile === ctile;
          const croadColor = cpreview || preview || previewIcon ? previewColor : solidColor;
          if (positionIsValid(cx, cy) && (cpreview || ctileHasRoad)) {
            return dx === -1 && dy === -1 ? (
              <svg key={ctile} style={roadStyle}>
                <line x1='0' y1='0' x2='50%' y2='50%' stroke={croadColor} strokeWidth={2} />
              </svg>
            ) : dx === 0 && dy === -1 ? (
              <svg key={ctile} style={roadStyle}>
                <line x1='50%' y1='0' x2='50%' y2='50%' stroke={croadColor} strokeWidth={2} />
              </svg>
            ) : dx === 1 && dy === -1 ? (
              <svg key={ctile} style={roadStyle}>
                <line x1='100%' y1='0' x2='50%' y2='50%' stroke={croadColor} strokeWidth={2} />
              </svg>
            ) : dx === 1 && dy === 0 ? (
              <svg key={ctile} style={roadStyle}>
                <line x1='100%' y1='50%' x2='50%' y2='50%' stroke={croadColor} strokeWidth={2} />
              </svg>
            ) : dx === 1 && dy === 1 ? (
              <svg key={ctile} style={roadStyle}>
                <line x1='100%' y1='100%' x2='50%' y2='50%' stroke={croadColor} strokeWidth={2} />
              </svg>
            ) : dx === 0 && dy === 1 ? (
              <svg key={ctile} style={roadStyle}>
                <line x1='50%' y1='100%' x2='50%' y2='50%' stroke={croadColor} strokeWidth={2} />
              </svg>
            ) : dx === -1 && dy === 1 ? (
              <svg key={ctile} style={roadStyle}>
                <line x1='0' y1='100%' x2='50%' y2='50%' stroke={croadColor} strokeWidth={2} />
              </svg>
            ) : dx === -1 && dy === 0 ? (
              <svg key={ctile} style={roadStyle}>
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
    <Box
      key={props.tile}
      sx={{
        position: 'relative',
        ':before': {
          content: '""',
          display: 'block',
          pt: '100%',
        },
      }}
    >
      <Box
        className={tileClass}
        component='div'
        data-tile={props.tile}
        onMouseDown={handleMouseEvent}
        onMouseOver={handleMouseEvent}
        onMouseOut={resetHoverTile}
        onContextMenu={(e) => e.preventDefault()}
        sx={{
          backgroundColor: ({ palette }) => palette.secondary.light,
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          // Hover tile highlight styling
          ':after': {
            opacity: 0,
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(255,255,255,0.08)',
            boxShadow: 'inset rgba(0,0,0,0.05) 0 0 0 1px',
          },
          // Show hover tile highlight
          ':hover:after': {
            opacity: 1,
          },
        }}
      >
        {getCellContent(props.tile)}
      </Box>
    </Box>
  );
}
