import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Dumbbell } from 'lucide-react';
import AdminNavbar from '../components/AdminNavbar';
import { toTitleCase } from '../utils/textUtils';

const UserWorkouts = () => {
  const [user, setUser] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { userId } = useParams();

  useEffect(() => {
    // Check if user is admin
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
      alert('Access denied. Admin only.');
      navigate('/login');
      return;
    }
    fetchUserWorkouts();
  }, [userId]);

  const fetchUserWorkouts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:8080/api'}/admin/users/${userId}/workouts`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setUser(response.data.user);
      setWorkouts(response.data.workouts);
    } catch (err) {
      console.error('Error fetching user workouts:', err);
      if (err.response?.status === 403) {
        alert('Access denied. Admin only.');
        navigate('/admin');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-gray-800 text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <AdminNavbar />

      <div className="max-w-7xl mx-auto p-6">
        {/* Back Button */}
        <button
          onClick={() => navigate('/admin')}
          className="mb-4 flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-100 text-gray-700 rounded-lg transition font-medium shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            User Workout History
          </h1>
          <p className="text-gray-600">{user?.name} ({user?.email})</p>
        </div>

        {/* Workouts Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">
                Workout History
              </h2>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Workouts</p>
                <p className="text-3xl font-bold text-blue-600">{workouts.length}</p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                    Workout Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                    Duration
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                    Sets
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                    Reps
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                    Calories
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {workouts.map((workout) => (
                  <tr key={workout._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {new Date(workout.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">{workout.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        {toTitleCase(workout.category)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{workout.duration} min</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{workout.sets || 0}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{workout.reps || 0}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                        {Math.round(workout.calories)} cal
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {workouts.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              <Dumbbell className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-semibold">No workouts found</p>
              <p className="text-sm mt-2">This user hasn't logged any workouts yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserWorkouts;
