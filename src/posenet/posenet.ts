import { log, join } from '../helpers';
import * as tf from '../../dist/tfjs.esm.js';
import * as poses from './poses';
import * as util from './utils';

let model;
const poseNetOutputs = ['MobilenetV1/offset_2/BiasAdd'/* offsets */, 'MobilenetV1/heatmap_2/BiasAdd'/* heatmapScores */, 'MobilenetV1/displacement_fwd_2/BiasAdd'/* displacementFwd */, 'MobilenetV1/displacement_bwd_2/BiasAdd'/* displacementBwd */];

export async function predict(input, config) {
  const res = tf.tidy(() => {
    const resized = input.resizeBilinear([model.inputs[0].shape[2], model.inputs[0].shape[1]]);
    const normalized = resized.toFloat().div(127.5).sub(1.0);
    const results = model.execute(normalized, poseNetOutputs);
    const results3d = results.map((y) => y.squeeze([0]));
    results3d[1] = results3d[1].sigmoid(); // apply sigmoid on scores
    return results3d;
  });

  const buffers = await Promise.all(res.map((tensor) => tensor.buffer()));
  for (const t of res) t.dispose();

  const decoded = await poses.decode(buffers[0], buffers[1], buffers[2], buffers[3], config.body.nmsRadius, config.body.maxDetections, config.body.scoreThreshold);
  const scaled = util.scalePoses(decoded, [input.shape[1], input.shape[2]], [model.inputs[0].shape[2], model.inputs[0].shape[1]]);

  return scaled;
}

export async function load(config) {
  if (!model) {
    model = await tf.loadGraphModel(join(config.modelBasePath, config.body.modelPath));
    if (!model || !model.modelUrl) log('load model failed:', config.body.modelPath);
    else if (config.debug) log('load model:', model.modelUrl);
  } else if (config.debug) log('cached model:', model.modelUrl);
  return model;
}
