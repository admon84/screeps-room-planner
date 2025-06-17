import React, { useState, useCallback } from 'react';
import Canvas from './Canvas';
import CanvasDebugPanel from './CanvasDebugPanel';
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
