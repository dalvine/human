/**
 * Result interface definition for **Human** library
 *
 * Contains all possible detection results
 */
/** Face results
 * Combined results of face detector, face mesh, age, gender, emotion, embedding, iris models
 * Some values may be null if specific model is not enabled
 *
 * Array of individual results with one object per detected face
 * Each result has:
 * - overal detection confidence value
 * - box detection confidence value
 * - mesh detection confidence value
 * - box as array of [x, y, width, height], normalized to image resolution
 * - boxRaw as array of [x, y, width, height], normalized to range 0..1
 * - mesh as array of [x, y, z] points of face mesh, normalized to image resolution
 * - meshRaw as array of [x, y, z] points of face mesh, normalized to range 0..1
 * - annotations as array of annotated face mesh points
 * - age as value
 * - gender as value
 * - genderConfidence as value
 * - emotion as array of possible emotions with their individual scores
 * - iris as distance value
 * - angle as object with values for roll, yaw and pitch angles
 * - tensor as Tensor object which contains detected face
 */
export interface Face {
    confidence: number;
    boxConfidence: number;
    faceConfidence: number;
    box: [number, number, number, number];
    boxRaw: [number, number, number, number];
    mesh: Array<[number, number, number]>;
    meshRaw: Array<[number, number, number]>;
    annotations: Array<{
        part: string;
        points: Array<[number, number, number]>[];
    }>;
    age: number;
    gender: string;
    genderConfidence: number;
    emotion: Array<{
        score: number;
        emotion: string;
    }>;
    embedding: Array<number>;
    iris: number;
    rotation: {
        angle: {
            roll: number;
            yaw: number;
            pitch: number;
        };
        matrix: Array<[number, number, number, number, number, number, number, number, number]>;
    };
    tensor: any;
}
/** Body results
 *
 * Array of individual results with one object per detected body
 * Each results has:
 * - body id number
 * - score: overall detection score
 * - box bounding box: x, y, width, height
 * - keypoints: array of keypoints
 *  - part: body part name
 *  - position: body part position with x,y,z coordinates
 *  - score: body part score value
 *  - presence: body part presence value
 */
export interface Body {
    id: number;
    box: [x: number, y: number, width: number, height: number];
    score: number;
    keypoints: Array<{
        part: string;
        position: {
            x: number;
            y: number;
            z: number;
        };
        score: number;
        presence: number;
    }>;
}
/** Hand results
 *
 * Array of individual results with one object per detected hand
 * Each result has:
 * - confidence as value
 * - box as array of [x, y, width, height], normalized to image resolution
 * - boxRaw as array of [x, y, width, height], normalized to range 0..1
 * - landmarks as array of [x, y, z] points of hand, normalized to image resolution
 * - annotations as array of annotated face landmark points
 */
export interface Hand {
    confidence: number;
    box: [number, number, number, number];
    boxRaw: [number, number, number, number];
    landmarks: Array<[number, number, number]>;
    annotations: Array<{
        part: string;
        points: Array<[number, number, number]>[];
    }>;
}
/** Object results
*
* Array of individual results with one object per detected gesture
* Each result has:
* - score as value
* - label as detected class name
* - center as array of [x, y], normalized to image resolution
* - centerRaw as array of [x, y], normalized to range 0..1
* - box as array of [x, y, width, height], normalized to image resolution
* - boxRaw as array of [x, y, width, height], normalized to range 0..1
*/
export interface Object {
    score: number;
    strideSize: number;
    class: number;
    label: string;
    center: number[];
    centerRaw: number[];
    box: number[];
    boxRaw: number[];
}
/** Gesture results
 *
 * Array of individual results with one object per detected gesture
 * Each result has:
 * - part: part name and number where gesture was detected: face, iris, body, hand
 * - gesture: gesture detected
 */
export declare type Gesture = {
    'face': number;
    gesture: string;
} | {
    'iris': number;
    gesture: string;
} | {
    'body': number;
    gesture: string;
} | {
    'hand': number;
    gesture: string;
};
export interface Result {
    /** {@link Face}: detection & analysis results */
    face: Array<Face>;
    /** {@link Body}: detection & analysis results */
    body: Array<Body>;
    /** {@link Hand}: detection & analysis results */
    hand: Array<Hand>;
    /** {@link Gesture}: detection & analysis results */
    gesture: Array<Gesture>;
    /** {@link Object}: detection & analysis results */
    object: Array<Object>;
    performance: {
        any: any;
    };
    canvas: OffscreenCanvas | HTMLCanvasElement;
}
