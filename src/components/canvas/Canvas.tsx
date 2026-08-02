import React, { useEffect, useRef } from 'react';
import * as Constants from '@/utils/constants';
import * as Helpers from '@/utils/helpers';
import { useGameRenderer } from '@/hooks/useGameRenderer';
import { useCameraControls } from '@/hooks/useCameraControls';
import { isEraseGesture, isPaintGesture, isPanGesture } from '@/utils/canvas';
import { countPlacedByType, useGameObjectStore } from '@/stores/useGameObjectsStore';
import { useTerrainStore } from '@/stores/useTerrainStore';
import { createObjectFromType } from '@/utils/gameObjects';
import { useSettings } from '@/stores/Settings';
import CanvasControls from './CanvasControls';

interface CanvasProps {
  terrain: any;
  onGameLoop?: () => void;
  onMetricsUpdate?: (metrics: any) => void;
}

export default function Canvas({ onMetricsUpdate, terrain, onGameLoop }: CanvasProps) {
  const gameCanvasRef = useRef<HTMLDivElement | null>(null);
  // Refs rather than state: a drag fires these on every mousemove, and re-rendering per frame
  // would stall the pan.
  const isMouseDownRef = useRef(false);
  const isPanningRef = useRef(false);
  const { gameApp, hoverPos } = useGameRenderer({ gameCanvasRef, terrain, onGameLoop, onMetricsUpdate });
  const { zoomIn, zoomOut, fitRoom, panSmoothBy } = useCameraControls({ gameApp, containerRef: gameCanvasRef });
  const addObject = useGameObjectStore((state) => state.addObject);
  const removeObjectsAt = useGameObjectStore((state) => state.removeObjectsAt);
  const removeStructuresAt = useGameObjectStore((state) => state.removeStructuresAt);
  const setTerrainAt = useTerrainStore((state) => state.setTerrainAt);
  const brush = useSettings((state) => state.settings.brush);
  const brushType = useSettings((state) => state.settings.brushType);
  const rcl = useSettings((state) => state.settings.rcl);
  const resetBrush = useSettings((state) => state.resetBrush);

  useEffect(() => {
    if (!gameCanvasRef.current || !gameApp) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        gameApp.resize({ width, height });
      }
    });

    resizeObserver.observe(gameCanvasRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [gameApp]);

  /**
   * Applies the active brush to a room tile. Structure placement is validated against the RCL cap
   * and the tile's terrain, mirroring the legacy DOM grid's `addBrush`.
   */
  const paintAt = (x: number, y: number) => {
    if (!brush) return;

    // Routing on brushType rather than the brush string matters: terrain wall ('wall') and the
    // constructed wall structure ('constructedWall') are distinct values that read alike.
    switch (brushType) {
      case Constants.BrushType.Terrain:
        setTerrainAt(x, y, brush);
        // Nothing can stand on a terrain wall, so painting one evicts whatever was built there.
        if (brush === Constants.TERRAIN_WALL) removeStructuresAt(x, y);
        return;
      case Constants.BrushType.Structure: {
        // Drag-painting fires many times between renders, so the placement count and terrain have
        // to be read live -- a value captured at render time would walk past the RCL cap.
        const terrainType =
          useTerrainStore.getState().terrain.find((t) => t.x === x && t.y === y)?.type ?? Constants.TERRAIN_PLAIN;
        const placed = countPlacedByType(useGameObjectStore.getState().objects)[brush] ?? 0;
        if (!Helpers.structureCanBePlaced(brush, rcl, terrainType, placed)) return;

        addObject(createObjectFromType({ type: brush, x, y }));

        // Counted fresh after the write rather than as `placed + 1`: addObject displaces whatever
        // shared the tile, so the delta is not always +1 and a predicted count deselects early.
        const total = countPlacedByType(useGameObjectStore.getState().objects)[brush] ?? 0;
        if (!Helpers.structureCanBePlaced(brush, rcl, terrainType, total)) resetBrush();
        return;
      }
      default: {
        // Replacing an object on its own tile keeps the count flat, so an occupied tile stays
        // paintable even at the cap.
        const objects = useGameObjectStore.getState().objects;
        const storedType = Helpers.getObjectTypeForBrush(brush);
        const occupiesTile = objects.some((o) => o.x === x && o.y === y && o.type === storedType);
        const placed = countPlacedByType(objects)[storedType] ?? 0;
        if (!occupiesTile && !Helpers.objectCanBePlaced(brush, placed)) return;

        addObject(createObjectFromType({ type: brush, x, y }));

        const total = countPlacedByType(useGameObjectStore.getState().objects)[storedType] ?? 0;
        if (!Helpers.objectCanBePlaced(brush, total)) resetBrush();
      }
    }
  };

  // PIXI 7 replaced `renderer.plugins.interaction.setCursorMode()` with the EventSystem. The old
  // path survives as a deprecation shim that returns the EventSystem, which has no setCursorMode,
  // so calling it would throw rather than silently no-op.
  const setCursor = (mode: string) => gameApp?.app.renderer.events.setCursor(mode);

  const handleMouseOver = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.shiftKey) {
      setCursor('grab');
    }
  };

  const handleMouseOut = () => {
    setCursor('default');
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    isMouseDownRef.current = true;

    if (isPanGesture(e)) {
      isPanningRef.current = true;
      setCursor('grabbing');
      return;
    }

    if (!hoverPos) return;

    if (isEraseGesture(e)) {
      removeObjectsAt(hoverPos.x, hoverPos.y);
      return;
    }

    if (isPaintGesture(e)) {
      paintAt(hoverPos.x, hoverPos.y);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (isPanningRef.current && isPanGesture(e)) {
      panSmoothBy(e.movementX, e.movementY);
      setCursor('grabbing');
      return;
    }

    setCursor(e.shiftKey ? 'grab' : 'default');

    if (!isMouseDownRef.current || !hoverPos) return;

    if (isEraseGesture(e)) {
      removeObjectsAt(hoverPos.x, hoverPos.y);
      return;
    }

    if (isPaintGesture(e)) {
      paintAt(hoverPos.x, hoverPos.y);
    }
  };

  const handleMouseUp = () => {
    isMouseDownRef.current = false;
    isPanningRef.current = false;
    setCursor('default');
  };

  return (
    <>
      <div
        className='screeps-renderer'
        ref={gameCanvasRef}
        style={{ width: 'calc(100vw - 300px)', height: 'calc(100vh - 48px)' }}
        onContextMenu={(e) => e.preventDefault()}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
      <CanvasControls onZoomIn={zoomIn} onZoomOut={zoomOut} onFitRoom={fitRoom} />
    </>
  );
}
