import React, { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import CanvasDebugPanel from './CanvasDebugPanel';

// @screeps/renderer (and PIXI) reference `window` at module load, which breaks
// Next's static prerender. Load the canvas client-side only.
const Canvas = dynamic(() => import('./Canvas'), { ssr: false });
import { SAMPLE_TERRAIN } from '@/utils/sampleTerrain';
import type { Metrics } from '@/types';

export default function CanvasWrapper() {
  const [metrics, setMetrics] = useState<Metrics>({
    fps: 0,
  });

  const handleMetricsUpdate = useCallback((newMetrics: Metrics) => {
    setMetrics((prevMetrics) => ({ ...prevMetrics, ...newMetrics }));
  }, []);

  return (
    <>
      <Canvas terrain={SAMPLE_TERRAIN} onMetricsUpdate={handleMetricsUpdate} />
      <CanvasDebugPanel metrics={metrics} />
    </>
  );
}
