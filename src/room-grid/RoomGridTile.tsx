import { CSSProperties, memo, useState } from 'react';
import { Box } from '@mui/material';
import { STRUCTURE_RAMPART, STRUCTURE_ROAD, TERRAIN_SWAMP, TERRAIN_WALL } from '../utils/constants';
import { getStructureBrushes, structuresToRemove } from '../utils/helpers';
import { useHoverTile } from '../state/HoverTile';
import { useSettings } from '../state/Settings';
import { StructuresNearbyData } from '../utils/types';

type Props = {
  structures: readonly string[];
  tile: number;
  terrain: string;
  rcl: number;
  isNearHoverTile: boolean; // trigger re-rendering for nearby tiles
  addStructure: (tile: number, structure: string) => void;
  removeStructure: (tile: number, structure: string) => void;
  getStructuresNearby: (tile: number) => StructuresNearbyData[];
};

export default memo(({ structures, tile, terrain, rcl, addStructure, removeStructure, getStructuresNearby }: Props) => {
  console.log(`-- rendering tile ${tile} --`);
  const brush = useSettings((state) => state.brush);
  const resetHoverTile = useHoverTile((state) => state.reset);
  const setHover = useHoverTile((state) => state.setHover);
  const [isHovered, setIsHovered] = useState(false);
  const structureBrushes = getStructureBrushes(rcl);
  const tileClass = 'tile';
  const tilePosition = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  };

  const brushCanBePlaced = !!brush && brush !== STRUCTURE_ROAD && !structures.includes(brush);

  const handleMouseEvent = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();

    setIsHovered(true);
    setHover(tile);

    if (e.buttons === 1 && brush) {
      addStructure(tile, brush);
    } else if (e.buttons === 2) {
      structureBrushes.forEach(({ key }) => removeStructure(tile, key));
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    setIsHovered(false);
    resetHoverTile();
  };

  const getCellContent = (): React.ReactNode => {
    const previewIcon = brushCanBePlaced && isHovered;

    let drawStructures = [...structures];

    if (previewIcon && brush) {
      drawStructures.push(brush);
      const previewRemove = structuresToRemove(brush, true);
      drawStructures = drawStructures.filter((s) => !previewRemove.includes(s));
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
        {drawStructures.includes(STRUCTURE_RAMPART) && (
          <Box
            sx={{
              ...backgroundSizeProps,
              ...positionAbsolute,
              backgroundColor: '#314b31',
              boxShadow: 'inset rgba(67, 134, 67, 0.6) 0 0 0 1px',
            }}
          />
        )}
        {getRoadLines(roadStyle, previewIcon)}
        {structureBrushes
          .filter((o) => ![STRUCTURE_RAMPART, STRUCTURE_ROAD].includes(o.key) && drawStructures.includes(o.key))
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

  const getRoadLines = (roadStyle: CSSProperties, previewIcon = false) => {
    const tileHasRoad = structures.includes(STRUCTURE_ROAD);
    const preview = brush === STRUCTURE_ROAD && !tileHasRoad && isHovered;
    const previewColor = 'rgba(107,107,107,0.4)';
    const solidColor = '#6b6b6b';
    const roadColor = preview || previewIcon ? previewColor : solidColor;

    if (preview || tileHasRoad) {
      const roads: Array<JSX.Element | null> = [
        <svg key={tile} style={roadStyle}>
          <circle cx='50%' cy='50%' r='1' fill={roadColor} />
        </svg>,
      ];

      const adjacentRoads = getStructuresNearby(tile).map((o) => {
        if (!o.structures.includes(STRUCTURE_ROAD)) {
          return null;
        }
        const key = `${tile}-${o.dx}-${o.dy}`;
        return o.dx === -1 && o.dy === -1 ? (
          <svg key={key} style={roadStyle}>
            <line x1='0' y1='0' x2='50%' y2='50%' stroke={roadColor} strokeWidth={2} />
          </svg>
        ) : o.dx === 0 && o.dy === -1 ? (
          <svg key={key} style={roadStyle}>
            <line x1='50%' y1='0' x2='50%' y2='50%' stroke={roadColor} strokeWidth={2} />
          </svg>
        ) : o.dx === 1 && o.dy === -1 ? (
          <svg key={key} style={roadStyle}>
            <line x1='100%' y1='0' x2='50%' y2='50%' stroke={roadColor} strokeWidth={2} />
          </svg>
        ) : o.dx === 1 && o.dy === 0 ? (
          <svg key={key} style={roadStyle}>
            <line x1='100%' y1='50%' x2='50%' y2='50%' stroke={roadColor} strokeWidth={2} />
          </svg>
        ) : o.dx === 1 && o.dy === 1 ? (
          <svg key={key} style={roadStyle}>
            <line x1='100%' y1='100%' x2='50%' y2='50%' stroke={roadColor} strokeWidth={2} />
          </svg>
        ) : o.dx === 0 && o.dy === 1 ? (
          <svg key={key} style={roadStyle}>
            <line x1='50%' y1='100%' x2='50%' y2='50%' stroke={roadColor} strokeWidth={2} />
          </svg>
        ) : o.dx === -1 && o.dy === 1 ? (
          <svg key={key} style={roadStyle}>
            <line x1='0' y1='100%' x2='50%' y2='50%' stroke={roadColor} strokeWidth={2} />
          </svg>
        ) : o.dx === -1 && o.dy === 0 ? (
          <svg key={key} style={roadStyle}>
            <line x1='0' y1='50%' x2='50%' y2='50%' stroke={roadColor} strokeWidth={2} />
          </svg>
        ) : null;
      });
      return roads.concat(adjacentRoads);
    }
    return null;
  };

  return (
    <Box
      key={tile}
      sx={{
        position: 'relative',
        ':before': {
          content: '""',
          display: 'block',
          paddingTop: '100%',
        },
      }}
    >
      <Box
        className={tileClass}
        component='div'
        data-tile={tile}
        onMouseDown={handleMouseEvent}
        onMouseOver={handleMouseEvent}
        onMouseOut={handleMouseLeave}
        onContextMenu={(e) => e.preventDefault()}
        sx={{
          backgroundColor: ({ palette }) => palette.secondary.light,
          ...tilePosition,
          // Hover tile highlight styling
          ':after': {
            ...tilePosition,
            content: '""',
            backgroundColor: 'rgba(255,255,255,0.08)',
            boxShadow: 'inset rgba(0,0,0,0.05) 0 0 0 1px',
            opacity: 0,
          },
          ':hover:after': {
            opacity: 1,
          },
        }}
      >
        {getCellContent()}
      </Box>
    </Box>
  );
});
