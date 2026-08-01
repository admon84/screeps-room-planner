// `dynamic(..., { ssr: false })` is only legal inside a Client Component. This currently inherits
// the boundary from RoomPlanner, but declaring it here keeps a future direct import from a Server
// Component from breaking the build.
'use client';

import React, { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import CanvasDebugPanel from './CanvasDebugPanel';

// @screeps/renderer (and PIXI) reference `window` at module load, which breaks
// Next's static prerender. Load the canvas client-side only.
const Canvas = dynamic(() => import('./Canvas'), { ssr: false });
import { useTerrainStore } from '@/stores/useTerrainStore';
import type { Metrics } from '@/types';

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
      <Canvas terrain={terrain} onMetricsUpdate={handleMetricsUpdate} />
      <CanvasDebugPanel metrics={metrics} />
    </>
  );
}
