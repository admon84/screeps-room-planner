import { CSSProperties, memo, useState } from 'react';
import { Box } from '@mui/material';
import { STRUCTURE_RAMPART, STRUCTURE_ROAD, TERRAIN_SWAMP, TERRAIN_WALL } from '../utils/constants';
import { getStructureBrushes, structuresToRemove } from '../utils/helpers';
import { useHoverTile } from '../contexts/HoverTileContext';
import { NearbyRoadsData } from '../utils/types';

type Props = {
  brush: string | null;
  nearbyRoads: NearbyRoadsData;
  placedStructures: string[];
  brushCanBePlaced: boolean;
  tile: number;
  terrain: string;
  rcl: number;
  addStructure: (tile: number) => void;
  removeStructure: (tile: number, structure: string) => void;
};

export default memo(function RoomGridTile({
  brush,
  placedStructures,
  brushCanBePlaced,
  tile,
  terrain,
  rcl,
  addStructure,
  removeStructure,
  nearbyRoads,
}: Props) {
  // console.log(`-- rendering tile ${tile} --`);
  const [isHovered, setIsHovered] = useState(false);
  const { updateHover } = useHoverTile();
  const structureBrushes = getStructureBrushes(rcl);
  const tileClass = 'tile';
  const tilePosition = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  };

  const handleMouseEvent = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();

    setIsHovered(true);
    // updateHover({ type: 'set_hover', tile }); // TODO: fix bad performance

    if (e.buttons === 1) {
      addStructure(tile);
    } else if (e.buttons === 2) {
      structureBrushes.forEach(({ key }) => removeStructure(tile, key));
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    setIsHovered(false);
    updateHover({ type: 'reset' });
  };

  const getCellContent = (): React.ReactNode => {
    const previewIcon = brushCanBePlaced && isHovered;

    let drawStructures = [...placedStructures];

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
    const tileHasRoad = placedStructures.includes(STRUCTURE_ROAD);
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

      const adjacentRoads = Object.entries(nearbyRoads).map(([key, { dx, dy }]) => {
        const nearTile = parseInt(key);

        return dx === -1 && dy === -1 ? (
          <svg key={nearTile} style={roadStyle}>
            <line x1='0' y1='0' x2='50%' y2='50%' stroke={roadColor} strokeWidth={2} />
          </svg>
        ) : dx === 0 && dy === -1 ? (
          <svg key={nearTile} style={roadStyle}>
            <line x1='50%' y1='0' x2='50%' y2='50%' stroke={roadColor} strokeWidth={2} />
          </svg>
        ) : dx === 1 && dy === -1 ? (
          <svg key={nearTile} style={roadStyle}>
            <line x1='100%' y1='0' x2='50%' y2='50%' stroke={roadColor} strokeWidth={2} />
          </svg>
        ) : dx === 1 && dy === 0 ? (
          <svg key={nearTile} style={roadStyle}>
            <line x1='100%' y1='50%' x2='50%' y2='50%' stroke={roadColor} strokeWidth={2} />
          </svg>
        ) : dx === 1 && dy === 1 ? (
          <svg key={nearTile} style={roadStyle}>
            <line x1='100%' y1='100%' x2='50%' y2='50%' stroke={roadColor} strokeWidth={2} />
          </svg>
        ) : dx === 0 && dy === 1 ? (
          <svg key={nearTile} style={roadStyle}>
            <line x1='50%' y1='100%' x2='50%' y2='50%' stroke={roadColor} strokeWidth={2} />
          </svg>
        ) : dx === -1 && dy === 1 ? (
          <svg key={nearTile} style={roadStyle}>
            <line x1='0' y1='100%' x2='50%' y2='50%' stroke={roadColor} strokeWidth={2} />
          </svg>
        ) : dx === -1 && dy === 0 ? (
          <svg key={nearTile} style={roadStyle}>
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
