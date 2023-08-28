import * as Constants from '../utils/constants';
import * as Helpers from '../utils/helpers';
import { CSSProperties, memo, useState } from 'react';
import { Box } from '@mui/material';
import { useHoverTile } from '../state/HoverTile';
import { useSettings } from '../state/Settings';
import { StructuresNearbyData } from '../utils/types';
import RoadSvg from './RoadSvg';

type Props = {
  structures: string[];
  tile: number;
  terrain: string;
  addBrush: (tile: number, brush: string, brushType: Constants.BrushType) => void;
  removeStructure: (tile: number, brush: string) => void;
  removeObjects: (tile: number, brush: string) => void;
  getStructuresNearby: (tile: number) => StructuresNearbyData[];
  renderNearHoverTile: boolean;
  hasSource: boolean;
  hasMineralType: string | null;
};

export default memo(
  ({
    structures,
    tile,
    terrain,
    addBrush,
    removeStructure,
    removeObjects,
    getStructuresNearby,
    hasSource,
    hasMineralType,
  }: Props) => {
    const rcl = useSettings((state) => state.settings.rcl);
    const brush = useSettings((state) => state.settings.brush);
    const brushType = useSettings((state) => state.settings.brushType);
    const resetHoverTile = useHoverTile((state) => state.reset);
    const setHover = useHoverTile((state) => state.setHover);

    const [isHovered, setIsHovered] = useState(false);
    const structureBrushes = Helpers.getStructureBrushes(rcl);

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

      if (e.buttons === 1 && brush && brushType) {
        addBrush(tile, brush, brushType);
      } else if (e.buttons === 2) {
        structureBrushes.forEach(({ key }) => removeStructure(tile, key));
        removeObjects(tile, 'eraser');
      }
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.preventDefault();
      setIsHovered(false);
      resetHoverTile();
    };

    const getCellContent = (): React.ReactNode => {
      const previewIcon =
        isHovered &&
        !!brush &&
        (brushType !== Constants.BrushType.Structure ||
          (brush !== Constants.STRUCTURE_ROAD && !structures.includes(brush)));

      let drawStructures = [...structures];

      if (previewIcon && brush) {
        if (brushType === Constants.BrushType.Structure && Helpers.structureCanBePlaced(brush, rcl, terrain)) {
          drawStructures.push(brush);
          const previewRemove = Helpers.structuresToRemove(brush, true);
          drawStructures = drawStructures.filter((s) => !previewRemove.includes(s));
        } else if (brushType === Constants.BrushType.Object) {
          if (brush === Constants.SOURCE) {
            // hide all structures that will be removed if the source is placed
            drawStructures = [];
          } else {
            // hide structures that will be removed if the mineral is placed
            const previewRemove = Helpers.structuresToRemove(Constants.STRUCTURE_EXTRACTOR, true);
            drawStructures = drawStructures.filter((s) => !previewRemove.includes(s));
          }
        }
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

      const previewTerrain = isHovered && brushType === Constants.BrushType.Terrain;
      const isTerrain = (terrainType: string) =>
        (terrain === terrainType && !previewTerrain) || (previewTerrain && brush === terrainType);

      return (
        <>
          <Box
            sx={{
              ...backgroundSizeProps,
              ...positionAbsolute,
              ...(isTerrain(Constants.TERRAIN_WALL)
                ? {
                    backgroundColor: '#111111',
                  }
                : isTerrain(Constants.TERRAIN_SWAMP)
                ? {
                    backgroundColor: '#292b18',
                    boxShadow: `inset #252715 0 0 0 1px`,
                  }
                : {
                    boxShadow: 'inset rgba(0, 0, 0, 0.05) 0 0 0 1px',
                  }),
            }}
          />
          {drawStructures.includes(Constants.STRUCTURE_RAMPART) && (
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
            .filter(
              ({ key }) =>
                ![Constants.STRUCTURE_RAMPART, Constants.STRUCTURE_ROAD].includes(key) && drawStructures.includes(key)
            )
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
          {Helpers.getObjectBrushes()
            .filter(
              ({ key }) =>
                (previewIcon && brushType === Constants.BrushType.Object && brush === key) ||
                ((!previewIcon || brushType !== Constants.BrushType.Object) &&
                  (hasMineralType === key || (hasSource && key === Constants.SOURCE)))
            )
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
  }
);
