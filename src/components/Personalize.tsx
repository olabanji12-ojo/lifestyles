// src/pages/Personalize.tsx

import { useState, FormEvent, ChangeEvent, ReactNode } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import toast from 'react-hot-toast';

// ✅ CORRECT: Import icons directly from 'lucide-react'
import { 
  Palette, Layers, Type, Phone, User, DollarSign, Calendar, ChevronDown, 
  ChevronUp, Clock, CloudUpload // ⬅️ Ensure this is included and correctly exported 
} from 'lucide-react'; 

// ... rest of your file
// Cloudinary config
const CLOUD_NAME = 'YOUR_CLOUD_NAME'; // ← replace
const UPLOAD_PRESET = 'YOUR_UPLOAD_PRESET'; // ← unsigned preset for signed-out uploads

type Form = {
  productType: string;
  description: string;
  occasion: string; // Added 'occasion' field to form data type
  quantity: string;
  budget: string;
  timeline: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
};

// --- Custom Accordion Component for Better UX ---
interface AccordionProps {
    title: string;
    icon: ReactNode;
    children: ReactNode;
    isOpen: boolean;
    onToggle: () => void;
}

const Accordion = ({ title, icon, children, isOpen, onToggle }: AccordionProps) => (
    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-lg bg-white">
        <button
            type="button"
            onClick={onToggle}
            className="flex justify-between items-center w-full p-6 text-left focus:outline-none bg-gray-50 hover:bg-gray-100 transition duration-300"
        >
            <div className="flex items-center">
                {icon}
                <h3 className="ml-3 font-sans-serif text-lg tracking-wider text-gray-900 font-semibold">
                    {title}
                </h3>
            </div>
            {isOpen ? <ChevronUp className="w-5 h-5 text-gray-700" /> : <ChevronDown className="w-5 h-5 text-gray-700" />}
        </button>
        <div 
            className={`transition-max-height duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-screen' : 'max-h-0'}`}
        >
            <div className="p-6 pt-4 border-t border-gray-100 space-y-6">
                {children}
            </div>
        </div>
    </div>
);
// -------------------------------------------------


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
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  
  // State for Accordion control
  const [openSection, setOpenSection] = useState<'design' | 'details' | 'contact'>('design'); 

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleFiles = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(Array.from(e.target.files));
  };

  const uploadImages = async (): Promise<string[]> => {
    setSubmitting(true); // Control overall submission state here, no separate 'uploading' needed
    try {
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
    } catch (error) {
        console.error('Cloudinary Upload Failed:', error);
        toast.error('Image upload failed. Please try again.');
        throw new Error('Image Upload Failed');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    toast.loading('Submitting request...');
    
    try {
        const imageUrls = files.length ? await uploadImages() : [];
        
        await addDoc(collection(db, 'personalization_requests'), {
            ...form,
            referenceImages: imageUrls,
            status: 'Pending',
            createdAt: new Date(),
        });

        toast.dismiss(); // Clear loading
        toast.success('Your request has been sent!');
        setDone(true);

    } catch (err: any) {
        toast.dismiss(); // Clear loading
        toast.error(err.message || 'Submission failed. Please check all fields.');
        console.error('Form submission error:', err);
    } finally {
        setSubmitting(false);
    }
  };

  // The success state UI has been slightly enhanced
  if (done)
    return (
      <div className="min-h-screen bg-[#FAF9F6] pt-32 flex items-center justify-center px-6">
        <div className="max-w-lg text-center p-10 bg-white rounded-xl shadow-2xl">
          <Gift className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
          <h2 className="font-serif text-3xl text-gray-900 mb-4 tracking-wider">REQUEST RECEIVED!</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Thank you for trusting us with your custom project. We’ve received your detailed request and will review it. You can expect a response from our design team within **24 hours**.
          </p>
          <button
            onClick={() => setDone(false)}
            className="inline-block bg-gray-900 text-white px-10 py-3 text-sm tracking-widest font-bold hover:bg-yellow-600 transition-all duration-300 uppercase"
          >
            Make another request
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-gray-800 pt-20">
      
      {/* Hero Section */}
      <section className="max-w-screen-xl mx-auto px-6 sm:px-10 py-16">
        <nav className="text-sm text-gray-500 mb-4">
            <a href="/" className="hover:text-yellow-600 transition">Home</a>
            <span className="mx-2">/</span>
            <span className="text-gray-800 font-medium">Personalize</span>
        </nav>
        <div className="text-center mb-16">
            <h1 className="font-serif text-5xl sm:text-7xl tracking-[0.1em] text-gray-900 mb-4">
                CUSTOM CREATION
            </h1>
            <p className="font-handwritten text-3xl text-yellow-600 mb-8">
                Design Your Dream Piece
            </p>
            <p className="text-gray-700 text-lg max-w-4xl mx-auto leading-relaxed">
                Tell us about your unique vision. Whether it's a specific material, a one-of-a-kind gift, or a corporate order, we bring your personalization concepts to life.
            </p>
        </div>
      </section>

      {/* Form Section with Accordions */}
      <section className="max-w-3xl mx-auto px-6 sm:px-10 pb-24">
        <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* 1. Design & Product Details */}
            <Accordion 
                title="1. Design & Product Details" 
                icon={<Layers className="w-6 h-6 text-yellow-600" />}
                isOpen={openSection === 'design'}
                onToggle={() => setOpenSection(openSection === 'design' ? '' : 'design')}
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Product Type */}
                    <div>
                        <label className="block text-xs font-bold tracking-widest uppercase mb-2">Product Type <span className="text-red-500">*</span></label>
                        <select
                            name="productType"
                            value={form.productType}
                            onChange={handleChange}
                            required
                            className="w-full bg-white border border-gray-300 rounded px-4 py-3 appearance-none focus:outline-none focus:border-gray-900 text-gray-700"
                        >
                            <option value="">Select type of item</option>
                            <option value="fashion">Fashion Item (Clothing/Shoes)</option>
                            <option value="accessory">Accessory (Bags/Jewelry)</option>
                            <option value="home">Home Décor</option>
                            <option value="gift">Gift Item/Hamper</option>
                            <option value="packaging">Branded Packaging</option>
                            <option value="other">Other/Specify in Notes</option>
                        </select>
                    </div>

                    {/* Occasion */}
                    <div>
                        <label className="block text-xs font-bold tracking-widest uppercase mb-2">Occasion (Optional)</label>
                        <input
                            name="occasion"
                            value={form.occasion}
                            onChange={handleChange}
                            placeholder="e.g. Wedding, Birthday, Corporate Gift"
                            className="w-full bg-white border border-gray-300 rounded px-4 py-3 focus:outline-none focus:border-gray-900"
                        />
                    </div>
                </div>

                {/* Detailed Description */}
                <div>
                    <label className="block text-xs font-bold tracking-widest uppercase mb-2">Detailed Description <span className="text-red-500">*</span></label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        required
                        rows={5}
                        placeholder="Describe materials, colors, dimensions, specific text/logos, and your main idea."
                        className="w-full bg-white border border-gray-300 rounded px-4 py-3 focus:outline-none focus:border-gray-900"
                    />
                </div>
            </Accordion>

            {/* 2. Volume & Timeline */}
            <Accordion 
                title="2. Logistics & Budget" 
                icon={<DollarSign className="w-6 h-6 text-yellow-600" />}
                isOpen={openSection === 'details'}
                onToggle={() => setOpenSection(openSection === 'details' ? '' : 'details')}
            >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {/* Quantity */}
                    <div>
                        <label className="block text-xs font-bold tracking-widest uppercase mb-2">Quantity</label>
                        <input
                            name="quantity"
                            value={form.quantity}
                            onChange={handleChange}
                            type="number"
                            min={1}
                            placeholder="1"
                            className="w-full bg-white border border-gray-300 rounded px-4 py-3 focus:outline-none focus:border-gray-900"
                        />
                    </div>
                    {/* Budget */}
                    <div>
                        <label className="block text-xs font-bold tracking-widest uppercase mb-2">Budget (₦)</label>
                        <input
                            name="budget"
                            value={form.budget}
                            onChange={handleChange}
                            type="number"
                            placeholder="e.g. 50,000"
                            className="w-full bg-white border border-gray-300 rounded px-4 py-3 focus:outline-none focus:border-gray-900"
                        />
                    </div>
                    {/* Timeline */}
                    <div>
                        <label className="block text-xs font-bold tracking-widest uppercase mb-2">Target Date</label>
                        <input
                            name="timeline"
                            value={form.timeline}
                            onChange={handleChange}
                            type="date"
                            className="w-full bg-white border border-gray-300 rounded px-4 py-3 focus:outline-none focus:border-gray-900"
                        />
                    </div>
                </div>

                {/* Reference Images */}
                <div>
                    <label className="block text-xs font-bold tracking-widest uppercase mb-2">Reference Images (MAX 5MB per file)</label>
                    <div className="flex items-center space-x-4">
                        <label htmlFor="file-upload" className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-3 text-gray-700 cursor-pointer hover:border-yellow-600 transition">
                            <CloudUpload className="w-5 h-5 mr-2" />
                            {files.length > 0 ? `${files.length} file(s) selected` : 'Choose Files'}
                        </label>
                        <input
                            id="file-upload"
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFiles}
                            className="hidden"
                        />
                    </div>
                    {files.length > 0 && (
                        <p className="text-sm text-gray-500 mt-2">
                            Ready to upload: {files.map(f => f.name).join(', ')}
                        </p>
                    )}
                </div>
                
                {/* Additional Notes */}
                <div>
                    <label className="block text-xs font-bold tracking-widest uppercase mb-2">Additional Notes</label>
                    <textarea
                        name="notes"
                        value={form.notes}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Any extra details, constraints, or delivery information."
                        className="w-full bg-white border border-gray-300 rounded px-4 py-3 focus:outline-none focus:border-gray-900"
                    />
                </div>
            </Accordion>
            
            {/* 3. Contact Information */}
            <Accordion 
                title="3. Contact Information" 
                icon={<User className="w-6 h-6 text-yellow-600" />}
                isOpen={openSection === 'contact'}
                onToggle={() => setOpenSection(openSection === 'contact' ? '' : 'contact')}
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                        <label className="block text-xs font-bold tracking-widest uppercase mb-2">Full Name <span className="text-red-500">*</span></label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className="w-full bg-white border border-gray-300 rounded px-4 py-3 focus:outline-none focus:border-gray-900"
                        />
                    </div>
                    {/* Email */}
                    <div>
                        <label className="block text-xs font-bold tracking-widest uppercase mb-2">Email <span className="text-red-500">*</span></label>
                        <input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="w-full bg-white border border-gray-300 rounded px-4 py-3 focus:outline-none focus:border-gray-900"
                        />
                    </div>
                </div>

                {/* Phone */}
                <div>
                    <label className="block text-xs font-bold tracking-widest uppercase mb-2">Phone Number <span className="text-red-500">*</span></label>
                    <input
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                        required
                        className="w-full bg-white border border-gray-300 rounded px-4 py-3 focus:outline-none focus:border-gray-900"
                    />
                </div>
            </Accordion>


            {/* Submit Button */}
            <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gray-900 text-white py-4 text-lg tracking-[0.2em] font-bold hover:bg-yellow-600 transition disabled:opacity-50 mt-10 uppercase"
            >
                {submitting ? (
                    <span className="flex items-center justify-center">
                        <Clock className="w-5 h-5 mr-2 animate-spin" /> SUBMITTING...
                    </span>
                ) : (
                    'FINALIZE & SUBMIT REQUEST'
                )}
            </button>

        </form>
      </section>
    </div>
  );
}