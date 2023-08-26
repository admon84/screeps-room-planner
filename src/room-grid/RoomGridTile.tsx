import { CSSProperties, memo, useState } from 'react';
import { Box } from '@mui/material';
import { STRUCTURE_RAMPART, STRUCTURE_ROAD, TERRAIN_SWAMP, TERRAIN_WALL } from '../utils/constants';
import { getStructureBrushes, structuresToRemove } from '../utils/helpers';
import { useHoverTile } from '../state/HoverTile';
import { useSettings } from '../state/Settings';
import { StructuresNearbyData } from '../utils/types';
import RoadSvg from './RoadSvg';

type Props = {
  structures: string[];
  tile: number;
  terrain: string;
  rcl: number;
  addStructure: (tile: number, structure: string) => void;
  removeStructure: (tile: number, structure: string) => void;
  getStructuresNearby: (tile: number) => StructuresNearbyData[];
  renderNearHoverTile: boolean;
};

export default memo(({ structures, tile, terrain, rcl, addStructure, removeStructure, getStructuresNearby }: Props) => {
  const brush = useSettings((state) => state.brush);
  const resetHoverTile = useHoverTile((state) => state.reset);
  const setHover = useHoverTile((state) => state.setHover);

  const [isHovered, setIsHovered] = useState(false);
  const structureBrushes = getStructureBrushes(rcl);
  const brushCanBePlaced = !!brush && brush !== STRUCTURE_ROAD && !structures.includes(brush);

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
        <RoadSvg
          tile={tile}
          structures={structures}
          roadStyle={roadStyle}
          previewIcon={previewIcon}
          isHovered={isHovered}
          getStructuresNearby={getStructuresNearby}
        />
        {structureBrushes
          .filter(({ key }) => ![STRUCTURE_RAMPART, STRUCTURE_ROAD].includes(key) && drawStructures.includes(key))
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
          // hover tile highlight styling
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
