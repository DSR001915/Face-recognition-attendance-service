import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera } from 'lucide-react';

interface WebcamCaptureProps {
  onCapture: (imageSrc: string) => void;
  label?: string;
}

const WebcamCapture: React.FC<WebcamCaptureProps> = ({ onCapture, label = "Capture Photo" }) => {
  const webcamRef = useRef<Webcam>(null);
  const [image, setImage] = useState<string | null>(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImage(imageSrc);
      onCapture(imageSrc);
    }
  }, [webcamRef, onCapture]);

  const retake = () => {
    setImage(null);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative border-4 border-gray-200 rounded-lg overflow-hidden shadow-lg bg-black">
        {image ? (
          <img src={image} alt="Captured" className="w-full max-w-md h-auto" />
        ) : (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="w-full max-w-md h-auto"
            videoConstraints={{
              facingMode: "user"
            }}
          />
        )}
      </div>
      
      <div className="flex space-x-4">
        {!image ? (
          <button
            onClick={capture}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
          >
            <Camera className="w-5 h-5" />
            <span>{label}</span>
          </button>
        ) : (
          <button
            onClick={retake}
            className="flex items-center space-x-2 bg-gray-600 text-white px-6 py-2 rounded-full hover:bg-gray-700 transition"
          >
            <span>Retake</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default WebcamCapture;
