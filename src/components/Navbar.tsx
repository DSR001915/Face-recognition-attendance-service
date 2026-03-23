import { Link } from 'react-router-dom';
import { Camera, Database, UserPlus, Home } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 text-xl font-bold">
            <Camera className="w-8 h-8" />
            <span>FaceAttend</span>
          </Link>
          
          <div className="flex space-x-4">
            <Link to="/" className="flex items-center space-x-1 hover:text-blue-200 transition">
              <Home className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
            <Link to="/attendance" className="flex items-center space-x-1 hover:text-blue-200 transition">
              <Camera className="w-4 h-4" />
              <span>Mark Attendance</span>
            </Link>
            <Link to="/register" className="flex items-center space-x-1 hover:text-blue-200 transition">
              <UserPlus className="w-4 h-4" />
              <span>Register</span>
            </Link>
            <Link to="/sql-view" className="flex items-center space-x-1 hover:text-blue-200 transition">
              <Database className="w-4 h-4" />
              <span>SQL View</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
