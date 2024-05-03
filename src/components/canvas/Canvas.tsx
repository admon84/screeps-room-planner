import React, { WheelEvent, useRef, useState } from 'react';
import { useGameRenderer } from '@/hooks/useGameRenderer';
import { Point } from '@/types';
import { useGameObjectStore } from '@/stores/useGameObjectsStore';
import { createObjectFromType } from '@/utils/gameObjects';
import { useSettings } from '@/stores/Settings';

interface CanvasProps {
  terrain: any;
  onGameLoop?: () => void;
  onMetricsUpdate?: (metrics: any) => void;
}

export default function Canvas({ onMetricsUpdate, terrain, onGameLoop }: CanvasProps) {
  const gameCanvasRef = useRef<HTMLDivElement | null>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [pan, setPan] = useState<Point | null>(null);
  const { gameApp, hoverPos } = useGameRenderer({ gameCanvasRef, terrain, onGameLoop, onMetricsUpdate });
  const addObject = useGameObjectStore((state) => state.addObject);
  const removeObject = useGameObjectStore((state) => state.removeObject);
  const brush = useSettings((state) => state.settings.brush);

  const handleMouseOver = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.shiftKey) {
      gameApp?.app.renderer.plugins.interaction.setCursorMode('grab');
    }
  };

  const handleMouseOut = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    gameApp?.app.renderer.plugins.interaction.setCursorMode('default');
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // console.log('Canvas > mouse down', hoverPos, e);
    setIsMouseDown(true);

    if (e.shiftKey) {
      setPan({ x: e.clientX, y: e.clientY });
      return;
    }

    if (e.buttons === 1 && hoverPos) {
      addObject(createObjectFromType({ type: brush, x: hoverPos.x, y: hoverPos.y }));
      return;
    }

    if (e.buttons === 2 && hoverPos) {
      removeObject({ x: hoverPos.x, y: hoverPos.y });
      return;
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // console.log('Canvas > mouse move', hoverPos, e);
    if (e.shiftKey) {
      if (pan) {
        gameApp?.pan(e.movementX, e.movementY);
        setPan({ x: e.clientX, y: e.clientY });
        gameApp?.app.renderer.plugins.interaction.setCursorMode('grabbing');
      } else {
        gameApp?.app.renderer.plugins.interaction.setCursorMode('grab');
      }
      return;
    }

    if (e.buttons === 1 && isMouseDown && hoverPos) {
      addObject(createObjectFromType({ type: brush, x: hoverPos.x, y: hoverPos.y }));
      return;
    }

    if (e.buttons === 2 && isMouseDown && hoverPos) {
      removeObject({ x: hoverPos.x, y: hoverPos.y });
      return;
    }
  };

  const handleMouseUp = () => {
    // console.log('Canvas > mouse up', hoverPos);
    setIsMouseDown(false);
    setPan(null);
    gameApp?.app.renderer.plugins.interaction.setCursorMode('default');
  };

  const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
    // console.log('Canvas > wheel', hoverPos, e);
    if (e.shiftKey) {
      if (e.deltaY < 0) {
        gameApp?.zoomTo(gameApp.zoomLevel + 0.05, e.clientX, e.clientY);
      } else {
        gameApp?.zoomTo(Math.max(gameApp.zoomLevel - 0.05, 0.1), e.clientX, e.clientY);
      }
    }
  };

  return (
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
      onWheel={handleWheel}
    />
  );
}