import { CSSProperties } from 'react';
import { STRUCTURE_ROAD } from '../utils/constants';
import { useSettings } from '../state/Settings';
import { StructuresNearbyData } from '../utils/types';

type Props = {
  roadStyle: CSSProperties;
  previewIcon: boolean;
  tile: number;
  structures: string[];
  getStructuresNearby: (tile: number) => StructuresNearbyData[];
  isHovered: boolean;
};

export default function RoadSvg({
  tile,
  structures,
  isHovered,
  getStructuresNearby,
  roadStyle,
  previewIcon = false,
}: Props) {
  const brush = useSettings((state) => state.settings.brush);
  const tileHasRoad = structures.includes(STRUCTURE_ROAD);
  const preview = brush === STRUCTURE_ROAD && !tileHasRoad && isHovered;

  if (!preview && !tileHasRoad) {
    return null;
  }

  const previewColor = 'rgba(107,107,107,0.4)';
  const solidColor = '#6b6b6b';
  const roadColor = preview || previewIcon ? previewColor : solidColor;
  const roads: Array<JSX.Element | null> = [
    <svg key={tile} style={roadStyle}>
      <circle cx='50%' cy='50%' r='1' fill={roadColor} />
    </svg>,
  ];

  const deltaToPercent = (delta: number) => {
    switch (delta) {
      case 0:
        return '50%';
      case 1:
        return '100%';
      default:
        return '0';
    }
  };

  const adjacentRoads = getStructuresNearby(tile).map((o) => {
    if (!o.structures.includes(STRUCTURE_ROAD)) {
      return null;
    }
    const key = `${tile}-${o.dx}-${o.dy}`;
    return (
      <svg key={key} style={roadStyle}>
        <line
          x1={deltaToPercent(o.dx)}
          y1={deltaToPercent(o.dy)}
          x2='50%'
          y2='50%'
          stroke={roadColor}
          strokeWidth={2}
        />
      </svg>
    );
  });

  return <>{roads.concat(adjacentRoads)}</>;
}
