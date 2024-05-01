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
      if (!gameCanvasRef.current) {
        return;
      }

      // const startTime = new Date();
      // decorations.forEach((decorationItem) => {
      //   if (decorationItem.decoration.type === 'metadata') {
      //     Object.assign(resourceMap, decorationItem.decoration.resources);
      //     worldConfigs.metadata.objects[decorationItem.decoration.objectType] = decorationItem.decoration.metadata;
      //   }
      // });

      // console.log(`compile at ${startTime} with config:`, { worldConfigs });
      await GameRenderer.compileMetadata(worldConfigs.metadata);

      // console.log(`compiled in ${Date.now() - startTime.getTime()}`);
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
      if (!gameApp) {
        return;
      }

      if (onMetricsUpdate) {
        metricsUpdate();
      }

      await gameApp.init(gameCanvasRef.current);
      console.log('gameApp initialized', gameApp);

      await gameApp.setTerrain(terrain);

      gameApp.resize();
      gameApp.zoomLevel = 0.2;

      let i = 0;

      const applySamples = () => {
        const sample = samples[i];
        // const startApplyTime = new Date();
        // console.log(`run sample #${i} at ${startApplyTime}`);
        gameApp.applyState(sample, TICK_DURATION);
        // console.log(`applied in ${Date.now() - startApplyTime.getTime()}`);
        if (i < samples.length - 1) {
          i += 1;
        } else {
          i = 0;
        }
        setTimeout(applySamples, 1000 * TICK_DURATION);
      };

      applySamples();

      // game.setDecorations(decorations);
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
