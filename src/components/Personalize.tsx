import { useState, FormEvent } from 'react';
import { Palette, Grid3x3, Type, Gift, Upload, ChevronDown, ChevronUp } from 'lucide-react';

const galleryImages = [
  { id: 1, image: '/white_jewelry1.jpg', alt: 'Custom jewelry' },
  { id: 2, image: '/silk2.jpg', alt: 'Personalized clothing' },
  { id: 3, image: '/box1.jpg', alt: 'Custom packaging' },
  { id: 4, image: '/bowl1.webp', alt: 'Engraved items' },
];

const customizationOptions = [
  { icon: Palette, title: 'Color Swatches', description: 'Choose from our curated color palette' },
  { icon: Grid3x3, title: 'Material Selection', description: 'Select premium materials for your product' },
  { icon: Type, title: 'Text Engraving', description: 'Add personalized text or monograms' },
  { icon: Gift, title: 'Gift Packaging', description: 'Beautiful wrapping for special occasions' },
];

const faqs = [
  {
    question: 'How long does a custom order typically take?',
    answer:
      "Custom orders typically take 2-4 weeks depending on complexity. We'll provide a specific timeline when you submit your request.",
  },
  {
    question: 'Can I provide my own materials for customization?',
    answer:
      'Yes! We welcome customer-provided materials. Please contact us first to discuss compatibility and any additional fees.',
  },
  {
    question: 'What is the revision policy for custom designs?',
    answer:
      'We offer up to 2 free design revisions. Additional revisions may incur a small fee depending on the scope of changes.',
  },
  {
    question: 'Do you offer international shipping for custom orders?',
    answer:
      'Yes, we ship internationally. Shipping costs and delivery times vary by location. Contact us for a quote.',
  },
  {
    question: 'What payment methods do you accept for custom orders?',
    answer:
      'We accept all major payment methods including bank transfers, cards via Paystack, and installment plans for larger orders.',
  },
];

export default function Personalize() {
  const [formData, setFormData] = useState({
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    alert("Thank you! Your customization request has been submitted. We'll contact you within 24 hours.");

    setFormData({
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
    setSelectedFile(null);
    setIsSubmitting(false);
  };

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-gray-800 pt-20">
      {/* Hero Section */}
      <section className="max-w-screen-xl mx-auto px-6 sm:px-10 py-12">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-8" aria-label="Breadcrumb" data-aos="fade-down">
          <a href="/" className="hover:text-yellow-600 transition-colors">
            Home
          </a>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-800 font-medium">Personalize</span>
        </nav>

        {/* Title */}
        <div className="text-center mb-16" data-aos="fade-up">
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl tracking-[0.15em] text-gray-900 mb-4">
            PERSONALIZE
          </h1>
          <p className="text-2xl text-yellow-600 italic font-light mb-6">Make It Uniquely Yours</p>
          <p className="text-gray-700 text-lg max-w-3xl mx-auto leading-relaxed">
            Unlock endless possibilities to create products that truly reflect your style and story. From bespoke designs
            to unique engravings, our personalization service allows you to transform ordinary items into extraordinary
            keepsakes. Share your vision with us, and let our artisans bring it to life with unparalleled craftsmanship.
          </p>
        </div>
      </section>

      {/* Customization Gallery */}
      <section className="max-w-screen-xl mx-auto px-6 sm:px-10 py-16">
        <h2
          className="font-serif text-3xl sm:text-4xl tracking-[0.15em] text-gray-900 text-center mb-12"
          data-aos="fade-up"
        >
          Customization Gallery
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {galleryImages.map((item, index) => (
            <div
              key={item.id}
              className="aspect-square rounded-lg overflow-hidden group"
              data-aos="zoom-in"
              data-aos-delay={index * 100}
            >
              <img
                src={item.image}
                alt={item.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Customization Options */}
      <section className="max-w-screen-xl mx-auto px-6 sm:px-10 py-16">
        <h2
          className="font-serif text-3xl sm:text-4xl tracking-[0.15em] text-gray-900 text-center mb-12"
          data-aos="fade-up"
        >
          Popular Customization Options
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {customizationOptions.map((option, index) => (
            <div
              key={option.title}
              className="text-center group"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-600/10 mb-4 group-hover:bg-yellow-600 transition-colors">
                <option.icon className="w-8 h-8 text-yellow-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-gray-900 text-lg font-semibold mb-2">{option.title}</h3>
              <p className="text-gray-600 text-sm">{option.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Custom Order Request Form */}
      <section className="max-w-3xl mx-auto px-6 sm:px-10 py-16" data-aos="fade-up">
        <h2 className="font-serif text-3xl sm:text-4xl tracking-[0.15em] text-gray-900 text-center mb-12">
          Custom Order Request
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Type */}
          <div>
            <label htmlFor="productType" className="block text-gray-700 text-sm tracking-wider mb-2">
              Product Type <span className="text-yellow-600">*</span>
            </label>
            <select
              id="productType"
              name="productType"
              value={formData.productType}
              onChange={handleInputChange}
              required
              className="w-full bg-white border border-gray-300 rounded px-4 py-3 text-gray-800 focus:outline-none focus:border-yellow-600 focus:ring-1 focus:ring-yellow-600"
            >
              <option value="">e.g., Ring, Bracelet, Jacket, Wall Art</option>
              <option value="fashion">Fashion Item</option>
              <option value="accessory">Accessory</option>
              <option value="home">Home Décor</option>
              <option value="gift">Gift Item</option>
              <option value="packaging">Packaging</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-gray-700 text-sm tracking-wider mb-2">
              Detailed Description <span className="text-yellow-600">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              placeholder="Describe your vision, materials, desired features, and aesthetic preferences in detail."
              className="w-full bg-white border border-gray-300 rounded px-4 py-3 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-yellow-600 focus:ring-1 focus:ring-yellow-600"
            />
          </div>

          {/* Additional form fields remain identical with light styles... */}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-yellow-600 text-white py-4 text-sm tracking-[0.2em] font-bold hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'SUBMITTING...' : 'SUBMIT CUSTOMIZATION REQUEST'}
          </button>
        </form>
      </section>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto px-6 sm:px-10 py-16">
        <h2
          className="font-serif text-3xl sm:text-4xl tracking-[0.15em] text-gray-900 text-center mb-4"
          data-aos="fade-up"
        >
          Frequently Asked Questions
        </h2>
        <p className="text-gray-600 text-center mb-12" data-aos="fade-up" data-aos-delay="100">
          Trusted by thousands of satisfied customers for unique and personalized creations.
        </p>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden"
              data-aos="fade-up"
              data-aos-delay={index * 50}
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-yellow-50 transition-colors"
              >
                <span className="text-gray-900 font-medium pr-4">{faq.question}</span>
                {expandedFaq === index ? (
                  <ChevronUp className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                )}
              </button>
              {expandedFaq === index && (
                <div className="px-6 pb-6">
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
