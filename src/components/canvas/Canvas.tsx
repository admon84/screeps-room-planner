import React, { WheelEvent, useCallback, useEffect, useRef, useState } from 'react';
import { GameRenderer } from '@screeps/renderer';
import { resourceMap, rescaleResources } from '@/utils/resourceMap';
import { worldConfigs } from '@/utils/worldConfigs';

const TICK_DURATION = 1;

interface CanvasProps {
  samples: any[];
  terrain: any;
  onGameLoop?: (time: number) => void;
  onMetricsUpdate?: (metrics: any) => void;
}

const Canvas = ({ onMetricsUpdate, samples, terrain, onGameLoop }: CanvasProps) => {
  const gameCanvasRef = useRef<HTMLDivElement | null>(null);
  const [gameApp, setGameApp] = useState<typeof GameRenderer | null>(null);
  const [pan, setPan] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const createGameApp = async () => {
      if (!gameCanvasRef.current) return;

      await GameRenderer.compileMetadata(worldConfigs.metadata);

      const game = new GameRenderer({
        size: {
          width: gameCanvasRef.current.clientWidth,
          height: gameCanvasRef.current.clientHeight,
        },
        resourceMap,
        worldConfigs,
        onGameLoop,
        rescaleResources,
        countMetrics: true,
        useDefaultLogger: false,
        backgroundColor: 0x050505,
      });

      setGameApp(game);
    };

    createGameApp();
  }, [onGameLoop]);

  useEffect(() => {
    const metricsUpdate = () => {
      onMetricsUpdate?.(gameApp.metrics);
      setTimeout(metricsUpdate, 1000 * TICK_DURATION);
    };

    async function initGameApp() {
      if (!gameApp) return;

      metricsUpdate();

      await gameApp.init(gameCanvasRef.current);
      // console.log('gameApp initialized', gameApp);

      await gameApp.setTerrain(terrain);

      gameApp.resize();
      gameApp.zoomLevel = 0.2;

      let i = 0;

      const applySamples = () => {
        const sample = samples[i];
        gameApp.applyState(sample, TICK_DURATION);
        i = (i + 1) % samples.length;
        setTimeout(applySamples, 1000 * TICK_DURATION);
      };

      applySamples();

      // PIXI interaction events
      // gameApp.app.renderer.plugins.interaction.on('pointermove', (event: any) => {
      //   console.log('pointermove', event);
      // });
    }

    initGameApp();
  }, [gameApp, samples, terrain, onMetricsUpdate]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setPan({ x: e.pageX, y: e.pageY });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (pan) {
      gameApp.pan(e.pageX - pan.x, e.pageY - pan.y);
      setPan({ x: e.pageX, y: e.pageY });
    }
    // debug mouse position
    // if (gameApp) {
    //   // console.log('renderer plugins', safeStringify(gameApp.app.renderer.plugins));
    //   const { mouse } = gameApp.app.renderer.plugins.interaction;
    //   console.log('mouse moved', mouse.global.x, mouse.global.y, mouse.buttons);
    // }
  };

  const handleMouseUp = () => {
    setPan(null);
  };

  const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
    if (e.deltaY < 0) {
      gameApp.zoomTo(gameApp.zoomLevel + 0.05, e.pageX, e.pageY);
    } else {
      gameApp.zoomTo(Math.max(gameApp.zoomLevel - 0.05, 0.1), e.pageX, e.pageY);
    }
  };

  return (
    <div
      className='ScreepsGameCanvas'
      ref={gameCanvasRef}
      style={{ width: 'calc(100vw - 300px)', height: 'calc(100vh - 48px)' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
    />
  );
};

export default Canvas;

// function safeStringify(obj: any) {
//   const cache = new Set();
//   return JSON.stringify(obj, (_, value) => {
//     if (typeof value === 'object' && value !== null && !cache.has(value)) {
//       cache.add(value);
//     }
//     return value;
//   });
// }
