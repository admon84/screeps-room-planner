import { lazy, Suspense, useState, useCallback } from 'react';
import CanvasDebugPanel from './CanvasDebugPanel';
import { useTerrainStore } from '@/stores/useTerrainStore';
import type { Metrics } from '@/types';

// @screeps/renderer drags in a ~2 MB PIXI bundle. Splitting it out lets the app shell paint before
// the renderer chunk arrives.
const Canvas = lazy(() => import('./Canvas'));

export default function CanvasWrapper() {
  const [metrics, setMetrics] = useState<Metrics>({
    fps: 0,
  });
  const terrain = useTerrainStore((state) => state.terrain);

  const handleMetricsUpdate = useCallback((newMetrics: Metrics) => {
    setMetrics((prevMetrics) => ({ ...prevMetrics, ...newMetrics }));
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <Canvas terrain={terrain} onMetricsUpdate={handleMetricsUpdate} />
      </Suspense>
      <CanvasDebugPanel metrics={metrics} />
    </>
  );
}
