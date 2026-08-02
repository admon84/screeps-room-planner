import * as Mui from '@mui/material';
import { getBrushProps } from '@/utils/brushPreview';
import { useSettings } from '@/stores/Settings';

const iconSize = '1.1rem';

export default function BrushIndicator() {
  const brush = useSettings((state) => state.settings.brush);
  const brushType = useSettings((state) => state.settings.brushType);
  const resetBrush = useSettings((state) => state.resetBrush);

  if (!brush) {
    return null;
  }

  const { name, image, swatch } = getBrushProps({ key: brush, type: brushType });

  return (
    <Mui.Tooltip arrow title='Active brush'>
      <Mui.Chip
        icon={
          <Mui.Box
            sx={({ palette }) => ({
              backgroundColor: swatch,
              backgroundImage: image && `url(${image})`,
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'contain',
              // Terrain swatches are near-flat dark fills, so they need an outline to read against
              // the app bar rather than dissolving into it.
              border: swatch ? `1px solid ${palette.grey[600]}` : undefined,
              borderRadius: swatch ? '2px' : undefined,
              boxSizing: 'border-box',
              height: iconSize,
              width: iconSize,
            })}
          />
        }
        label={name}
        onDelete={resetBrush}
        size='small'
        sx={{ fontSize: '.7rem', fontWeight: 500, textTransform: 'capitalize' }}
        variant='outlined'
      />
    </Mui.Tooltip>
  );
}
