// Types for the `@screeps/renderer-metadata` package
declare module '@screeps/renderer-metadata' {
  declare global {
    const RENDERER_METADATA: Metadata;
  }
}

// Types for the `@screeps/renderer` package
declare module '@screeps/renderer' {
  export interface WorldOptions extends WorldConfigs {
    actionManager: ActionManager;
    app: PIXI.Application;
    logger: object;
    objectFilter: ObjectFilterFunc;
    resourceMap: { [key: string]: string };
    rescaleResources: string[];
    size: Size;
  }

  export class GameRenderer {
    static isWebGLSupported: boolean;
    static compileMetadata(metadata: Metadata): Promise<void>;
    metrics: Metrics;
    app: PIXI.Application;
    world: World;
    actionManager: ActionManager;
    released?: boolean;

    constructor(options: {
      autoStart?: boolean;
      backgroundColor?: number;
      size?: Size;
      worldConfigs: WorldConfigs;
      resourceMap: { [key: string]: string };
      rescaleResources: string[];
      autoFocus?: boolean;
      useDefaultLogger?: boolean;
      logger?: object;
      objectFilter?: ObjectFilterFunc;
      countMetrics?: boolean;
      onGameLoop?: () => void;
    });

    init(container: MutableRefObject<HTMLDivElement | null>): Promise<void>;

    release(): void;

    start(): void;

    animateChecker(): void;

    applyState(state: State, tickDuration: number): void;

    set zoomLevel(value: number);

    set cameraPosition(position: Point);

    setTerrain(terrain: ObjectState[]): void;

    resize(newSize?: Size): void;

    animate(): void;

    pan(x: number, y: number): void;

    zoomTo(value: number, x: number, y: number): void;
  }

  export class World {
    constructor(options: WorldOptions);

    init(): Promise<void>;

    applyState(state: State, tickDuration: number, globalOnly: boolean): void;

    runStatePreprocessor(preprocessors: Array<Preprocessor>, preprocessorParams: PreprocessorParams);

    release(): void;

    get metrics(): Metrics;

    getWorldPosition(): Point;

    createData(options: { layer: string }): PIXI.Container;

    destroyData(container: PIXI.Container): void;

    runProcessor(processorMetadata: ProcessorMetadata, processorParams: ProcessorParams): PIXI.Container | void;

    destructProcessor(
      processorMetadata: ProcessorMetadata,
      processorParams: ProcessorParams,
      container: PIXI.Container
    ): void;

    runActions(
      actionsMeta: Array<ActionMetadata>,
      processorParams: ProcessorParams,
      container: PIXI.Container
    ): Array<Action>;

    cancelActions(actions: Array<Action>): void;

    cancelActionsForObj(container: PIXI.Container): void;

    finishActions(actions: Array<Action>): void;

    countObjects(container: PIXI.Container): number;
  }

  export class GameObject {
    rootContainer: PIXI.Container;
    constructor(id: string, objectMetadata: ObjectMetadata, world: World);

    remove(tickDuration: number): void;

    applyState(objectState: ObjectState, tickDuration: number, state: State): void;

    propsChanged(runnableMetadata: RunnableMetadata, stateParams: StateParams): boolean;

    shouldRun(
      runnableMetadata: RunnableMetadata,
      stateParams: StateParams,
      context: { propsChanged: boolean; firstRun: boolean }
    ): boolean;

    onceAllow(runnableMetadata: RunnableMetadata, context: { propsChanged: boolean; firstRun: boolean }): boolean;

    shouldDestruct(
      runnableMetadata: RunnableMetadata,
      stateParams: StateParams,
      context: { propsChanged: boolean; firstRun: boolean }
    ): boolean;

    destructProcessor(scope: Scope, processorMetadata: ProcessorMetadata, processorParams: ProcessorParams): void;

    get rendererCounter(): number;
  }

  export class ResourceManager {
    constructor(options: { logger: object; app: Application });
    load(): Promise<PIXI.loaders.ResourceDictionary>;
    getResource(name: string, ...params: any[]): Promise<PIXI.loaders.ResourceDictionary>;
    getCachedResource(name: string): void | PIXI.loaders.Resource;
    release(): void;
  }

  export type Metadata = {
    preprocessors: Array<string>;
    layers: Array<LayerMetadata>;
    objects: { [key: string]: ObjectMetadata };
  };

  export type Expression<T> =
    | undefined
    | null
    | Array<Expression<T>>
    | PredefinedExpression<T>
    | ActionMetadata
    | { [key: string]: Expression<T> }
    | T;

  export class PredefinedExpression<T> {}

  export class AddExpression extends PredefinedExpression {
    $add: [Array<Expression<number>>];
  }

  export class AndExpression extends PredefinedExpression {
    $and: [Array<Expression<boolean>>];
  }

  export class CalcExpression extends PredefinedExpression {
    $calc: string;
    default?: number;
    koef?: number;
  }

  export class DivExpression extends PredefinedExpression {
    $div: [Expression, Expression];
  }

  export class GtExpression extends PredefinedExpression {
    $gt: [Expression, Expression];
  }

  export class GteExpression extends PredefinedExpression {
    $gte: [Expression, Expression];
  }

  export class IfExpression extends PredefinedExpression {
    $if: Expression;
    then?: Expression;
    else?: Expression;
  }

  export class LtExpression extends PredefinedExpression {
    $lt: [Expression, Expression];
  }

  export class LteExpression extends PredefinedExpression {
    $lte: [Expression, Expression];
  }

  export class MinExpression extends PredefinedExpression {
    $min: [Array<Expression>];
  }

  export class MaxExpression extends PredefinedExpression {
    $max: [Array<Expression>];
  }

  export class MulExpression extends PredefinedExpression {
    $mul: [Array<Expression>];
  }

  export class NotExpression extends PredefinedExpression {
    $not: Expression;
  }

  export class OrExpression extends PredefinedExpression {
    $or: [Array<Expression>];
  }

  export class ProcessorParamExpression extends PredefinedExpression {
    $processorParam: string;
    default?: number;
    koef?: number;
  }

  export class RandomExpression extends PredefinedExpression {
    $random: number;
  }

  export class RelExpression extends PredefinedExpression {
    $rel: string;
    default?: number;
    koef?: number;
  }

  export class StateExpression extends PredefinedExpression {
    $state: string;
    default?: number;
    koef?: number;
  }

  export class SubExpression extends PredefinedExpression {
    $sub: [Array<Expression>];
  }

  export type Preprocessor = (params: PreprocessorParams) => void;
  export type Calculation = (params: CalculationParams) => any;

  export interface RunnableMetadata {
    props?: string | Array<string>;
    once?: boolean;
    /**
     * @deprecated Use when instead.
     * @param {"render-engine".StateParams} params
     * @return {boolean}
     */
    shouldRun?: (params: StateParams) => boolean | Expression;
    until?: (params: StateParams) => boolean | Expression;
    when?: (params: StateParams) => boolean | Expression;
  }

  export interface ActionMetadata extends RunnableMetadata {
    action: string;
    params: Array<Expression>;
  }

  export interface CalculationMetadata extends RunnableMetadata {
    id: string;
    func: Calculation | Expression;
  }

  export interface ProcessorMetadata<T extends ProcessorPayload> extends RunnableMetadata {
    type: string;
    id: string;
    payload?: T;
    actions?: Array<ActionMetadata>;
    layer?: string;
  }

  export interface ProcessorActionMetadata extends RunnableMetadata {
    id?: string;
    targetId?: string;
    actions?: Array<ActionMetadata>;
  }

  export interface ObjectMetadata extends RunnableMetadata {
    data?: { [key: string]: any };
    texture?: string;
    calculations?: Array<CalculationMetadata>;
    processors?: Array<ProcessorMetadata>;
    disappearProcessor?: ProcessorMetadata;
    actions?: Array<ProcessorActionMetadata>;
    zIndex?: number;
  }

  export type LayerMetadata = {
    id: string;
    isDefault?: boolean;
    afterCreate: (params: LayerParams) => Promise<void>;
  };

  export class ProcessorPayload {}

  export class CircleProcessorPayload extends DrawProcessorPayload {
    color?: number;
    radius?: number;
    stroke?: number;
    strokeWidth?: number;
  }

  export class ContainerProcessorPayload extends ObjectProcessorPayload {}

  export class CreepActionsProcessorPayload extends ProcessorPayload {
    parentId?: string;
  }

  export class CreepBuildBodyProcessorPayload extends ProcessorPayload {
    parentId?: string;
  }

  export class DrawProcessorPayload extends ObjectProcessorPayload {
    drawings?: Array<{
      method: string;
      params: Array<Expression>;
    }>;
  }

  export class MoveToProcessorPayload extends ProcessorPayload {
    targetKey?: string;
    shouldRotate?: boolean;
  }

  export class ObjectProcessorPayload extends ProcessorPayload {
    addToParent?: boolean;
    anchor?: { x: Expression; y: Expression } | Expression;
    blur?: Expression;
    Class?: Container;
    constructorParams?: Array<any>;
    id?: string;
    parentId?: string;
    pivot?: { x: Expression; y: Expression } | Expression;
    scale?: { x: Expression; y: Expression } | Expression;
    shouldCreate?: boolean;
    height?: Expression;
    width?: Expression;
    [key: string]: Expression;
  }

  export class ResourceCircleProcessorPayload extends CircleProcessorPayload {}

  export class RunActionProcessorPayload extends ProcessorPayload {
    id?: string;
  }

  export class SayProcessorPayload extends ContainerProcessorPayload {
    say: Expression;
  }

  export class SiteProgressProcessorPayload extends ProcessorPayload {
    color: Expression;
    lineWidth: Expression;
    progressTotal: Expression;
    radius: Expression;
  }

  export class SpriteProcessorPayload extends ObjectProcessorPayload {}

  export class TextProcessorPayload extends ProcessorPayload {
    style?: Expression;
    text?: Expression;
  }

  export class UserBadgeProcessorPayload extends ProcessorPayload {
    parentId?: string;
    radius?: number;
    color?: number;
  }

  export interface WorldConfigs {
    ATTACK_PENETRATION: number;
    CELL_SIZE: number;
    RENDER_SIZE: {
      width: number;
      height: number;
    };
    VIEW_BOX: number;
    BADGE_URL: string;
    metadata: Metadata;
    gameData: GameData;
    lighting: string;
    forceCanvas: boolean;
  }

  export type GameData = {
    player: string;
    showMyNames: {
      spawns: boolean;
      creeps: boolean;
    };
    showEnemyNames: {
      spawns: boolean;
      creeps: boolean;
    };
    showFlagsNames: boolean;
    showCreepSpeech: boolean;
    swampTexture: string;
  };

  export type ObjectFilterFunc = (objects: ObjectState[]) => ObjectState[];

  export type Point = {
    width: number;
    height: number;
  };

  export type Size = {
    width: number;
    height: number;
  };

  export interface PreprocessorParams {
    state: State;
    world: World;
  }

  export interface StateParams {
    calcs: { [key: string]: any };
    firstRun: boolean;
    objectMetadata: ObjectMetadata;
    prevCalcs: { [key: string]: any };
    prevState: ObjectState;
    world: World;
    rootContainer: PIXI.Container;
    scope: Scope;
    state: ObjectState;
    stateExtra: State;
    tickDuration: number;
  }

  export interface ProcessorParams extends StateParams, ProcessorMetadata {}

  export interface CalculationParams extends StateParams {
    payload?: object;
  }

  export interface LayerParams {
    app: PIXI.Application;
    resourceManager: ResourceManager;
    world: World;
  }

  export type State = {
    objects: ObjectState[];
    gameData: GameData;
  };

  export type ObjectState = {
    type: string;
    _id: string;
    room: string;
    x: number;
    y: number;
    [key: string]: any;
  };

  export type Scope = {
    processors: { [key: string]: any };
  };

  export type Metrics = {
    gameObjectCounter: number;
    rendererCounter: number;
    devicePixelRatio: number;
    renderer: {
      size: number;
      maxSvgSize: number;
    };
  };

  export class ActionManager {
    constructor();
    update(delta: number): void;
    runAction(container: PIXI.Container, action: Action): ActionHandle;
    cancelAction(actionHandle: ActionHandle): void;
    finishAction(actionHandle: ActionHandle): void;
    cancelActionForContainer(container: PIXI.Container): void;
  }

  export class Action {
    reset(): void;
    update(): boolean;
    finish(): void;
  }

  export class ActionHandle {
    container: PIXI.Container;
    action: Action;
    constructor(container: PIXI.Container, action: Action);
    update(delta: number): void;
    isEnded(): boolean;
  }
}
