// src/pages/admin/AdminOrders.tsx
import { Package, Truck, CheckCircle, XCircle } from 'lucide-react';

const orders = [
  { id: "ORD-001", customer: "Chioma Okeke", total: 125000, status: "Pending", date: "2025-11-10" },
  { id: "ORD-002", customer: "Tunde Adebayo", total: 89000, status: "Shipped", date: "2025-11-09" },
];

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-800",
  Shipped: "bg-blue-100 text-blue-800",
  Delivered: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
};

export default function AdminOrders() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-serif text-gray-900 mb-8">Orders Management</h1>

        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
                <div>
                  <div className="flex items-center gap-4 mb-3">
                    <Package className="w-8 h-8 text-yellow-600" />
                    <h3 className="text-xl font-bold">{order.id}</h3>
                    <span className={`px-4 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-gray-600">Customer: <strong>{order.customer}</strong></p>
                  <p className="text-gray-600">Date: {order.date}</p>
                  <p className="text-2xl font-bold text-yellow-600 mt-2">₦{order.total.toLocaleString()}</p>
                </div>

                <div className="flex gap-3">
                  <button className="px-6 py-3 bg-gray-900 text-white rounded-full hover:bg-yellow-600 transition flex items-center gap-2">
                    <Truck className="w-5 h-5" /> Update Status
                  </button>
                  <button className="px-6 py-3 border border-gray-300 rounded-full hover:border-yellow-600 transition">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}