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
      <div className="min-h-screen bg-cream-100 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-gold-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-100 text-gray-900 font-sans-serif">
      {/* TOP BAR */}
      <div className="bg-white border-b border-gray-200/50 sticky top-0 z-30 shadow-soft">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-6 flex justify-between items-center">
          <div className="flex flex-col">
            <h1 className="font-serif text-3xl tracking-tight text-gray-900 leading-none">Admin Dashboard</h1>
            <span className="text-[10px] tracking-[0.4em] text-gold-600 uppercase font-bold mt-2">Management Console</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-400 hover:text-gray-900 transition text-xs tracking-widest font-bold uppercase"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-12">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Revenue Card */}
          <div className="bg-white p-8 border border-gray-100 shadow-soft hover:shadow-premium transition-all">
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 bg-gold-50 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-gold-600" />
              </div>
              {stats.todayRevenue > 0 && (
                <span className="text-green-500 text-[10px] font-bold tracking-widest uppercase bg-green-50 px-2 py-1">Active</span>
              )}
            </div>
            <p className="text-gray-400 text-[10px] tracking-[0.2em] uppercase font-bold mb-1">Today's Revenue</p>
            <p className="text-4xl font-serif text-gray-900">
              ₦{stats.todayRevenue.toLocaleString()}
            </p>
          </div>

          {/* Pending Orders Card */}
          <div
            onClick={() => navigate('/adminorders')}
            className="bg-white p-8 border border-gray-100 shadow-soft hover:shadow-premium transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 bg-gray-50 flex items-center justify-center mb-6 group-hover:bg-gold-50 transition-colors">
              <Package className="w-6 h-6 text-gray-400 group-hover:text-gold-600 transition-colors" />
            </div>
            <p className="text-gray-400 text-[10px] tracking-[0.2em] uppercase font-bold mb-1">Pending Orders</p>
            <p className="text-4xl font-serif text-gray-900">{stats.pendingOrders}</p>
            {stats.pendingOrders > 0 && (
              <p className="text-[10px] text-gold-600 mt-4 tracking-widest font-bold italic">→ VIEW ORDERS</p>
            )}
          </div>

          {/* Request Card */}
          <div
            onClick={() => navigate('/adminrequests')}
            className="bg-white p-8 border border-gray-100 shadow-soft hover:shadow-premium transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 bg-gray-50 flex items-center justify-center mb-6 group-hover:bg-gold-50 transition-colors">
              <Sparkles className="w-6 h-6 text-gray-400 group-hover:text-gold-600 transition-colors" />
            </div>
            <p className="text-gray-400 text-[10px] tracking-[0.2em] uppercase font-bold mb-1">New Requests</p>
            <p className="text-4xl font-serif text-gray-900">{stats.newRequests}</p>
            {stats.newRequests > 0 && (
              <p className="text-[10px] text-gold-600 mt-4 tracking-widest font-bold italic">→ VIEW REQUESTS</p>
            )}
          </div>

          {/* Low Stock Card */}
          <div
            onClick={() => navigate('/adminproducts')}
            className="bg-white p-8 border border-gray-100 shadow-soft hover:shadow-premium transition-all cursor-pointer group"
          >
            <div className={`w-12 h-12 flex items-center justify-center mb-6 ${stats.lowStockItems > 0 ? 'bg-red-50' : 'bg-green-50'}`}>
              <ShoppingBag className={`w-6 h-6 ${stats.lowStockItems > 0 ? 'text-red-500' : 'text-green-500'}`} />
            </div>
            <p className="text-gray-400 text-[10px] tracking-[0.2em] uppercase font-bold mb-1">Low Stock Items</p>
            <p className={`text-4xl font-serif ${stats.lowStockItems > 0 ? 'text-red-500' : 'text-gray-900'}`}>
              {stats.lowStockItems}
            </p>
            {stats.lowStockItems > 0 && (
              <p className="text-[10px] text-red-500 mt-4 tracking-widest font-bold italic">⚠ RESTOCK NEEDED</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Revenue Chart - Wide */}
          <div className="lg:col-span-8 bg-white p-10 border border-gray-100 shadow-soft">
            <div className="flex justify-between items-center mb-10">
              <div className="space-y-1">
                <h2 className="text-2xl font-serif text-gray-900 tracking-tight">Sales Analytics</h2>
                <p className="text-xs text-gray-400 uppercase tracking-widest">Revenue Performance (7 Days)</p>
              </div>
            </div>

            {revenueData.every(d => d.revenue === 0) ? (
              <div className="h-[400px] flex items-center justify-center text-gray-300 italic font-serif">
                <p>Awaiting your first store interactions...</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#999', fontSize: 11, fontWeight: 600 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#999', fontSize: 11, fontWeight: 600 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(5px)',
                      border: 'none',
                      boxShadow: '0 10px 30px -5px rgba(0,0,0,0.1)',
                      borderRadius: '0px'
                    }}
                    labelStyle={{ fontFamily: 'Playfair Display', fontWeight: 'bold', color: '#111' }}
                    formatter={(value: number) => [`₦${value.toLocaleString()}`, "Revenue"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#D4AF37"
                    strokeWidth={4}
                    dot={{ fill: '#D4AF37', r: 6, strokeWidth: 0 }}
                    activeDot={{ r: 8, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Quick Actions - Sidebar style */}
          <div className="lg:col-span-4 space-y-6">
            <h3 className="text-xs tracking-[0.3em] font-bold text-gray-400 uppercase mb-4 px-2">Quick Actions</h3>

            <button
              onClick={() => navigate('/adminproducts')}
              className="w-full bg-gray-900 text-white p-8 text-left hover:bg-gold-600 transition-all shadow-soft group"
            >
              <ShoppingBag className="w-8 h-8 mb-6 text-gold-400 group-hover:scale-110 transition-transform" />
              <h4 className="text-xl font-serif mb-2">Inventory</h4>
              <p className="text-xs text-gray-400 font-sans-serif leading-relaxed">Add new pieces or restock collections.</p>
            </button>

            <button
              onClick={() => navigate('/adminorders')}
              className="w-full bg-white p-8 text-left border border-gray-100 hover:border-gold-200 transition-all shadow-soft group"
            >
              <Package className="w-8 h-8 mb-6 text-gold-600 group-hover:scale-110 transition-transform" />
              <h4 className="text-xl font-serif mb-2 text-gray-900">Orders Flow</h4>
              <p className="text-xs text-gray-500 font-sans-serif leading-relaxed">
                {stats.pendingOrders > 0
                  ? `Maintain momentum: ${stats.pendingOrders} pending.`
                  : 'Your fulfillment queue is clear.'}
              </p>
            </button>

            <button
              onClick={() => navigate('/adminrequests')}
              className="w-full bg-white p-8 text-left border border-gray-100 hover:border-gold-200 transition-all shadow-soft group"
            >
              <Sparkles className="w-8 h-8 mb-6 text-gold-600 group-hover:scale-110 transition-transform" />
              <h4 className="text-xl font-serif mb-2 text-gray-900">Crafting Inquiries</h4>
              <p className="text-xs text-gray-500 font-sans-serif leading-relaxed">Review personalization details from clients.</p>
            </button>
          </div>
        </div>

        {/* Empty State Welcome */}
        {stats.pendingOrders === 0 && stats.newRequests === 0 && stats.lowStockItems === 0 && (
          <div className="mt-20 text-center py-20 bg-white border border-gray-50 shadow-soft">
            <h3 className="text-4xl font-serif text-gray-900 mb-6 tracking-tight">Elegance in Every Detail.</h3>
            <p className="text-gray-400 max-w-sm mx-auto mb-10 font-sans-serif text-sm leading-relaxed">
              Your dashboard is looking tranquil. This is a perfect moment to curate your next collection.
            </p>
            <button
              onClick={() => navigate('/adminproducts')}
              className="px-10 py-5 bg-gray-900 text-white text-[10px] tracking-[0.3em] font-bold uppercase hover:bg-gold-600 transition-all shadow-premium"
            >
              Create New Product
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
