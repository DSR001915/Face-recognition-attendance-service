import { useState, useEffect } from 'react';
import WebcamCapture from '../components/WebcamCapture';
import { getUsers, markAttendance } from '../services/db';
import { loadModels, detectFace, createMatcher } from '../services/face';
import * as faceapi from 'face-api.js';

const Attendance = () => {
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [status, setStatus] = useState('');
  const [matcher, setMatcher] = useState<faceapi.FaceMatcher | null>(null);

  useEffect(() => {
    const init = async () => {
      setStatus('Loading models...');
      await loadModels();
      setModelsLoaded(true);

      const users = getUsers() as any[];
      const labeledDescriptors = users
        .filter((u: any) => u.descriptors)
        .map((u: any) => {
          const descriptors = JSON.parse(u.descriptors);
          const float32 = new Float32Array(descriptors);
          return new faceapi.LabeledFaceDescriptors(u.name, [float32]);
        });
      
      if (labeledDescriptors.length > 0) {
        const faceMatcher = createMatcher(labeledDescriptors);
        setMatcher(faceMatcher);
        setStatus('Models loaded. Ready to scan.');
      } else {
        setStatus('No users registered. Please register first.');
      }
    };
    init();
  }, []);

  const handleCapture = async (imageSrc: string) => {
    if (!modelsLoaded || !matcher) return;

    setStatus('Processing...');

    try {
      const img = document.createElement('img');
      img.src = imageSrc;
      await new Promise((resolve) => { img.onload = resolve; });

      const detection = await detectFace(img);

      if (!detection) {
        setStatus('No face detected. Please try again.');
        return;
      }

      const match = matcher.findBestMatch(detection.descriptor);

      if (match.label !== 'unknown') {
        const user = (getUsers() as any[]).find((u: any) => u.name === match.label);
        if (user) {
          const result = markAttendance(user.id, user.name);
          setStatus(`${result.success ? 'Success' : 'Info'}: ${result.message} (${match.label})`);
        }
      } else {
        setStatus('Face not recognized. Please register first.');
      }
    } catch (error) {
      console.error(error);
      setStatus('Error processing attendance.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Mark Attendance</h2>
      
      <div className="space-y-4">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Please ensure good lighting and look directly at the camera.
              </p>
            </div>
          </div>
        </div>

        <WebcamCapture onCapture={handleCapture} label="Scan Face" />

        {status && (
          <div className={`p-4 rounded-md mt-4 text-center font-semibold text-lg ${status.includes('Success') ? 'bg-green-100 text-green-800' : status.includes('Error') || status.includes('not recognized') || status.includes('No face') ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
            {status}
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendance;
