// src/pages/admin/AdminRequests.tsx
import { Mail, Phone, Image, Clock } from 'lucide-react';

const requests = [
  {
    id: 1,
    name: "Aisha Bello",
    product: "Custom Tote Bag",
    theme: "Ankara Gold Elegance",
    email: "aisha@gmail.com",
    phone: "08012345678",
    date: "2025-11-11",
    status: "New"
  },
];

export default function AdminRequests() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-serif text-gray-900 mb-8">Personalization Requests</h1>

        <div className="grid gap-8">
          {requests.map(req => (
            <div key={req.id} className="bg-white rounded-2xl shadow-lg p-8 border-l-8 border-yellow-600">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold">{req.name}</h3>
                  <p className="text-gray-600">Request #{req.id} • {req.date}</p>
                </div>
                <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-bold">
                  {req.status}
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-gray-600 mb-2">Product</p>
                  <p className="font-medium text-lg">{req.product}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-2">Theme/Description</p>
                  <p className="font-medium italic">"{req.theme}"</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-6 mb-6">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <span>{req.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <span>{req.phone}</span>
                </div>
              </div>

              <div className="flex gap-4">
                <button className="bg-yellow-600 text-white px-8 py-3 rounded-full hover:bg-black transition font-medium">
                  Reply via Email
                </button>
                <button className="border border-gray-300 px-8 py-3 rounded-full hover:border-yellow-600 transition">
                  Mark as Done
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}