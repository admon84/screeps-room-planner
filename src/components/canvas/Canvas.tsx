import React, { WheelEvent, useEffect, useRef, useState } from 'react';
import { GameRenderer } from '@screeps/renderer';
import { resourceMap, rescaleResources } from '@/utils/resourceMap';
import { worldConfigs } from '@/utils/worldConfigs';

const TICK_DURATION = 1;

interface CanvasProps {
  samples: any[];
  terrain: any;
  onGameLoop?: () => void;
  onMetricsUpdate?: (metrics: any) => void;
}

export default function Canvas({ onMetricsUpdate, samples, terrain, onGameLoop }: CanvasProps) {
  const gameCanvasRef = useRef<HTMLDivElement | null>(null);
  const [gameApp, setGameApp] = useState<GameRenderer | null>(null);
  const [pan, setPan] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const createGameApp = async () => {
      if (!gameCanvasRef.current) return;

      await GameRenderer.compileMetadata(worldConfigs.metadata);

      const options = {
        size: {
          width: gameCanvasRef.current.clientWidth,
          height: gameCanvasRef.current.clientHeight,
        },
        resourceMap,
        worldConfigs,
        onGameLoop,
        rescaleResources,
        countMetrics: true,
        backgroundColor: 0x050505,
      };

      const gameRenderer = new GameRenderer(options);

      setGameApp(gameRenderer);
    };

    createGameApp();
  }, [onGameLoop]);

  useEffect(() => {
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    const applySamples = async () => {
      for (const state of samples) {
        gameApp?.applyState(state, TICK_DURATION);
        await delay(1000 * TICK_DURATION);
      }
    };

    const metricsUpdate = () => {
      onMetricsUpdate?.(gameApp?.metrics);
      setTimeout(metricsUpdate, 1000 * TICK_DURATION);
    };

    async function initGameApp() {
      if (!gameApp) return;

      metricsUpdate();

      await gameApp.init(gameCanvasRef.current);
      // console.log('GameRenderer initialized', gameApp);

      await gameApp.setTerrain(terrain);

      gameApp.zoomLevel = 0.2;

      applySamples();

      const size = worldConfigs.CELL_SIZE;
      const offset = size / 2;
      const highlight = new PIXI.Graphics();
      highlight.beginFill(0xffffff, 1);
      highlight.drawRect(0, 0, size, size);
      highlight.endFill();
      highlight.alpha = 0.4;
      gameApp.app.stage.addChild(highlight);
      gameApp.app.stage.interactive = true;

      // Highlight the room position on mouse move
      gameApp.app.stage.on('mousemove', (event: any) => {
        const { x, y } = event.data.global;

        // Convert the mouse coordinates to local coordinates
        const localPoint = gameApp.app.stage.toLocal(new PIXI.Point(x, y));
        localPoint.x += offset;
        localPoint.y += offset;

        // Convert the local coordinates to a room position
        const roomX = Math.floor(localPoint.x / size);
        const roomY = Math.floor(localPoint.y / size);

        if (roomX >= 0 && roomX <= 49 && roomY >= 0 && roomY <= 49) {
          console.log('mouse position', { x: roomX, y: roomY });
        }

        // Convert the room position back to world coordinates
        highlight.x = roomX * size - offset;
        highlight.y = roomY * size - offset;
      });

      gameApp.app.stage.on('mouseout', () => {
        highlight.clear();
      });
    }

    initGameApp();
  }, [gameApp, samples, terrain, onMetricsUpdate]);

  useEffect(() => {
    const handleResize = () => {
      if (!gameCanvasRef.current || !gameApp) return;

      const { width, height } = gameCanvasRef.current.getBoundingClientRect();
      gameApp?.resize({ width, height });
    };

    document.addEventListener('resize', handleResize);
    return () => {
      document.removeEventListener('resize', handleResize);
    };
  }, [gameApp]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setPan({ x: e.pageX, y: e.pageY });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (pan) {
      gameApp?.pan(e.pageX - pan.x, e.pageY - pan.y);
      setPan({ x: e.pageX, y: e.pageY });
      gameApp?.app.renderer.plugins.interaction.setCursorMode('grabbing');
    }
  };

  const handleMouseUp = () => {
    setPan(null);
    gameApp?.app.renderer.plugins.interaction.setCursorMode('default');
  };

  const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
    if (e.deltaY < 0) {
      gameApp?.zoomTo(gameApp.zoomLevel + 0.05, e.pageX, e.pageY);
    } else {
      gameApp?.zoomTo(Math.max(gameApp.zoomLevel - 0.05, 0.1), e.pageX, e.pageY);
    }
  };

  return (
    <div
      className='screeps-renderer'
      ref={gameCanvasRef}
      style={{ width: 'calc(100vw - 300px)', height: 'calc(100vh - 48px)' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
    />
  );
}
