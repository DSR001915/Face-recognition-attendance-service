import { useState, useEffect } from 'react';
import WebcamCapture from '../components/WebcamCapture';
import { addUser } from '../services/db';
import { loadModels, detectFace } from '../services/face';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [role, setRole] = useState('Student');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const init = async () => {
      setStatus('Loading models...');
      await loadModels();
      setModelsLoaded(true);
      setStatus('');
    };
    init();
  }, []);

  const handleCapture = (imageSrc: string) => {
    setImage(imageSrc);
  };

  const handleRegister = async () => {
    if (!name || !image || !modelsLoaded) {
      alert("Please provide name and capture a photo.");
      return;
    }

    setLoading(true);
    setStatus('Processing face...');

    try {
      // Create an image element from the base64 string
      const img = document.createElement('img');
      img.src = image;
      await new Promise((resolve) => { img.onload = resolve; });

      const detection = await detectFace(img);

      if (!detection) {
        setStatus('No face detected. Please try again.');
        setLoading(false);
        return;
      }

      setStatus('Face detected. Saving...');
      const descriptor = detection.descriptor;
      
      const result = addUser(name, role, descriptor);
      if (result.success) {
        alert("User registered successfully!");
        navigate('/');
      } else {
        setStatus('Error saving to database.');
      }
    } catch (error) {
      console.error(error);
      setStatus('Error processing registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Register New User</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
            placeholder="Enter full name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
          >
            <option value="Student">Student</option>
            <option value="Teacher">Teacher</option>
            <option value="Staff">Staff</option>
          </select>
        </div>

        <div className="border-t pt-4">
          <p className="text-sm text-gray-600 mb-2">Capture Photo for Face Recognition</p>
          <WebcamCapture onCapture={handleCapture} />
        </div>

        {status && (
          <div className={`p-4 rounded-md ${status.includes('Error') || status.includes('No face') ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}`}>
            {status}
          </div>
        )}

        <button
          onClick={handleRegister}
          disabled={loading || !modelsLoaded || !image}
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
            ${loading || !modelsLoaded || !image ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'}
          `}
        >
          {loading ? 'Processing...' : 'Register User'}
        </button>
      </div>
    </div>
  );
};

export default Register;
