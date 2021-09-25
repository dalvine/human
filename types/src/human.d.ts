/**
 * Human main module
 */
import { Config } from './config';
import type { Result } from './result';
import * as tf from '../dist/tfjs.esm.js';
import * as models from './models';
import * as facemesh from './blazeface/facemesh';
import * as env from './env';
import type { Tensor } from './tfjs/types';
import type { DrawOptions } from './draw';
export * from './config';
export * from './result';
export type { DrawOptions } from './draw';
export { env, Env } from './env';
export { Models } from './models';
/** Defines all possible input types for **Human** detection
 * @typedef Input Type
 */
export declare type Input = Tensor | ImageData | ImageBitmap | HTMLImageElement | HTMLMediaElement | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas;
/** Events dispatched by `human.events`
 *
 * - `create`: triggered when Human object is instantiated
 * - `load`: triggered when models are loaded (explicitly or on-demand)
 * - `image`: triggered when input image is processed
 * - `result`: triggered when detection is complete
 * - `warmup`: triggered when warmup is complete
 */
export declare type Events = 'create' | 'load' | 'image' | 'result' | 'warmup' | 'error';
/** Error message
 * @typedef Error Type
 */
export declare type Error = {
    error: string;
};
/** Instance of TensorFlow/JS
 * @external
 */
export declare type TensorFlow = typeof tf;
/** **Human** library main class
 *
 * All methods and properties are available only as members of Human class
 *
 * - Configuration object definition: {@link Config}
 * - Results object definition: {@link Result}
 * - Possible inputs: {@link Input}
 *
 * @param userConfig: {@link Config}
 * @return instance
 */
export declare class Human {
    #private;
    /** Current version of Human library in *semver* format */
    version: string;
    /** Current configuration
     * - Definition: {@link Config}
     * - Defaults: [config](https://github.com/vladmandic/human/blob/main/src/config.ts#L292)
     */
    config: Config;
    /** Last known result of detect run
     * - Can be accessed anytime after initial detection
     * - Definition: {@link Result}
    */
    result: Result;
    /** Current state of Human library
     * - Can be polled to determine operations that are currently executed
     * - Progresses through: 'config', 'check', 'backend', 'load', 'run:<model>', 'idle'
     */
    state: string;
    /** currenty processed image tensor and canvas */
    process: {
        tensor: Tensor | null;
        canvas: OffscreenCanvas | HTMLCanvasElement | null;
    };
    /** Instance of TensorFlow/JS used by Human
     *  - Can be embedded or externally provided
     * @internal
     *
     * [TFJS API]<https://js.tensorflow.org/api/latest/>
     */
    tf: TensorFlow;
    /** Object containing environment information used for diagnostics */
    env: env.Env;
    /** Draw helper classes that can draw detected objects on canvas using specified draw
     * - options: {@link DrawOptions} global settings for all draw operations, can be overriden for each draw method
     * - face: draw detected faces
     * - body: draw detected people and body parts
     * - hand: draw detected hands and hand parts
     * - canvas: draw processed canvas which is a processed copy of the input
     * - all: meta-function that performs: canvas, face, body, hand
     */
    draw: {
        canvas: any;
        face: any;
        body: any;
        hand: any;
        gesture: any;
        object: any;
        person: any;
        all: any;
        options: DrawOptions;
    };
    /** Currently loaded models
     * @internal
     * {@link Models}
    */
    models: models.Models;
    /** Container for events dispatched by Human
     *
     * Possible events:
     * - `create`: triggered when Human object is instantiated
     * - `load`: triggered when models are loaded (explicitly or on-demand)
     * - `image`: triggered when input image is processed
     * - `result`: triggered when detection is complete
     * - `warmup`: triggered when warmup is complete
     * - `error`: triggered on some errors
     */
    events: EventTarget;
    /** Reference face triangualtion array of 468 points, used for triangle references between points */
    faceTriangulation: typeof facemesh.triangulation;
    /** Refernce UV map of 468 values, used for 3D mapping of the face mesh */
    faceUVMap: typeof facemesh.uvmap;
    /** Performance object that contains values for all recently performed operations */
    performance: Record<string, number>;
    /** WebGL debug info */
    gl: Record<string, unknown>;
    /** Constructor for **Human** library that is futher used for all operations
     *
     * @param userConfig: {@link Config}
     *
     * @return instance: {@link Human}
     */
    constructor(userConfig?: Partial<Config>);
    /** @hidden */
    analyze: (...msg: string[]) => void;
    /** Reset configuration to default values */
    reset(): void;
    /** Validate current configuration schema */
    validate(userConfig?: Partial<Config>): {
        reason: string;
        where: string;
        expected?: string;
    }[];
    /** Process input as return canvas and tensor
     *
     * @param input: {@link Input}
     * @returns { tensor, canvas }
     */
    image(input: Input): {
        tensor: Tensor<import("@tensorflow/tfjs-core").Rank> | null;
        canvas: OffscreenCanvas | HTMLCanvasElement | null;
    };
    /** Simmilarity method calculates simmilarity between two provided face descriptors (face embeddings)
     * - Calculation is based on normalized Minkowski distance between two descriptors
     * - Default is Euclidean distance which is Minkowski distance of 2nd order
     *
     * @param embedding1: face descriptor as array of numbers
     * @param embedding2: face descriptor as array of numbers
     * @returns similarity: number
    */
    similarity(embedding1: Array<number>, embedding2: Array<number>): number;
    /** Segmentation method takes any input and returns processed canvas with body segmentation
     *  - Optional parameter background is used to fill the background with specific input
     *  - Segmentation is not triggered as part of detect process
     *
     *  Returns:
     *  - `data` as raw data array with per-pixel segmentation values
     *  - `canvas` as canvas which is input image filtered with segementation data and optionally merged with background image. canvas alpha values are set to segmentation values for easy merging
     *  - `alpha` as grayscale canvas that represents segmentation alpha values
     *
     * @param input: {@link Input}
     * @param background?: {@link Input}
     * @returns { data, canvas, alpha }
     */
    segmentation(input: Input, background?: Input): Promise<{
        data: number[];
        canvas: HTMLCanvasElement | OffscreenCanvas | null;
        alpha: HTMLCanvasElement | OffscreenCanvas | null;
    }>;
    /** Enhance method performs additional enhacements to face image previously detected for futher processing
     *
     * @param input: Tensor as provided in human.result.face[n].tensor
     * @returns Tensor
     */
    enhance(input: Tensor): Tensor | null;
    /** Math method find best match between provided face descriptor and predefined database of known descriptors
     *
     * @param faceEmbedding: face descriptor previsouly calculated on any face
     * @param db: array of mapping of face descriptors to known values
     * @param threshold: minimum score for matching to be considered in the result
     * @returns best match
     */
    match(faceEmbedding: Array<number>, db: Array<{
        name: string;
        source: string;
        embedding: number[];
    }>, threshold?: number): {
        name: string;
        source: string;
        similarity: number;
        embedding: number[];
    };
    /** Explicit backend initialization
     *  - Normally done implicitly during initial load phase
     *  - Call to explictly register and initialize TFJS backend without any other operations
     *  - Use when changing backend during runtime
     *
     * @return Promise<void>
     */
    init(): Promise<void>;
    /** Load method preloads all configured models on-demand
     * - Not explicitly required as any required model is load implicitly on it's first run
     *
     * @param userConfig?: {@link Config}
     * @return Promise<void>
    */
    load(userConfig?: Partial<Config>): Promise<void>;
    /** @hidden */
    emit: (event: string) => boolean;
    /** Runs interpolation using last known result and returns smoothened result
     * Interpolation is based on time since last known result so can be called independently
     *
     * @param result?: {@link Result} optional use specific result set to run interpolation on
     * @returns result: {@link Result}
     */
    next(result?: Result): Result;
    /** Warmup method pre-initializes all configured models for faster inference
     * - can take significant time on startup
     * - only used for `webgl` and `humangl` backends
     * @param userConfig?: {@link Config}
     * @returns result: {@link Result}
    */
    warmup(userConfig?: Partial<Config>): Promise<Result | {
        error: any;
    }>;
    /** Main detection method
     * - Analyze configuration: {@link Config}
     * - Pre-process input: {@link Input}
     * - Run inference for all configured models
     * - Process and return result: {@link Result}
     *
     * @param input: {@link Input}
     * @param userConfig?: {@link Config}
     * @returns result: {@link Result}
    */
    detect(input: Input, userConfig?: Partial<Config>): Promise<Result | Error>;
}
/** Class Human as default export */
export { Human as default };
//# sourceMappingURL=human.d.ts.map