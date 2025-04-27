// livenessConstants.js

export const LivenessSteps = {
  NEUTRAL: 'neutral',
  BLINK: 'blink',
  SMILE: 'smile',
  TURN_LEFT: 'turnLeft',
  TURN_RIGHT: 'turnRight'
};

export const LivenessInstructions = {
  [LivenessSteps.NEUTRAL]: 'Look straight at the camera',
  [LivenessSteps.BLINK]: 'Blink your eyes naturally',
  [LivenessSteps.SMILE]: 'Smile naturally',
  [LivenessSteps.TURN_LEFT]: 'Slowly turn your head to the left',
  [LivenessSteps.TURN_RIGHT]: 'Slowly turn your head to the right'
};
