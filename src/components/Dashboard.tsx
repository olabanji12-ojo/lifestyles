// src/pages/admin/Dashboard.tsx
import { useEffect, useState } from 'react';
import { ShoppingBag, Package, Sparkles, TrendingUp, LogOut, Loader2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useNavigate } from 'react-router-dom';
import { getDashboardStats, getOrders, Order } from '../firebase/helpers';

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    todayRevenue: 0,
    pendingOrders: 0,
    newRequests: 0,
    lowStockItems: 0,
  });
  const [revenueData, setRevenueData] = useState<Array<{ day: string; revenue: number }>>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    
    // Fetch stats
    const statsResult = await getDashboardStats();
    if (statsResult.success && statsResult.stats) {
      setStats(statsResult.stats);
    }

    // Fetch last 7 days revenue for chart
    const ordersResult = await getOrders();
    if (ordersResult.success) {
      const last7Days = getLast7DaysRevenue(ordersResult.orders);
      setRevenueData(last7Days);
    }

    setLoading(false);
  };

  const getLast7DaysRevenue = (orders: Order[]) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const last7Days: Array<{ day: string; revenue: number }> = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dayRevenue = orders
        .filter(order => {
          const orderDate = order.createdAt?.toDate?.();
          return orderDate && orderDate >= date && orderDate < nextDate;
        })
        .reduce((sum, order) => sum + order.total, 0);

      last7Days.push({
        day: days[date.getDay()],
        revenue: dayRevenue,
      });
    }

    return last7Days;
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out safely');
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-yellow-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* TOP BAR */}
      <div className="bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="font-serif text-3xl tracking-wider">INSPIRE ADMIN</h1>
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-2 text-yellow-600 hover:text-white transition"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/5 rounded-lg p-6 border border-white/10 hover:border-yellow-600 transition cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-10 h-10 text-yellow-600" />
              {stats.todayRevenue > 0 && (
                <span className="text-green-400 text-sm">Active</span>
              )}
            </div>
            <p className="text-white/70 text-sm">Today's Revenue</p>
            <p className="text-3xl font-bold text-yellow-600">
              ₦{stats.todayRevenue.toLocaleString()}
            </p>
          </div>

          <div 
            onClick={() => navigate('/adminorders')}
            className="bg-white/5 rounded-lg p-6 border border-white/10 hover:border-yellow-600 transition cursor-pointer"
          >
            <Package className="w-10 h-10 text-yellow-600 mb-4" />
            <p className="text-white/70 text-sm">Pending Orders</p>
            <p className="text-3xl font-bold">{stats.pendingOrders}</p>
            {stats.pendingOrders > 0 && (
              <p className="text-xs text-yellow-600 mt-2">→ View Orders</p>
            )}
          </div>

          <div 
            onClick={() => navigate('/adminrequests')}
            className="bg-white/5 rounded-lg p-6 border border-white/10 hover:border-yellow-600 transition cursor-pointer"
          >
            <Sparkles className="w-10 h-10 text-yellow-600 mb-4" />
            <p className="text-white/70 text-sm">Personalization Requests</p>
            <p className="text-3xl font-bold">{stats.newRequests}</p>
            {stats.newRequests > 0 && (
              <p className="text-xs text-yellow-600 mt-2">→ View Requests</p>
            )}
          </div>

          <div 
            onClick={() => navigate('/adminproducts')}
            className="bg-white/5 rounded-lg p-6 border border-white/10 hover:border-yellow-600 transition cursor-pointer"
          >
            <ShoppingBag className="w-10 h-10 text-yellow-600 mb-4" />
            <p className="text-white/70 text-sm">Low Stock Items</p>
            <p className={`text-3xl font-bold ${stats.lowStockItems > 0 ? 'text-red-400' : 'text-green-400'}`}>
              {stats.lowStockItems}
            </p>
            {stats.lowStockItems > 0 && (
              <p className="text-xs text-red-400 mt-2">⚠ Restock needed</p>
            )}
          </div>
        </div>

        {/* CHART */}
        <div className="bg-white/5 rounded-lg p-6 border border-white/10 mb-12">
          <h2 className="text-2xl font-bold mb-6">Revenue Last 7 Days</h2>
          {revenueData.every(d => d.revenue === 0) ? (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              <p>No sales data yet. Start by adding products and taking orders!</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="day" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', border: '1px solid #444' }}
                  formatter={(value: number) => `₦${value.toLocaleString()}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#EAB308" 
                  strokeWidth={4} 
                  dot={{ fill: '#EAB308', r: 6 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* QUICK ACTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button 
            onClick={() => navigate('/adminproducts')}
            className="bg-yellow-600 text-black p-8 rounded-lg hover:bg-white transition text-left group"
          >
            <ShoppingBag className="w-10 h-10 mb-4 group-hover:scale-110 transition" />
            <h3 className="text-2xl font-bold mb-2">Add New Product</h3>
            <p className="text-black/80">Launch new items in 60 seconds</p>
          </button>
          
          <button 
            onClick={() => navigate('/adminorders')}
            className="bg-white/10 p-8 rounded-lg hover:bg-white/20 transition text-left border border-white/20 group"
          >
            <Package className="w-10 h-10 mb-4 group-hover:scale-110 transition text-yellow-600" />
            <h3 className="text-2xl font-bold mb-2">View Orders</h3>
            <p className="text-white/80">
              {stats.pendingOrders > 0 
                ? `${stats.pendingOrders} pending → pack now` 
                : 'All orders managed ✓'}
            </p>
          </button>
          
          <button 
            onClick={() => navigate('/adminrequests')}
            className="bg-white/10 p-8 rounded-lg hover:bg-white/20 transition text-left border border-white/20 group"
          >
            <Sparkles className="w-10 h-10 mb-4 group-hover:scale-110 transition text-yellow-600" />
            <h3 className="text-2xl font-bold mb-2">Personalization</h3>
            <p className="text-white/80">
              {stats.newRequests > 0 
                ? `${stats.newRequests} new requests waiting` 
                : 'All requests handled ✓'}
            </p>
          </button>
        </div>

        {/* Welcome Message for Empty Dashboard */}
        {stats.pendingOrders === 0 && stats.newRequests === 0 && stats.lowStockItems === 0 && (
          <div className="mt-12 text-center bg-white/5 border border-white/10 rounded-lg p-12">
            <h3 className="text-2xl font-bold mb-4">🎉 Welcome to INSPIRE Admin!</h3>
            <p className="text-gray-400 mb-6">
              Your dashboard is ready. Start by adding products to your store.
            </p>
            <button 
              onClick={() => navigate('/adminproducts')}
              className="bg-yellow-600 text-black px-8 py-4 rounded-full font-bold hover:bg-yellow-500 transition"
            >
              Add Your First Product
            </button>
          </div>
        )}
      </div>
    </div>
  );
}