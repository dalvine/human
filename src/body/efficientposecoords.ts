export const kpt = [
  'head',
  'neck',
  'rightShoulder',
  'rightElbow',
  'rightWrist',
  'chest',
  'leftShoulder',
  'leftElbow',
  'leftWrist',
  'bodyCenter',
  'rightHip',
  'rightKnee',
  'rightAnkle',
  'leftHip',
  'leftKnee',
  'leftAnkle',
];

export const connected = {
  leftLeg: ['leftHip', 'leftKnee', 'leftAnkle'],
  rightLeg: ['rightHip', 'rightKnee', 'rightAnkle'],
  torso: ['leftShoulder', 'rightShoulder', 'rightHip', 'leftHip', 'leftShoulder'],
  leftArm: ['leftShoulder', 'leftElbow', 'leftWrist'],
  rightArm: ['rightShoulder', 'rightElbow', 'rightWrist'],
  head: [],
};
