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
    <div className="min-h-screen bg-cream-100 text-gray-900 pt-24 font-sans-serif">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-serif mb-4 tracking-tight">Order Manifest</h1>
          <p className="text-gray-500 font-sans-serif tracking-widest uppercase text-[10px] font-bold">Curating Customer Journeys</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-6 mb-12">
          <div className="flex-1 relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ID, Customer, or Email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-5 bg-white border border-gray-100 shadow-soft focus:shadow-premium focus:outline-none focus:border-gold-300 transition-all text-sm"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white border border-gray-100 shadow-soft px-6 py-5 flex items-center gap-3">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent focus:outline-none text-xs font-bold uppercase tracking-widest text-gray-600 appearance-none pr-8 cursor-pointer"
              >
                <option value="All">All Transactions</option>
                <option value="Pending">Pending</option>
                <option value="Packed">Packed</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {(['Pending', 'Packed', 'Shipped', 'Delivered'] as Order['status'][]).map(status => (
            <div key={status} className="bg-white border border-gray-100 shadow-soft p-6">
              <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold mb-2">{status}</p>
              <p className="text-4xl font-serif">{orders.filter(o => o.status === status).length}</p>
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
                  className="bg-white border border-gray-100 shadow-soft p-8 group hover:shadow-premium transition-all duration-500"
                >
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-6 mb-6">
                        <span className="text-[10px] tracking-[0.3em] font-bold text-gold-600 uppercase italic">#{order.orderId}</span>
                        <span className={`px-4 py-1.5 text-[10px] font-bold tracking-widest uppercase ${statusColors[order.status]}`}>
                          {order.status}
                        </span>
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                          {order.createdAt?.toDate?.().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) || 'N/A'}
                        </span>
                      </div>

                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div>
                          <p className="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-1">Customer</p>
                          <p className="font-serif text-lg text-gray-900">{order.customerName}</p>
                          <p className="text-xs text-gray-400 mt-1">{order.customerEmail}</p>
                        </div>
                        <div>
                          <p className="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-1">Total Value</p>
                          <p className="font-serif text-2xl text-gray-900">₦{order.total.toLocaleString()}</p>
                        </div>
                        <div className="hidden lg:block">
                          <p className="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-1">Items</p>
                          <p className="text-xs text-gray-600">{order.items.length} product(s) in batch</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 lg:border-l lg:border-gray-50 lg:pl-8">
                      <button
                        onClick={() => openDetailModal(order)}
                        className="px-8 py-4 bg-gray-50 text-[10px] font-bold tracking-widest uppercase text-gray-600 hover:bg-gray-100 transition-all flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" /> Details
                      </button>
                      {nextStatus && (
                        <button
                          onClick={() => handleStatusUpdate(order.id!, nextStatus)}
                          disabled={updatingStatus}
                          className="px-8 py-4 bg-gray-900 text-white text-[10px] font-bold tracking-widest uppercase hover:bg-gold-600 transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                          {updatingStatus ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Truck className="w-4 h-4" />
                          )}
                          Advance to {nextStatus}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {showDetailModal && selectedOrder && (
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-6">
            <div className="bg-white shadow-premium max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-100">
              <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-50 px-10 py-8 flex justify-between items-start z-10">
                <div>
                  <span className="text-[10px] tracking-[0.4em] text-gold-600 font-bold uppercase mb-2 block">Order Specifics</span>
                  <h2 className="text-4xl font-serif text-gray-900 tracking-tight">#{selectedOrder.orderId}</h2>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-2">
                    Initialized on {selectedOrder.createdAt?.toDate?.().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <button onClick={closeDetailModal} className="w-12 h-12 bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="p-10 space-y-12">
                {/* Workflow Progress */}
                <div>
                  <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-gray-400 mb-6">Workflow Status</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {(['Pending', 'Packed', 'Shipped', 'Delivered'] as Order['status'][]).map(status => (
                      <button
                        key={status}
                        onClick={() => handleStatusUpdate(selectedOrder.id!, status)}
                        disabled={updatingStatus}
                        className={`px-4 py-4 text-[10px] font-bold tracking-widest uppercase transition-all border ${selectedOrder.status === status
                            ? statusColors[status]
                            : 'bg-gray-50 border-gray-50 text-gray-400 hover:border-gray-200'
                          } disabled:opacity-50`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-16">
                  {/* Customer Info */}
                  <div>
                    <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-gray-400 mb-6">Consignee</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-1">Identity</p>
                        <p className="font-serif text-xl border-b border-gray-50 pb-2">{selectedOrder.customerName}</p>
                      </div>
                      <div>
                        <p className="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-1">Communication</p>
                        <p className="text-sm text-gray-600">{selectedOrder.customerEmail}</p>
                        <p className="text-sm text-gray-600">{selectedOrder.customerPhone}</p>
                      </div>
                      <div>
                        <p className="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-1">Curation Destination</p>
                        <p className="text-sm text-gray-600 leading-relaxed italic">"{selectedOrder.shippingAddress}"</p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-gray-400 mb-6">Collection Items</h3>
                    <div className="space-y-6">
                      {selectedOrder.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-start border-b border-gray-50 pb-4">
                          <div>
                            <p className="font-serif text-lg text-gray-900">{item.productName}</p>
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Quantity: {item.quantity}</p>
                          </div>
                          <p className="font-serif text-gray-900">₦{(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Total */}
                <div className="bg-gray-50 p-10 flex flex-col items-end">
                  <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400 font-bold mb-2">Grand Total</p>
                  <p className="text-5xl font-serif text-gray-900">₦{selectedOrder.total.toLocaleString()}</p>
                  {selectedOrder.paymentRef && (
                    <p className="text-[10px] text-gray-400 mt-6 tracking-widest border-t border-gray-200 pt-4 uppercase">Reference: {selectedOrder.paymentRef}</p>
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