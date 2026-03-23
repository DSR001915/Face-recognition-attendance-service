import { useEffect, useState } from 'react';
import { getAttendance, getUsers } from '../services/db';
import { UserCheck, Users, Clock } from 'lucide-react';

const Home = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAttendance: 0,
    todayAttendance: 0
  });

  useEffect(() => {
    const users = getUsers() as any[];
    const attendance = getAttendance() as any[];
    const today = new Date().toISOString().split('T')[0];
    const todayCount = attendance.filter((a: any) => new Date(a.timestamp).toISOString().split('T')[0] === today).length;

    setStats({
      totalUsers: users.length,
      totalAttendance: attendance.length,
      todayAttendance: todayCount
    });
  }, []);

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">Total Registered Users</p>
            <p className="text-3xl font-bold text-gray-800">{stats.totalUsers}</p>
          </div>
          <Users className="w-10 h-10 text-blue-500 opacity-20" />
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">Today's Attendance</p>
            <p className="text-3xl font-bold text-gray-800">{stats.todayAttendance}</p>
          </div>
          <UserCheck className="w-10 h-10 text-green-500 opacity-20" />
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">Total Attendance Records</p>
            <p className="text-3xl font-bold text-gray-800">{stats.totalAttendance}</p>
          </div>
          <Clock className="w-10 h-10 text-purple-500 opacity-20" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Quick Actions</h2>
        <div className="flex space-x-4">
          <a href="/attendance" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">Mark Attendance</a>
          <a href="/register" className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition">Register New User</a>
        </div>
      </div>
    </div>
  );
};

export default Home;
