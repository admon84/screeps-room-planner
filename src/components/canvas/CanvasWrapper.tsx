import { lazy, Suspense, useState, useCallback } from 'react';
import CanvasDebugPanel from './CanvasDebugPanel';
import { useSettings } from '@/stores/Settings';
import { useTerrainStore } from '@/stores/useTerrainStore';
import type { Metrics } from '@/types';

// @screeps/renderer drags in a ~2 MB PIXI bundle. Splitting it out lets the app shell paint before
// the renderer chunk arrives.
const Canvas = lazy(() => import('./Canvas'));

export default function CanvasWrapper() {
  const [metrics, setMetrics] = useState<Metrics>({
    fps: 0,
  });
  const debug = useSettings((state) => state.settings.debug);
  const terrain = useTerrainStore((state) => state.terrain);

  // The renderer's metrics timer lives inside its init effect and stays running -- gating it there
  // would rebuild the WebGL context on every toggle. Dropping the update here is enough to stop the
  // per-tick re-render while debug is off.
  const handleMetricsUpdate = useCallback(
    (newMetrics: Metrics) => {
      if (!debug) return;
      setMetrics((prevMetrics) => ({ ...prevMetrics, ...newMetrics }));
    },
    [debug]
  );

  return (
    <>
      <Suspense fallback={null}>
        <Canvas terrain={terrain} onMetricsUpdate={handleMetricsUpdate} />
      </Suspense>
      {debug && <CanvasDebugPanel metrics={metrics} />}
    </>
  );
}
