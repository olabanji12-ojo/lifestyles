// src/pages/admin/AdminOrders.tsx
import { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle, Eye, Loader2, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import { getOrders, updateOrderStatus, Order } from '../firebase/helpers';

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const statusColors: Record<Order['status'], string> = {
    Pending: 'bg-yellow-500/20 text-yellow-400',
    Packed: 'bg-blue-500/20 text-blue-400',
    Shipped: 'bg-purple-500/20 text-purple-400',
    Delivered: 'bg-green-500/20 text-green-400',
    Cancelled: 'bg-red-500/20 text-red-400',
  };

  const statusIcons: Record<Order['status'], JSX.Element> = {
    Pending: <Package className="w-5 h-5" />,
    Packed: <Package className="w-5 h-5" />,
    Shipped: <Truck className="w-5 h-5" />,
    Delivered: <CheckCircle className="w-5 h-5" />,
    Cancelled: <CheckCircle className="w-5 h-5" />,
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const result = await getOrders();
    if (result.success) {
      setOrders(result.orders);
    } else {
      toast.error('Failed to load orders');
    }
    setLoading(false);
  };

  const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
    setUpdatingStatus(true);
    const result = await updateOrderStatus(orderId, newStatus);
    if (result.success) {
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders(); // Refresh orders
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } else {
      toast.error('Failed to update status');
    }
    setUpdatingStatus(false);
  };

  const openDetailModal = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedOrder(null);
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Get next status
  const getNextStatus = (currentStatus: Order['status']): Order['status'] | null => {
    const statusFlow: Record<Order['status'], Order['status'] | null> = {
      Pending: 'Packed',
      Packed: 'Shipped',
      Shipped: 'Delivered',
      Delivered: null,
      Cancelled: null,
    };
    return statusFlow[currentStatus];
  };

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif mb-2">Orders Management</h1>
          <p className="text-gray-400">Track and manage all customer orders</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search by order ID, customer name, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-600"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-6 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-600"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Packed">Packed</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {(['Pending', 'Packed', 'Shipped', 'Delivered'] as Order['status'][]).map(status => (
            <div key={status} className="bg-white/5 border border-white/10 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">{status}</p>
              <p className="text-2xl font-bold">{orders.filter(o => o.status === status).length}</p>
            </div>
          ))}
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-12 h-12 animate-spin text-yellow-600" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-16 h-16 mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400">No orders found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map(order => {
              const nextStatus = getNextStatus(order.status);
              return (
                <div 
                  key={order.id} 
                  className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition"
                >
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <div className={`p-2 rounded-lg ${statusColors[order.status]}`}>
                          {statusIcons[order.status]}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">{order.orderId}</h3>
                          <p className="text-sm text-gray-400">
                            {order.createdAt?.toDate?.().toLocaleDateString() || 'N/A'}
                          </p>
                        </div>
                        <span className={`px-4 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
                          {order.status}
                        </span>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400">Customer</p>
                          <p className="font-medium">{order.customerName}</p>
                          <p className="text-gray-400 text-xs">{order.customerEmail}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Total Amount</p>
                          <p className="text-2xl font-bold text-yellow-600">₦{order.total.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button 
                        onClick={() => openDetailModal(order)}
                        className="px-6 py-3 border border-white/20 rounded-full hover:border-yellow-600 hover:text-yellow-600 transition flex items-center gap-2"
                      >
                        <Eye className="w-5 h-5" /> View Details
                      </button>
                      {nextStatus && (
                        <button 
                          onClick={() => handleStatusUpdate(order.id!, nextStatus)}
                          disabled={updatingStatus}
                          className="px-6 py-3 bg-yellow-600 text-black rounded-full hover:bg-yellow-500 transition flex items-center gap-2 disabled:opacity-50"
                        >
                          {updatingStatus ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <Truck className="w-5 h-5" />
                          )}
                          Mark as {nextStatus}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Order Detail Modal */}
        {showDetailModal && selectedOrder && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-gray-900 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gray-900 border-b border-white/10 px-8 py-6 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">{selectedOrder.orderId}</h2>
                  <p className="text-sm text-gray-400">
                    Ordered on {selectedOrder.createdAt?.toDate?.().toLocaleDateString()}
                  </p>
                </div>
                <button onClick={closeDetailModal} className="text-gray-400 hover:text-white">
                  <Eye className="w-6 h-6" />
                </button>
              </div>

              <div className="p-8 space-y-6">
                {/* Status */}
                <div>
                  <h3 className="text-lg font-bold mb-3">Order Status</h3>
                  <div className="flex gap-2">
                    {(['Pending', 'Packed', 'Shipped', 'Delivered'] as Order['status'][]).map(status => (
                      <button
                        key={status}
                        onClick={() => handleStatusUpdate(selectedOrder.id!, status)}
                        disabled={updatingStatus}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                          selectedOrder.status === status
                            ? statusColors[status]
                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                        } disabled:opacity-50`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Customer Info */}
                <div>
                  <h3 className="text-lg font-bold mb-3">Customer Information</h3>
                  <div className="bg-white/5 rounded-lg p-4 space-y-2">
                    <p><span className="text-gray-400">Name:</span> {selectedOrder.customerName}</p>
                    <p><span className="text-gray-400">Email:</span> {selectedOrder.customerEmail}</p>
                    <p><span className="text-gray-400">Phone:</span> {selectedOrder.customerPhone}</p>
                    <p><span className="text-gray-400">Address:</span> {selectedOrder.shippingAddress}</p>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="text-lg font-bold mb-3">Order Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="bg-white/5 rounded-lg p-4 flex justify-between items-center">
                        <div>
                          <p className="font-medium">{item.productName}</p>
                          <p className="text-sm text-gray-400">Quantity: {item.quantity}</p>
                        </div>
                        <p className="font-bold text-yellow-600">₦{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className="border-t border-white/10 pt-4">
                  <div className="flex justify-between items-center">
                    <p className="text-xl font-bold">Total Amount</p>
                    <p className="text-3xl font-bold text-yellow-600">₦{selectedOrder.total.toLocaleString()}</p>
                  </div>
                  {selectedOrder.paymentRef && (
                    <p className="text-sm text-gray-400 mt-2">Payment Ref: {selectedOrder.paymentRef}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}