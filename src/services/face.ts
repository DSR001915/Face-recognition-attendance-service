import * as faceapi from 'face-api.js';

// Load models from a public CDN
const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/models';

export const loadModels = async () => {
  try {
    await Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
    ]);
    return true;
  } catch (error) {
    console.error("Error loading models:", error);
    return false;
  }
};

export const detectFace = async (imageElement: HTMLImageElement | HTMLVideoElement) => {
  const detections = await faceapi.detectSingleFace(imageElement).withFaceLandmarks().withFaceDescriptor();
  return detections;
};

export const createMatcher = (labeledDescriptors: faceapi.LabeledFaceDescriptors[]) => {
  return new faceapi.FaceMatcher(labeledDescriptors, 0.6);
};
