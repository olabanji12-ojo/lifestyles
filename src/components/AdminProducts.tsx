// src/pages/admin/AdminProducts.tsx
import { useState } from 'react';
import { Plus, Edit, Trash2, Image, Package } from 'lucide-react';

const mockProducts = [
  { id: 1, name: "Silk Scarf - Midnight", price: 45000, stock: 12, category: "Fashion" },
  { id: 2, name: "Gold Necklace", price: 85000, stock: 5, category: "Accessories" },
  // ... more
];

export default function AdminProducts() {
  const [products, setProducts] = useState(mockProducts);
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-serif text-gray-900">Manage Products</h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 bg-yellow-600 text-white px-6 py-3 rounded-full hover:bg-black transition"
          >
            <Plus className="w-5 h-5" /> Add Product
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th className="px-6 py-4 text-left">Product</th>
                <th className="px-6 py-4 text-left">Category</th>
                <th className="px-6 py-4 text-left">Price</th>
                <th className="px-6 py-4 text-left">Stock</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-200 border-2 border-dashed rounded-xl" />
                    <div>
                      <p className="font-medium">{p.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{p.category}</td>
                  <td className="px-6 py-4 font-bold">₦{p.price.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${p.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {p.stock} in stock
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <button className="text-blue-600 hover:text-blue-800"><Edit className="w-5 h-5" /></button>
                      <button className="text-red-600 hover:text-red-800"><Trash2 className="w-5 h-5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}