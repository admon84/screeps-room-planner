import { CSSProperties, memo, useState } from 'react';
import { Box } from '@mui/material';
import { STRUCTURE_RAMPART, STRUCTURE_ROAD, TERRAIN_SWAMP, TERRAIN_WALL } from '../utils/constants';
import { positionIsValid, structureCanBePlaced, structuresToRemove } from '../utils/helpers';
import { useHoverTile } from '../contexts/HoverTileContext';
import { NearbyPositionsData, StructureBrush } from '../utils/types';

type Props = {
  brush: string | null;
  placedStructures: string[];
  placedBrushCount: number;
  structureBrushes: StructureBrush[];
  tile: number;
  terrain: string;
  rcl: number;
  addStructure: (tile: number) => void;
  removeStructure: (tile: number, structure: string) => void;
  nearbyRoads: { [tile: number]: NearbyPositionsData };
};

export default memo(function RoomGridTile({
  brush,
  placedStructures,
  placedBrushCount,
  structureBrushes,
  tile,
  terrain,
  rcl,
  addStructure,
  removeStructure,
  nearbyRoads,
}: Props) {
  // console.log(`-- rendering tile ${tile} --`);
  const [isHovered, setIsHovered] = useState(false);
  const { updateHoverTile, resetHoverTile } = useHoverTile();
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
    // TODO: fix bad performance
    // updateHoverTile(tile);

    if (e.buttons === 1) {
      addStructure(tile);
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
    const previewIcon =
      !!brush && isHovered && brush !== STRUCTURE_ROAD && structureCanBePlaced(brush, rcl, placedBrushCount, terrain);

    let drawStructures = [...placedStructures];

    if (previewIcon) {
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

      const adjacentRoads = Object.entries(nearbyRoads).map(([key, data]) => {
        const ctile = parseInt(key);
        const cpreview = brush === STRUCTURE_ROAD && !data.hasRoad && isHovered && ctile === tile;
        const croadColor = cpreview || preview || previewIcon ? previewColor : solidColor;
        if (positionIsValid(data.x, data.y) && (cpreview || data.hasRoad)) {
          return data.dx === -1 && data.dy === -1 ? (
            <svg key={ctile} style={roadStyle}>
              <line x1='0' y1='0' x2='50%' y2='50%' stroke={croadColor} strokeWidth={2} />
            </svg>
          ) : data.dx === 0 && data.dy === -1 ? (
            <svg key={ctile} style={roadStyle}>
              <line x1='50%' y1='0' x2='50%' y2='50%' stroke={croadColor} strokeWidth={2} />
            </svg>
          ) : data.dx === 1 && data.dy === -1 ? (
            <svg key={ctile} style={roadStyle}>
              <line x1='100%' y1='0' x2='50%' y2='50%' stroke={croadColor} strokeWidth={2} />
            </svg>
          ) : data.dx === 1 && data.dy === 0 ? (
            <svg key={ctile} style={roadStyle}>
              <line x1='100%' y1='50%' x2='50%' y2='50%' stroke={croadColor} strokeWidth={2} />
            </svg>
          ) : data.dx === 1 && data.dy === 1 ? (
            <svg key={ctile} style={roadStyle}>
              <line x1='100%' y1='100%' x2='50%' y2='50%' stroke={croadColor} strokeWidth={2} />
            </svg>
          ) : data.dx === 0 && data.dy === 1 ? (
            <svg key={ctile} style={roadStyle}>
              <line x1='50%' y1='100%' x2='50%' y2='50%' stroke={croadColor} strokeWidth={2} />
            </svg>
          ) : data.dx === -1 && data.dy === 1 ? (
            <svg key={ctile} style={roadStyle}>
              <line x1='0' y1='100%' x2='50%' y2='50%' stroke={croadColor} strokeWidth={2} />
            </svg>
          ) : data.dx === -1 && data.dy === 0 ? (
            <svg key={ctile} style={roadStyle}>
              <line x1='0' y1='50%' x2='50%' y2='50%' stroke={croadColor} strokeWidth={2} />
            </svg>
          ) : null;
        }
        return null;
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
