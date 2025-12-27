// src/pages/admin/AdminProducts.tsx
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Upload, Loader2, Search, ImageIcon, Layout, Palette, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  Product,
  ProductVariant
} from '../firebase/helpers';
import { seedProductsToFirestore } from '../firebase/seedDatabase';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    slug: '',
    hasVariants: false,
    price: 0,
    stock: 0,
    category: 'Fashion',
    functions: [] as string[],
    colors: [] as string[],
    featured: false,
    images: [] as string[],
  });

  const [variants, setVariants] = useState<ProductVariant[]>([
    { size: 'Small', price: 0, stock: 0 },
    { size: 'Medium', price: 0, stock: 0 },
    { size: 'Large', price: 0, stock: 0 },
  ]);

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const categories = ['Fashion', 'Accessories', 'Gifts', 'Home', 'Productivity', 'Events', 'Packaging'];
  const availableSizes = ['Small', 'Medium', 'Large', 'XL', 'XXL', 'Standard', 'Custom'];
  const functions = ['Work', 'Play', 'Fancy', 'Sleep', 'Eat'];
  const colors = ['Dark', 'Bright', 'Neutral', 'Gold', 'Silver', 'Rose Gold'];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const result = await getProducts();
    if (result.success) {
      setProducts(result.products);
    } else {
      toast.error('Failed to load products');
    }
    setLoading(false);
  };

  const handleSeed = async () => {
    if (!confirm('WARNING: Seed mock data to Firestore?')) return;
    setSeeding(true);
    const result = await seedProductsToFirestore();
    if (result.success) {
      toast.success(`Seeded ${result.count} products!`);
      fetchProducts();
    } else {
      toast.error('Seeding failed');
    }
    setSeeding(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageFiles(files);
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let imageUrls = editingProduct?.images || [];
      if (imageFiles.length > 0) {
        const uploadResult = await uploadProductImages(imageFiles);
        if (uploadResult.success) {
          imageUrls = uploadResult.urls;
        } else {
          toast.error('Image upload failed');
          setSubmitting(false);
          return;
        }
      }

      const productData: any = {
        ...formData,
        images: imageUrls,
        updatedAt: new Date(),
      };

      if (formData.hasVariants) {
        productData.variants = variants;
      }

      const result = editingProduct
        ? await updateProduct(editingProduct.id!, productData)
        : await addProduct(productData);

      if (result.success) {
        toast.success(`Product ${editingProduct ? 'updated' : 'added'}!`);
        fetchProducts();
        closeModal();
      } else {
        toast.error('Operation failed');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this masterpiece?')) return;
    const result = await deleteProduct(id);
    if (result.success) {
      toast.success('Deleted');
      fetchProducts();
    }
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      slug: product.slug,
      hasVariants: product.hasVariants,
      price: product.price || 0,
      stock: product.stock || 0,
      category: product.category,
      functions: product.functions || [],
      colors: product.colors || [],
      featured: product.featured || false,
      images: product.images || [],
    });
    setVariants(product.variants || []);
    setImagePreviews(product.images || []);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      slug: '',
      hasVariants: false,
      price: 0,
      stock: 0,
      category: 'Fashion',
      functions: [],
      colors: [],
      featured: false,
      images: [],
    });
    setVariants([]);
    setImageFiles([]);
    setImagePreviews([]);
  };

  const addVariant = () => setVariants([...variants, { size: 'Standard', price: 0, stock: 0 }]);
  const removeVariant = (index: number) => setVariants(variants.filter((_, i) => i !== index));
  const updateVariant = (index: number, field: keyof ProductVariant, value: string | number) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    setVariants(updated);
  };

  const toggleArrayValue = (array: string[], value: string, setter: (val: string[]) => void) => {
    setter(array.includes(value) ? array.filter(v => v !== value) : [...array, value]);
  };

  const filteredProducts = products.filter(p =>
    (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === 'All' || p.category === selectedCategory)
  );

  return (
    <div className="min-h-screen bg-cream-100 text-gray-900 font-sans-serif">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-24">

        {/* Top Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-16">
          <div>
            <span className="text-[10px] tracking-[0.4em] text-gold-600 font-bold uppercase mb-2 block">Curation Hub</span>
            <h1 className="text-5xl font-serif tracking-tight text-gray-900">Inventory Management</h1>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="flex items-center gap-2 px-8 py-4 bg-white border border-gray-100 text-[10px] font-bold tracking-widest uppercase hover:bg-gray-50 transition-all shadow-soft"
            >
              {seeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Star className="w-4 h-4" />} Seed Mock Data
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-8 py-4 bg-gray-900 text-white text-[10px] font-bold tracking-widest uppercase hover:bg-gold-600 transition-all shadow-premium"
            >
              <Plus className="w-4 h-4" /> Add New Piece
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-6 mb-12">
          <div className="flex-1 relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-gold-600 transition-colors" />
            <input
              type="text"
              placeholder="Search by piece designation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-5 bg-white border border-gray-100 shadow-soft focus:shadow-premium focus:outline-none focus:border-gold-300 transition-all text-sm"
            />
          </div>
          <div className="bg-white border border-gray-100 shadow-soft px-8 py-5 flex items-center gap-3 min-w-[240px]">
            <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Category</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent focus:outline-none text-xs font-bold uppercase tracking-widest text-gray-600 appearance-none flex-1 cursor-pointer"
            >
              <option value="All">All Collections</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Product Listing */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-96 bg-white/50 border border-dashed border-gray-200">
            <Loader2 className="w-12 h-12 animate-spin text-gold-600 mb-4" />
            <p className="text-[10px] tracking-[0.3em] uppercase text-gray-400 font-bold">Synchronizing Archives</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Desktop Table */}
            <div className="hidden lg:block bg-white shadow-soft border border-gray-100 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 border-b border-gray-100">
                  <tr>
                    <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Designation</th>
                    <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Archival Class</th>
                    <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Valuation</th>
                    <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Inventory Status</th>
                    <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Management</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/30 transition-all duration-300 group">
                      <td className="px-8 py-8">
                        <div className="flex items-center gap-6">
                          <div className="relative w-16 h-16 overflow-hidden bg-gray-50 border border-gray-100">
                            {p.images?.[0] ? (
                              <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            ) : (
                              <ImageIcon className="w-6 h-6 text-gray-200 m-auto absolute inset-0" />
                            )}
                          </div>
                          <div>
                            <p className="font-serif text-lg text-gray-900 group-hover:text-gold-600 transition-colors">{p.name}</p>
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1 font-bold">{p.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-8">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 bg-gray-100 px-3 py-1">{p.category}</span>
                      </td>
                      <td className="px-8 py-8 font-serif text-xl">
                        {p.hasVariants
                          ? `From ₦${Math.min(...(p.variants?.map(v => v.price) || [0])).toLocaleString()}`
                          : `₦${p.price?.toLocaleString()}`}
                      </td>
                      <td className="px-8 py-8">
                        {p.hasVariants ? (
                          <div className="flex flex-wrap gap-2">
                            {p.variants?.map((v, i) => (
                              <span key={i} className={`text-[9px] font-bold uppercase px-2 py-1 border ${v.stock < 5 ? 'border-rose-100 text-rose-500 bg-rose-50' : 'border-gray-100 text-gray-500'}`}>
                                {v.size}: {v.stock}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className={`text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 ${(p.stock ?? 0) < 5 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                            {p.stock ?? 0} Units Available
                          </span>
                        )}
                      </td>
                      <td className="px-8 py-8 text-right">
                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button onClick={() => openEditModal(p)} className="p-3 bg-gray-50 text-gray-600 hover:bg-gray-900 hover:text-white transition-all">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(p.id!)} className="p-3 bg-rose-50 text-rose-400 hover:bg-rose-500 hover:text-white transition-all">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View */}
            <div className="lg:hidden space-y-6">
              {filteredProducts.map((p) => (
                <div key={p.id} className="bg-white border border-gray-100 shadow-soft p-6">
                  <div className="flex items-center gap-6 mb-6">
                    <div className="w-24 h-24 bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0">
                      {p.images?.[0] ? <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" /> : <ImageIcon className="w-8 h-8 text-gray-200 m-auto mt-8" />}
                    </div>
                    <div>
                      <h3 className="font-serif text-xl text-gray-900">{p.name}</h3>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1 font-bold">{p.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-50 pt-6">
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-1">Value</p>
                      <p className="font-serif text-xl italic">₦{p.hasVariants ? Math.min(...(p.variants?.map(v => v.price) || [0])).toLocaleString() : p.price?.toLocaleString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => openEditModal(p)} className="w-12 h-12 bg-gray-50 flex items-center justify-center text-gray-600">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDelete(p.id!)} className="w-12 h-12 bg-rose-50 flex items-center justify-center text-rose-400">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Catalogue Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-6 overflow-y-auto">
            <div className="bg-white shadow-premium max-w-5xl w-full max-h-[90vh] overflow-y-auto border border-gray-100 relative">

              <div className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-gray-50 px-10 py-10 flex justify-between items-start z-10">
                <div>
                  <span className="text-[10px] tracking-[0.5em] text-gold-600 font-bold uppercase mb-3 block">Archival Protocol</span>
                  <h2 className="text-4xl font-serif text-gray-900 tracking-tight">{editingProduct ? 'Refine Masterpiece' : 'Catalogue New Entry'}</h2>
                </div>
                <button onClick={closeModal} className="w-14 h-14 bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors">
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-10 lg:p-16 space-y-20">

                {/* Core Details */}
                <section>
                  <div className="flex items-center gap-4 mb-10">
                    <Layout className="w-5 h-5 text-gold-600" />
                    <h3 className="text-xs uppercase tracking-[0.4em] font-bold text-gray-400">Essential Designation</h3>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-16">
                    <div className="space-y-12">
                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 mb-4">Piece Title</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full text-3xl font-serif bg-transparent border-b border-gray-100 py-4 focus:border-gold-600 focus:outline-none transition-colors placeholder:text-gray-100"
                          placeholder="Untitled Masterpiece"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 mb-4">Archive Identifier (Slug)</label>
                        <input
                          type="text"
                          required
                          value={formData.slug}
                          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                          className="w-full text-sm tracking-[0.2em] bg-gray-50 px-6 py-4 border-transparent focus:bg-white focus:border-gold-200 focus:outline-none transition-all"
                          placeholder="piece-slug-identifier"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 mb-4">Collection Class</label>
                        <div className="grid grid-cols-2 gap-4">
                          {categories.map(cat => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => setFormData({ ...formData, category: cat })}
                              className={`py-4 text-[10px] font-bold tracking-widest uppercase border transition-all ${formData.category === cat ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300'}`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-12">
                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 mb-4">Creative Narrative</label>
                        <textarea
                          required
                          rows={8}
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          className="w-full bg-cream-100/50 p-8 text-sm leading-relaxed italic border-transparent focus:bg-white focus:border-gold-200 focus:outline-none transition-all"
                          placeholder="Describe the soul of this creation..."
                        />
                      </div>
                    </div>
                  </div>
                </section>

                <hr className="border-gray-50" />

                {/* Valuation & Inventory */}
                <section>
                  <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                      <Layout className="w-5 h-5 text-gold-600" />
                      <h3 className="text-xs uppercase tracking-[0.4em] font-bold text-gray-400">Commerce & Archival Stocks</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, hasVariants: !formData.hasVariants })}
                      className={`px-8 py-3 text-[10px] font-bold tracking-widest uppercase transition-all border ${formData.hasVariants ? 'bg-gold-600 text-white border-gold-600' : 'bg-white text-gray-400 border-gray-100'}`}
                    >
                      {formData.hasVariants ? 'Multivariate Enabled' : 'Enable Variants'}
                    </button>
                  </div>

                  {!formData.hasVariants ? (
                    <div className="grid md:grid-cols-2 gap-10 bg-gray-50 p-10 lg:p-16">
                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 mb-4">Standard Valuation (₦)</label>
                        <input
                          type="number"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                          className="w-full text-4xl font-serif bg-transparent border-b border-gray-200 py-4 focus:border-gold-600 focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 mb-4">Inventory Units</label>
                        <input
                          type="number"
                          value={formData.stock}
                          onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                          className="w-full text-4xl font-serif bg-transparent border-b border-gray-200 py-4 focus:border-gold-600 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {variants.map((v, i) => (
                        <div key={i} className="grid lg:grid-cols-4 gap-6 bg-gray-50 p-6 items-end">
                          <div>
                            <label className="block text-[9px] uppercase tracking-widest font-bold text-gray-400 mb-2">Variant Iteration</label>
                            <select
                              value={v.size}
                              onChange={(e) => updateVariant(i, 'size', e.target.value)}
                              className="w-full bg-white border border-gray-100 py-3 px-4 text-xs font-bold uppercase focus:outline-none"
                            >
                              {availableSizes.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </div>
                          <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[9px] uppercase tracking-widest font-bold text-gray-400 mb-2">Valuation</label>
                              <input type="number" value={v.price} onChange={(e) => updateVariant(i, 'price', Number(e.target.value))} className="w-full bg-white border border-gray-100 py-3 px-4 focus:outline-none font-serif" />
                            </div>
                            <div>
                              <label className="block text-[9px] uppercase tracking-widest font-bold text-gray-400 mb-2">Stock</label>
                              <input type="number" value={v.stock} onChange={(e) => updateVariant(i, 'stock', Number(e.target.value))} className="w-full bg-white border border-gray-100 py-3 px-4 focus:outline-none font-serif" />
                            </div>
                          </div>
                          <button type="button" onClick={() => removeVariant(i)} className="flex items-center justify-center h-12 bg-rose-50 text-rose-400 hover:bg-rose-500 hover:text-white transition-all"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      ))}
                      <button type="button" onClick={addVariant} className="w-full py-6 border-2 border-dashed border-gray-100 text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400 hover:border-gold-300 hover:text-gold-600 transition-all">+ Append Variant Protocol</button>
                    </div>
                  )}
                </section>

                <hr className="border-gray-50" />

                {/* Aesthetics & Visuals */}
                <section>
                  <div className="flex items-center gap-4 mb-10">
                    <Palette className="w-5 h-5 text-gold-600" />
                    <h3 className="text-xs uppercase tracking-[0.4em] font-bold text-gray-400">Aesthetics & Visual Showcase</h3>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-20">
                    <div className="space-y-12">
                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 mb-6">Visual Repository</label>
                        <div className="flex flex-wrap gap-4">
                          {imagePreviews.map((url, i) => (
                            <div key={i} className="w-32 h-32 relative border border-gray-100 bg-gray-50 overflow-hidden group">
                              <img src={url} className="w-full h-full object-cover" />
                              <button type="button" onClick={() => {
                                setImagePreviews(imagePreviews.filter((_, idx) => idx !== i));
                                if (i < (editingProduct?.images?.length || 0)) {
                                  setFormData({ ...formData, images: formData.images.filter((_, idx) => idx !== i) });
                                }
                              }} className="absolute inset-0 bg-rose-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <X className="w-6 h-6" />
                              </button>
                            </div>
                          ))}
                          <label className="w-32 h-32 border-2 border-dashed border-gray-100 flex flex-col items-center justify-center cursor-pointer hover:border-gold-300 transition-all text-gray-300 hover:text-gold-600 bg-gray-50/50">
                            <Upload className="w-6 h-6 mb-2" />
                            <span className="text-[8px] font-bold uppercase tracking-widest">Upload</span>
                            <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-12">
                      <div className="bg-cream-100/30 p-10 space-y-10 border border-cream-200">
                        <div>
                          <label className="block text-[10px] uppercase tracking-[0.3em] font-bold text-gray-500 mb-4">Curation Attributes</label>
                          <div className="flex flex-wrap gap-2">
                            {functions.map(f => (
                              <button key={f} type="button" onClick={() => toggleArrayValue(formData.functions, f, (v) => setFormData({ ...formData, functions: v }))} className={`px-4 py-2 text-[9px] font-bold uppercase tracking-widest border transition-all ${formData.functions.includes(f) ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-400 border-gray-100'}`}>{f}</button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-[0.3em] font-bold text-gray-500 mb-4">Aesthetic Tones</label>
                          <div className="flex flex-wrap gap-2">
                            {colors.map(c => (
                              <button key={c} type="button" onClick={() => toggleArrayValue(formData.colors, c, (v) => setFormData({ ...formData, colors: v }))} className={`px-4 py-2 text-[9px] font-bold uppercase tracking-widest border transition-all ${formData.colors.includes(c) ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-400 border-gray-100'}`}>{c}</button>
                            ))}
                          </div>
                        </div>
                        <div className="pt-6 border-t border-cream-200 flex items-center gap-4">
                          <input type="checkbox" id="featured" checked={formData.featured} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} className="w-6 h-6 accent-gold-600" />
                          <label htmlFor="featured" className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-900">Elevate to Featured Curation</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Submit Panel */}
                <div className="sticky bottom-0 bg-white/90 backdrop-blur-md border-t border-gray-100 p-10 flex gap-6 z-10 -mx-10 lg:-mx-16 -mb-10 lg:-mb-16">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-gray-900 text-white py-6 text-[11px] font-bold tracking-[0.4em] uppercase hover:bg-gold-600 transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-premium"
                  >
                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : editingProduct ? 'COMMIT ARCHIVAL CHANGES' : 'AUTHORIZE CATALOGUE ENTRY'}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-12 py-6 border border-gray-100 text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400 hover:text-gray-900 hover:border-gray-300 transition-all bg-white"
                  >
                    DISCARD
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}