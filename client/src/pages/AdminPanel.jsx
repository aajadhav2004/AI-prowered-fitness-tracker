import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Users, Activity, Search } from 'lucide-react';
import AdminNavbar from '../components/AdminNavbar';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is admin
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
      alert('Access denied. Admin only.');
      navigate('/login');
      return;
    }
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching users with token:', token ? 'exists' : 'missing');
      
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:8080/api'}/admin/users`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      console.log('Users fetched:', response.data);
      setUsers(response.data.users);
    } catch (err) {
      console.error('Error fetching users:', err);
      console.error('Error response:', err.response);
      if (err.response?.status === 403) {
        alert('Access denied. Admin only.');
        navigate('/login');
      } else {
        alert(`Error: ${err.response?.data?.error || err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const viewWorkouts = (userId) => {
    navigate(`/admin/user/${userId}/workouts`);
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">Monitor and manage all registered users</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-blue-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-gray-700 font-semibold">Total Users</h4>
              <Users className="w-6 h-6 text-blue-500" />
            </div>
            <div className="text-4xl font-bold text-blue-600 mb-2">{users.length}</div>
            <p className="text-sm text-gray-500">registered users</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-green-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-gray-700 font-semibold">Active Today</h4>
              <Activity className="w-6 h-6 text-green-500" />
            </div>
            <div className="text-4xl font-bold text-green-600 mb-2">{users.length}</div>
            <p className="text-sm text-gray-500">active users</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-purple-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-gray-700 font-semibold">New This Month</h4>
              <Users className="w-6 h-6 text-purple-500" />
            </div>
            <div className="text-4xl font-bold text-purple-600 mb-2">
              {users.filter(u => {
                const created = new Date(u.createdAt);
                const now = new Date();
                return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
              }).length}
            </div>
            <p className="text-sm text-gray-500">new users</p>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h2 className="text-2xl font-bold text-gray-800">Registered Users</h2>
              
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                    Age
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                    Gender
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                    Goal
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                    Joined
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="ml-3 font-medium text-gray-800">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{user.age || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{user.gender || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.fitnessGoal === 'weight_loss' ? 'bg-red-100 text-red-700' :
                        user.fitnessGoal === 'weight_gain' ? 'bg-green-100 text-green-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {user.fitnessGoal?.replace('_', ' ') || 'maintain'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => viewWorkouts(user._id)}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg text-sm font-medium transition shadow-sm hover:shadow-md"
                      >
                        View Workouts
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-semibold">No users found</p>
              <p className="text-sm mt-2">Try adjusting your search</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
