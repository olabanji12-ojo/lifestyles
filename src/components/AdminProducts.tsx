// src/pages/admin/AdminProducts.tsx
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Upload, Loader2, Search } from 'lucide-react';
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

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    hasVariants: false,
    price: 0,
    stock: 0,
    category: 'Fashion',
    functions: [] as string[],
    colors: [] as string[],
    featured: false,
  });
  const [variants, setVariants] = useState<ProductVariant[]>([
    { size: 'Small', price: 0, stock: 0 },
    { size: 'Medium', price: 0, stock: 0 },
    { size: 'Large', price: 0, stock: 0 },
  ]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const categories = ['Fashion', 'Accessories', 'Gifts', 'Home', 'Productivity', 'Events', 'Packaging'];
  const availableSizes = ['Small', 'Medium', 'Large', 'XL', 'XXL'];
  const functions = ['Work', 'Play', 'Fancy', 'Sleep', 'Eat'];
  const colors = ['Dark', 'Bright', 'Neutral'];

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const result = await getProducts();
    if (result.success) {
  const validProducts = result.products.filter(p => p.name && typeof p.name === 'string');
  setProducts(validProducts);
} else {
      toast.error('Failed to load products');
    }
    setLoading(false);
  };

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageFiles(files);
    
    // Create previews
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Upload images if new ones were selected
      let imageUrls: string[] = editingProduct?.images || [];
      
      if (imageFiles.length > 0) {
        const uploadResult = await uploadProductImages(imageFiles);
        if (uploadResult.success) {
          imageUrls = uploadResult.urls;
        } else {
          toast.error('Failed to upload images');
          setSubmitting(false);
          return;
        }
      }

      // Create slug from name
      const slug = formData.name.toLowerCase().replace(/\s+/g, '-');

      const productData: any = {
        name: formData.name,
        description: formData.description,
        slug,
        images: imageUrls,
        category: formData.category,
        functions: formData.functions,
        colors: formData.colors,
        featured: formData.featured,
        hasVariants: formData.hasVariants,
      };

      // Add variants or single price/stock based on hasVariants
      if (formData.hasVariants) {
        productData.variants = variants.filter(v => v.price > 0); // Only include variants with price set
      } else {
        productData.price = formData.price;
        productData.stock = formData.stock;
      }

      let result;
      if (editingProduct) {
        // Update existing product
        result = await updateProduct(editingProduct.id!, productData);
        if (result.success) {
          toast.success('Product updated successfully!');
        }
      } else {
        // Add new product
        result = await addProduct(productData);
        if (result.success) {
          toast.success('Product added successfully!');
        }
      }

      if (result.success) {
        fetchProducts(); // Refresh list
        closeModal();
      } else {
        toast.error('Operation failed');
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong');
    }

    setSubmitting(false);
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    const result = await deleteProduct(id);
    if (result.success) {
      toast.success('Product deleted');
      fetchProducts();
    } else {
      toast.error('Failed to delete product');
    }
  };

  // Open modal for editing
  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      hasVariants: product.hasVariants,
      price: product.price || 0,
      stock: product.stock || 0,
      category: product.category,
      functions: product.functions,
      colors: product.colors,
      featured: product.featured,
    });
    
    if (product.hasVariants && product.variants) {
      setVariants(product.variants);
    }
    
    setImagePreviews(product.images);
    setShowModal(true);
  };

  // Close modal and reset
  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      hasVariants: false,
      price: 0,
      stock: 0,
      category: 'Fashion',
      functions: [],
      colors: [],
      featured: false,
    });
    setVariants([
      { size: 'Small', price: 0, stock: 0 },
      { size: 'Medium', price: 0, stock: 0 },
      { size: 'Large', price: 0, stock: 0 },
    ]);
    setImageFiles([]);
    setImagePreviews([]);
  };

  // Filter products
  const filteredProducts = products.filter(p => {
  const matchesSearch = (p.name ?? '').toLowerCase().includes(searchTerm.toLowerCase());
  const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
  return matchesSearch && matchesCategory;
});

  // Add/Remove variant
  const addVariant = () => {
    setVariants([...variants, { size: 'Custom', price: 0, stock: 0 }]);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const updateVariant = (index: number, field: keyof ProductVariant, value: string | number) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    setVariants(updated);
  };

  // Toggle array values (for functions and colors)
  const toggleArrayValue = (array: string[], value: string, setter: (val: string[]) => void) => {
    if (array.includes(value)) {
      setter(array.filter(v => v !== value));
    } else {
      setter([...array, value]);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-4xl font-serif">Manage Products</h1>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-yellow-600 text-black px-6 py-3 rounded-full hover:bg-yellow-500 transition font-semibold"
          >
            <Plus className="w-5 h-5" /> Add Product
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-600"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-6 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-600"
          >
            <option value="All">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* PRODUCTS LIST – RESPONSIVE */}
{loading ? (
  <div className="flex justify-center items-center h-64">
    <Loader2 className="w-12 h-12 animate-spin text-yellow-600" />
  </div>
) : (
  <>
    {/* Desktop table (hidden on mobile) */}
    <div className="hidden md:block bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
      <table className="w-full">
        <thead className="bg-white/10">
          <tr>
            <th className="px-6 py-4 text-left">Product</th>
            <th className="px-6 py-4 text-left">Category</th>
            <th className="px-6 py-4 text-left">Price</th>
            <th className="px-6 py-4 text-left">Stock</th>
            <th className="px-6 py-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((p) => (
            <tr key={p.id} className="border-t border-white/10 hover:bg-white/5">
              <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                  {p.images?.[0] ? (
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-white/10 rounded-lg" />
                  )}
                  <div>
                    <p className="font-medium">{p.name}</p>
                    <p className="text-sm text-gray-400">{p.slug}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-gray-300">{p.category}</td>
              <td className="px-6 py-4 font-bold text-yellow-600">
                {p.hasVariants ? (
                  <span className="text-sm">
                    From ₦{Math.min(...(p.variants?.map((v) => v.price) || [0])).toLocaleString()}
                  </span>
                ) : (
                  `₦${p.price?.toLocaleString() || 0}`
                )}
              </td>
              <td className="px-6 py-4">
                {p.hasVariants ? (
                  <div className="text-xs space-y-1">
                    {p.variants?.map((v, i) => (
                      <div
                        key={i}
                        className={`px-2 py-1 rounded ${
                          v.stock > 10
                            ? 'bg-green-500/20 text-green-400'
                            : v.stock > 0
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {v.size}: {v.stock}
                      </div>
                    ))}
                  </div>
                ) : (
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      (p.stock || 0) > 10
                        ? 'bg-green-500/20 text-green-400'
                        : (p.stock || 0) > 0
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {p.stock} in stock
                  </span>
                )}
              </td>
              <td className="px-6 py-4">
                <div className="flex gap-3">
                  <button
                    onClick={() => openEditModal(p)}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id!)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Mobile cards (hidden on desktop) */}
    <div className="md:hidden space-y-4">
      {filteredProducts.map((p) => (
        <ProductCard key={p.id} product={p} onEdit={openEditModal} onDelete={handleDelete} />
      ))}
    </div>
  </>
)}

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-gray-900 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gray-900 border-b border-white/10 px-8 py-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                <button onClick={closeModal} className="text-gray-400 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                {/* Product Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">Product Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-600"
                    placeholder="e.g., Silk Scarf - Midnight"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-600"
                    placeholder="Describe the product..."
                  />
                </div>

                {/* Price & Stock OR Variants Toggle */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <input
                      type="checkbox"
                      id="hasVariants"
                      checked={formData.hasVariants}
                      onChange={(e) => setFormData({ ...formData, hasVariants: e.target.checked })}
                      className="w-5 h-5"
                    />
                    <label htmlFor="hasVariants" className="text-sm font-medium">
                      This product has size variants (Small, Medium, Large, etc.)
                    </label>
                  </div>

                  {!formData.hasVariants ? (
                    // Single Price & Stock
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Price (₦)</label>
                        <input
                          type="number"
                          required
                          min="0"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-600"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Stock</label>
                        <input
                          type="number"
                          required
                          min="0"
                          value={formData.stock}
                          onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-600"
                        />
                      </div>
                    </div>
                  ) : (
                    // Variants
                    <div className="space-y-4">
                      <label className="block text-sm font-medium mb-2">Product Variants</label>
                      {variants.map((variant, index) => (
                        <div key={index} className="grid grid-cols-3 gap-4 p-4 bg-white/5 rounded-lg border border-white/10">
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Size</label>
                            <select
                              value={variant.size}
                              onChange={(e) => updateVariant(index, 'size', e.target.value)}
                              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm focus:outline-none focus:border-yellow-600"
                            >
                              {availableSizes.map(size => (
                                <option key={size} value={size}>{size}</option>
                              ))}
                              <option value="Custom">Custom</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Price (₦)</label>
                            <input
                              type="number"
                              min="0"
                              value={variant.price}
                              onChange={(e) => updateVariant(index, 'price', Number(e.target.value))}
                              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm focus:outline-none focus:border-yellow-600"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Stock</label>
                            <div className="flex gap-2">
                              <input
                                type="number"
                                min="0"
                                value={variant.stock}
                                onChange={(e) => updateVariant(index, 'stock', Number(e.target.value))}
                                className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm focus:outline-none focus:border-yellow-600"
                              />
                              {variants.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeVariant(index)}
                                  className="px-3 py-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addVariant}
                        className="w-full py-2 border-2 border-dashed border-white/20 rounded-lg text-gray-400 hover:border-yellow-600 hover:text-yellow-600 transition"
                      >
                        + Add Another Size
                      </button>
                    </div>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-600"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Functions */}
                <div>
                  <label className="block text-sm font-medium mb-2">Functions</label>
                  <div className="flex flex-wrap gap-2">
                    {functions.map(fn => (
                      <button
                        key={fn}
                        type="button"
                        onClick={() => toggleArrayValue(formData.functions, fn, (val) => setFormData({ ...formData, functions: val }))}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                          formData.functions.includes(fn)
                            ? 'bg-yellow-600 text-black'
                            : 'bg-white/5 text-white hover:bg-white/10'
                        }`}
                      >
                        {fn}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Colors */}
                <div>
                  <label className="block text-sm font-medium mb-2">Colors</label>
                  <div className="flex flex-wrap gap-2">
                    {colors.map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => toggleArrayValue(formData.colors, color, (val) => setFormData({ ...formData, colors: val }))}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                          formData.colors.includes(color)
                            ? 'bg-yellow-600 text-black'
                            : 'bg-white/5 text-white hover:bg-white/10'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Featured */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-5 h-5"
                  />
                  <label htmlFor="featured" className="text-sm font-medium">Featured Product</label>
                </div>

                {/* Images */}
                <div>
                  <label className="block text-sm font-medium mb-2">Product Images</label>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-yellow-600 transition">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-400">Click to upload images</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-4 gap-4 mt-4">
                      {imagePreviews.map((preview, i) => (
                        <img key={i} src={preview} alt={`Preview ${i}`} className="w-full h-24 object-cover rounded-lg" />
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-yellow-600 text-black py-4 rounded-lg font-bold hover:bg-yellow-500 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {editingProduct ? 'Updating...' : 'Adding...'}
                    </>
                  ) : (
                    editingProduct ? 'Update Product' : 'Add Product'
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


/* Mobile collapsible card */
function ProductCard({
  product,
  onEdit,
  onDelete,
}: {
  product: Product;
  onEdit: (p: Product) => void;
  onDelete: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white/5 rounded-2xl border border-white/10 p-4">
      {/* Header row */}
      <div className="flex items-center gap-4">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-14 h-14 object-cover rounded-lg"
          />
        ) : (
          <div className="w-14 h-14 bg-white/10 rounded-lg" />
        )}
        <div className="flex-1">
          <p className="font-medium text-white">{product.name}</p>
          <p className="text-xs text-gray-400">{product.category}</p>
        </div>
        <button
          onClick={() => setOpen((o) => !o)}
          className="text-yellow-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-5 h-5 transition-transform ${open ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {/* Collapsible body */}
      {open && (
        <div className="mt-4 space-y-3 border-t border-white/10 pt-3">
          {/* Price */}
          <div>
            <span className="text-xs text-gray-400">Price</span>
            <p className="font-bold text-yellow-600">
              {product.hasVariants
                ? `From ₦${Math.min(
                    ...(product.variants?.map((v) => v.price) || [0])
                  ).toLocaleString()}`
                : `₦${product.price?.toLocaleString() || 0}`}
            </p>
          </div>

          {/* Stock */}
          <div>
            <span className="text-xs text-gray-400">Stock</span>
            {product.hasVariants ? (
              <div className="mt-1 text-xs space-y-1">
                {product.variants?.map((v, i) => (
                  <div
                    key={i}
                    className={`inline-block mr-2 mb-1 px-2 py-1 rounded ${
                      v.stock > 10
                        ? 'bg-green-500/20 text-green-400'
                        : v.stock > 0
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {v.size}: {v.stock}
                  </div>
                ))}
              </div>
            ) : (
              <span
                className={`px-3 py-1 rounded-full text-xs ${
                  (product.stock || 0) > 10
                    ? 'bg-green-500/20 text-green-400'
                    : (product.stock || 0) > 0
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'bg-red-500/20 text-red-400'
                }`}
              >
                {product.stock} in stock
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => onEdit(product)}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600/20 text-blue-400 py-2 rounded-lg"
            >
              <Edit className="w-4 h-4" /> Edit
            </button>
            <button
              onClick={() => onDelete(product.id!)}
              className="flex-1 flex items-center justify-center gap-2 bg-red-600/20 text-red-400 py-2 rounded-lg"
            >
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}