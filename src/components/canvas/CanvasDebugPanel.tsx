import * as Mui from '@mui/material';
import type { Metrics } from '@/types';

interface CanvasDebugPanelProps {
  metrics: Metrics;
}

export default function CanvasDebugPanel({ metrics }: CanvasDebugPanelProps) {
  const { fps, gameObjectCounter, rendererCounter, renderer } = metrics;

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
      }}
    >
      <Mui.Typography>FPS: {metrics.fps}</Mui.Typography>
      <Mui.Typography>Renderer: {JSON.stringify(metrics.renderer)}</Mui.Typography>
    </Mui.Card>
  );
}
