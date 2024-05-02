import React, { useState, useCallback } from 'react';
import Canvas from './Canvas';
import CanvasDebugPanel from './CanvasDebugPanel';
import { EXAMPLE_STRUCTURES, EXAMPLE_TERRAIN } from '../../utils/constants';
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
      <Canvas samples={EXAMPLE_STRUCTURES} terrain={EXAMPLE_TERRAIN} onMetricsUpdate={handleMetricsUpdate} />
      <CanvasDebugPanel metrics={metrics} />
    </>
  );
}
