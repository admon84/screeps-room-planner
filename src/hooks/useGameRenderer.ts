import { GameRenderer } from '@screeps/renderer';
import { useEffect, useRef, useState } from 'react';
import { resourceMap, rescaleResources } from '@/utils/resourceMap';
import { worldConfigs } from '@/utils/worldConfigs';
import {
  convertGlobalToCanvasPosition,
  convertGlobalToRoomPosition,
  convertRoomToWorldPosition,
  createHighlight,
} from '@/utils/canvas';
import { CELL_SIZE } from '@/utils/worldConfigs';
import { useGameObjectStore } from '@/stores/useGameObjectsStore';
import { createGameState } from '@/utils/gameState';
import { isRoomPosition } from '@/utils/helpers';
import { createLink, createRoad } from '@/utils/gameObjects';
import { Point } from '@/types';

const TICK_DURATION = 1;

interface Props {
  gameCanvasRef: React.RefObject<HTMLDivElement | null>;
  terrain: any;
  onGameLoop?: () => void;
  onMetricsUpdate?: (metrics: any) => void;
}

export const useGameRenderer = ({ gameCanvasRef, terrain, onGameLoop, onMetricsUpdate }: Props) => {
  const [gameApp, setGameApp] = useState<GameRenderer | null>(null);
  const [hoverPos, setHoverPos] = useState<Point | null>(null);
  const [isGameAppInitialized, setGameAppInitialized] = useState(false);
  const objects = useGameObjectStore((state) => state.objects);
  const gameState = createGameState(objects);
  const gameStateRef = useRef(gameState);
  gameStateRef.current = gameState;

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
    const metricsUpdate = () => {
      onMetricsUpdate?.(gameApp?.metrics);
      setTimeout(metricsUpdate, 1000 * TICK_DURATION);
    };

    async function initGameApp() {
      if (!gameApp) return;

      metricsUpdate();

      // console.log(`initGameApp`, gameApp);
      await gameApp.init(gameCanvasRef.current);
      await gameApp.setTerrain(terrain);
      gameApp.zoomLevel = 0.2;
      gameApp.applyState(gameState as any, TICK_DURATION);

      if (!gameApp.app.stage) return;

      const highlight = new PIXI.Graphics();
      highlight.beginFill(0xffffff, 1);
      highlight.drawRect(0, 0, CELL_SIZE, CELL_SIZE);
      highlight.endFill();
      highlight.alpha = 0.4;
      // const highlight = createHighlight();

      gameApp.app.stage.addChild(highlight);
      gameApp.app.stage.interactive = true;

      // Convert mouse coordinates to room position
      gameApp.app.stage
        .on('mousemove', (event: any) => {
          const roomPos = convertGlobalToRoomPosition(event.data.global, gameApp.app.stage);
          setHoverPos(roomPos);

          const worldPos = convertRoomToWorldPosition(roomPos);
          // console.log('mouse move', worldPos, event.data);

          if (highlight.visible && highlight.worldVisible) {
            highlight.x = worldPos.x;
            highlight.y = worldPos.y;
          }
        })
        .on('mouseout', (event: any) => {
          // console.log('mouse out', event.data);
          highlight.clear();
          setHoverPos(null);
        });

      setGameAppInitialized(true);
    }

    initGameApp();
  }, [gameApp, terrain, onMetricsUpdate]);

  useEffect(() => {
    if (!gameApp || !isGameAppInitialized) return;

    const updateGameState = () => {
      gameApp.applyState(gameStateRef.current as any, TICK_DURATION);
      setTimeout(updateGameState, 1000 * TICK_DURATION);
    };
    const timeoutId = setTimeout(updateGameState, 0);

    return () => clearTimeout(timeoutId);
  }, [gameApp, gameState, isGameAppInitialized]);

  useEffect(() => {
    const handleResize = () => {
      if (!gameCanvasRef.current || !gameApp) return;
      const newSize = gameCanvasRef.current.getBoundingClientRect();
      gameApp?.resize(newSize);
    };

    document.addEventListener('resize', handleResize);
    return () => {
      document.removeEventListener('resize', handleResize);
    };
  }, [gameApp]);

  return { gameApp, hoverPos };
};
