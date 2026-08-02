import * as Mui from '@mui/material';
import type { Metrics } from '@/types';

interface CanvasDebugPanelProps {
  metrics: Metrics;
}

export default function CanvasDebugPanel({ metrics }: CanvasDebugPanelProps) {
  const rows: Array<[string, string | number | undefined]> = [
    ['FPS', metrics.fps],
    ['Objects', metrics.gameObjectCounter],
    ['Sprites', metrics.rendererCounter],
    ['WebGL', metrics.renderer?.WebGL],
    ['GPU', metrics.renderer?.GPU],
    ['Buffer', metrics.renderer?.size],
    ['Pixel ratio', metrics.devicePixelRatio],
  ];

  return (
    <Mui.Card
      sx={{
        position: 'absolute',
        bottom: 0,
        zIndex: 1,
        background: 'rgba(0,0,0,0.3)',
        color: 'white',
        fontSize: '1rem',
        padding: '10px',
        maxWidth: 320,
      }}
    >
      {rows
        .filter(([, value]) => value !== undefined)
        .map(([label, value]) => (
          <Mui.Typography key={label} sx={{ fontSize: '0.75rem', display: 'flex', gap: 1 }}>
            <span style={{ opacity: 0.7 }}>{label}:</span>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</span>
          </Mui.Typography>
        ))}
    </Mui.Card>
  );
}
