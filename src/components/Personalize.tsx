import { useState, FormEvent, ChangeEvent } from 'react';
import { Palette, Grid3x3, Type, Gift, Upload, ChevronDown, ChevronUp } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

// Cloudinary config
const CLOUD_NAME = 'YOUR_CLOUD_NAME'; // ← replace
const UPLOAD_PRESET = 'YOUR_UPLOAD_PRESET'; // ← unsigned preset for signed-out uploads

type Form = {
  productType: string;
  description: string;
  occasion: string;
  quantity: string;
  budget: string;
  timeline: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
};

export default function Personalize() {
  const [form, setForm] = useState<Form>({
    productType: '',
    description: '',
    occasion: '',
    quantity: '',
    budget: '',
    timeline: '',
    name: '',
    email: '',
    phone: '',
    notes: '',
  });

  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleFiles = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(Array.from(e.target.files));
  };

  const uploadImages = async (): Promise<string[]> => {
    const urls: string[] = [];
    for (const file of files) {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('upload_preset', UPLOAD_PRESET);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: fd,
      });
      const json = await res.json();
      urls.push(json.secure_url);
    }
    return urls;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const imageUrls = files.length ? await uploadImages() : [];
      await addDoc(collection(db, 'personalization_requests'), {
        ...form,
        referenceImages: imageUrls,
        status: 'Pending',
        createdAt: new Date(),
      });
      setDone(true);
    } catch (err: any) {
      alert(err.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (done)
    return (
      <div className="min-h-screen bg-[#FAF9F6] pt-20 flex items-center justify-center px-6">
        <div className="max-w-lg text-center">
          <h2 className="text-2xl text-gray-900 mb-4">Thank you!</h2>
          <p className="text-gray-600 mb-6">We’ve received your request and will contact you within 24 hours.</p>
          <button
            onClick={() => setDone(false)}
            className="bg-yellow-600 text-white px-6 py-2 rounded hover:bg-yellow-500 transition"
          >
            Make another request
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-gray-800 pt-20">
      {/* Hero */}
      <section className="max-w-screen-xl mx-auto px-6 sm:px-10 py-12">
        <nav className="text-sm text-gray-500 mb-8">
          <a href="/" className="hover:text-yellow-600">Home</a>
          <span className="mx-2">/</span>
          <span className="text-gray-800 font-medium">Personalize</span>
        </nav>
        <div className="text-center mb-16">
          <h1 className="font-serif text-4xl sm:text-6xl tracking-[0.15em] mb-4">PERSONALIZE</h1>
          <p className="text-2xl text-yellow-600 italic font-light mb-6">Make It Uniquely Yours</p>
          <p className="text-gray-700 text-lg max-w-3xl mx-auto">
            Unlock endless possibilities to create products that truly reflect your style and story.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="max-w-3xl mx-auto px-6 sm:px-10 pb-20">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm tracking-wider mb-2">Product Type <span className="text-yellow-600">*</span></label>
            <select
              name="productType"
              value={form.productType}
              onChange={handleChange}
              required
              className="w-full bg-white border border-gray-300 rounded px-4 py-3 focus:outline-none focus:border-yellow-600"
            >
              <option value="">Select type</option>
              <option value="fashion">Fashion Item</option>
              <option value="accessory">Accessory</option>
              <option value="home">Home Décor</option>
              <option value="gift">Gift Item</option>
              <option value="packaging">Packaging</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm tracking-wider mb-2">Detailed Description <span className="text-yellow-600">*</span></label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={4}
              placeholder="Describe your vision, materials, desired features..."
              className="w-full bg-white border border-gray-300 rounded px-4 py-3 focus:outline-none focus:border-yellow-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm tracking-wider mb-2">Quantity</label>
              <input
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                type="number"
                min={1}
                className="w-full bg-white border border-gray-300 rounded px-4 py-3 focus:outline-none focus:border-yellow-600"
              />
            </div>
            <div>
              <label className="block text-sm tracking-wider mb-2">Budget (₦)</label>
              <input
                name="budget"
                value={form.budget}
                onChange={handleChange}
                type="number"
                placeholder="e.g. 50000"
                className="w-full bg-white border border-gray-300 rounded px-4 py-3 focus:outline-none focus:border-yellow-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm tracking-wider mb-2">Timeline</label>
            <input
              name="timeline"
              value={form.timeline}
              onChange={handleChange}
              type="date"
              className="w-full bg-white border border-gray-300 rounded px-4 py-3 focus:outline-none focus:border-yellow-600"
            />
          </div>

          <div>
            <label className="block text-sm tracking-wider mb-2">Reference Images (optional)</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFiles}
              className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-yellow-600 file:text-white hover:file:bg-yellow-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm tracking-wider mb-2">Name <span className="text-yellow-600">*</span></label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full bg-white border border-gray-300 rounded px-4 py-3 focus:outline-none focus:border-yellow-600"
              />
            </div>
            <div>
              <label className="block text-sm tracking-wider mb-2">Email <span className="text-yellow-600">*</span></label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full bg-white border border-gray-300 rounded px-4 py-3 focus:outline-none focus:border-yellow-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm tracking-wider mb-2">Phone <span className="text-yellow-600">*</span></label>
            <input
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              required
              className="w-full bg-white border border-gray-300 rounded px-4 py-3 focus:outline-none focus:border-yellow-600"
            />
          </div>

          <div>
            <label className="block text-sm tracking-wider mb-2">Additional Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              className="w-full bg-white border border-gray-300 rounded px-4 py-3 focus:outline-none focus:border-yellow-600"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-yellow-600 text-white py-4 text-sm tracking-[0.2em] font-bold hover:bg-yellow-500 transition disabled:opacity-50"
          >
            {submitting ? 'SUBMITTING...' : 'SUBMIT CUSTOMIZATION REQUEST'}
          </button>
        </form>
      </section>
    </div>
  );
}