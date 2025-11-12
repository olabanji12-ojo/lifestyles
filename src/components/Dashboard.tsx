// src/pages/admin/Dashboard.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Package, Sparkles, TrendingUp, LogOut } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

const revenueData = [
  { day: 'Mon', revenue: 120000 },
  { day: 'Tue', revenue: 180000 },
  { day: 'Wed', revenue: 2450000 },
  { day: 'Thu', revenue: 890000 },
  { day: 'Fri', revenue: 2100000 },
  { day: 'Sat', revenue: 3200000 },
  { day: 'Sun', revenue: 2800000 },
];

export default function AdminDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('adminAuth')) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    toast.success('Logged out safely');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* TOP BAR */}
      <div className="bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="font-serif text-3xl tracking-wider">INSPIRE ADMIN</h1>
          <button onClick={handleLogout} className="flex items-center gap-2 text-yellow-600 hover:text-white transition">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-10 h-10 text-yellow-600" />
              <span className="text-green-400 text-sm">+28%</span>
            </div>
            <p className="text-white/70 text-sm">Today's Revenue</p>
            <p className="text-3xl font-bold text-yellow-600">₦2,450,000</p>
          </div>

          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <Package className="w-10 h-10 text-yellow-600 mb-4" />
            <p className="text-white/70 text-sm">Pending Orders</p>
            <p className="text-3xl font-bold">24</p>
          </div>

          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <Sparkles className="w-10 h-10 text-yellow-600 mb-4" />
            <p className="text-white/70 text-sm">Personalization Requests</p>
            <p className="text-3xl font-bold">12</p>
          </div>

          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <ShoppingBag className="w-10 h-10 text-yellow-600 mb-4" />
            <p className="text-white/70 text-sm">Low Stock Items</p>
            <p className="text-3xl font-bold text-red-400">8</p>
          </div>
        </div>

        {/* CHART */}
        <div className="bg-white/5 rounded-lg p-6 border border-white/10 mb-12">
          <h2 className="text-2xl font-bold mb-6">Revenue This Week</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="day" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#111', border: '1px solid #444' }}
                formatter={(value: number) => `₦${value.toLocaleString()}`}
              />
              <Line type="monotone" dataKey="revenue" stroke="#EAB308" strokeWidth={4} dot={{ fill: '#EAB308' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* QUICK ACTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button className="bg-yellow-600 text-black p-8 rounded-lg hover:bg-white transition text-left">
            <h3 className="text-2xl font-bold mb-2">Add New Product</h3>
            <p className="text-black/80">Launch new items in 60 seconds</p>
          </button>
          <button className="bg-white/10 p-8 rounded-lg hover:bg-white/20 transition text-left border border-white/20">
            <h3 className="text-2xl font-bold mb-2">View Orders</h3>
            <p className="text-white/80">24 pending → pack now</p>
          </button>
          <button className="bg-white/10 p-8 rounded-lg hover:bg-white/20 transition text-left border border-white/20">
            <h3 className="text-2xl font-bold mb-2">Personalization</h3>
            <p className="text-white/80">12 new requests waiting</p>
          </button>
        </div>
      </div>
    </div>
  );
}