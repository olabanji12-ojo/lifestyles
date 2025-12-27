// src/pages/admin/AdminRequests.tsx
import { useState, useEffect } from 'react';
import { Mail, Phone, Image as ImageIcon, Clock, Loader2, MessageSquare, CheckCircle, DollarSign, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import { getPersonalizationRequests, updateRequestStatus, PersonalizationRequest } from '../firebase/helpers';

export default function AdminRequests() {
  const [requests, setRequests] = useState<PersonalizationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<PersonalizationRequest | null>(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Quote form
  const [quotePrice, setQuotePrice] = useState(0);
  const [estimatedDays, setEstimatedDays] = useState(0);
  const [adminNotes, setAdminNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const statusColors: Record<PersonalizationRequest['status'], string> = {
    New: 'bg-sky-50 text-sky-700 border border-sky-100',
    Quoted: 'bg-amber-50 text-amber-700 border border-amber-100',
    Approved: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
    'In Progress': 'bg-indigo-50 text-indigo-700 border border-indigo-100',
    Completed: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    const result = await getPersonalizationRequests();
    if (result.success) {
      setRequests(result.requests);
    } else {
      toast.error('Failed to load requests');
    }
    setLoading(false);
  };

  const handleStatusUpdate = async (requestId: string, newStatus: PersonalizationRequest['status'], additionalData?: Partial<PersonalizationRequest>) => {
    setSubmitting(true);
    const result = await updateRequestStatus(requestId, {
      status: newStatus,
      ...additionalData,
    });

    if (result.success) {
      toast.success(`Request status updated to ${newStatus}`);
      fetchRequests();
      setShowQuoteModal(false);
      setSelectedRequest(null);
    } else {
      toast.error('Failed to update request');
    }
    setSubmitting(false);
  };

  const openQuoteModal = (request: PersonalizationRequest) => {
    setSelectedRequest(request);
    setQuotePrice(request.quotedPrice || 0);
    setEstimatedDays(request.estimatedDays || 0);
    setAdminNotes(request.adminNotes || '');
    setShowQuoteModal(true);
  };

  const submitQuote = () => {
    if (!selectedRequest) return;

    handleStatusUpdate(selectedRequest.id!, 'Quoted', {
      quotedPrice: quotePrice,
      estimatedDays: estimatedDays,
      adminNotes: adminNotes,
    });
  };

  // Filter requests
  const filteredRequests = requests.filter(req => {
    return statusFilter === 'All' || req.status === statusFilter;
  });

  // Group by status (Kanban style)
  const groupedRequests = {
    New: filteredRequests.filter(r => r.status === 'New'),
    Quoted: filteredRequests.filter(r => r.status === 'Quoted'),
    Approved: filteredRequests.filter(r => r.status === 'Approved'),
    'In Progress': filteredRequests.filter(r => r.status === 'In Progress'),
    Completed: filteredRequests.filter(r => r.status === 'Completed'),
  };

  return (
    <div className="min-h-screen bg-cream-100 text-gray-900 pt-24 font-sans-serif">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-serif mb-4 tracking-tight">Crafting Inquiries</h1>
          <p className="text-gray-500 font-sans-serif tracking-widest uppercase text-[10px] font-bold">Bespoke Requests & Personalization</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-12">
          {Object.entries(groupedRequests).map(([status, reqs]) => (
            <div key={status} className="bg-white border border-gray-100 shadow-soft p-6">
              <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold mb-2">{status}</p>
              <p className="text-4xl font-serif">{reqs.length}</p>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="mb-12">
          <div className="inline-flex bg-white border border-gray-100 shadow-soft px-6 py-4 items-center gap-3">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent focus:outline-none text-xs font-bold uppercase tracking-widest text-gray-600 appearance-none pr-8 cursor-pointer"
            >
              <option value="All">All Requests</option>
              <option value="New">New</option>
              <option value="Quoted">Quoted</option>
              <option value="Approved">Approved</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Requests List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-12 h-12 animate-spin text-gold-600" />
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="text-center py-24 bg-white border border-gray-50 shadow-soft">
            <MessageSquare className="w-12 h-12 mx-auto text-gray-200 mb-6" />
            <p className="text-gray-400 font-serif italic text-lg">No inquiries found in this collection.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {filteredRequests.map(req => (
              <div
                key={req.id}
                className="bg-white border-l-8 border-gold-600 shadow-soft p-10 hover:shadow-premium transition-all duration-500"
              >
                <div className="flex flex-col lg:flex-row lg:justify-between gap-12">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-8">
                      <div>
                        <h3 className="text-3xl font-serif text-gray-900 mb-2">{req.customerName}</h3>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                          Received on {req.createdAt?.toDate?.().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) || 'N/A'}
                        </p>
                      </div>
                      <span className={`px-5 py-2 text-[10px] font-bold tracking-widest uppercase ${statusColors[req.status]}`}>
                        {req.status}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-10 mb-10">
                      <div>
                        <p className="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-2">Subject</p>
                        <p className="font-serif text-xl border-b border-gray-50 pb-2">{req.productType}</p>
                      </div>
                      <div>
                        <p className="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-2">Creative Vision</p>
                        <p className="text-sm font-sans-serif text-gray-600 italic leading-relaxed">"{req.description}"</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-10 mb-10 border-t border-gray-50 pt-8">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-50 flex items-center justify-center text-gray-400">
                          <Mail className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-gray-600 tracking-wider">{req.customerEmail}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-50 flex items-center justify-center text-gray-400">
                          <Phone className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-gray-600 tracking-wider">{req.customerPhone}</span>
                      </div>
                      {req.imageUrl && (
                        <a
                          href={req.imageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-4 text-gold-600 hover:text-gold-700 transition-colors"
                        >
                          <div className="w-10 h-10 bg-gold-50 flex items-center justify-center text-gold-600">
                            <ImageIcon className="w-4 h-4" />
                          </div>
                          <span className="text-xs font-bold uppercase tracking-widest">Visual Reference</span>
                        </a>
                      )}
                    </div>

                    {/* Quote Details */}
                    {req.quotedPrice && (
                      <div className="bg-gray-50 p-8 border border-gray-100">
                        <div className="grid md:grid-cols-3 gap-8">
                          <div>
                            <p className="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-1">Quoted Valuation</p>
                            <p className="text-2xl font-serif text-gray-900">₦{req.quotedPrice.toLocaleString()}</p>
                          </div>
                          {req.estimatedDays && (
                            <div>
                              <p className="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-1">Estimated Timeline</p>
                              <p className="text-lg font-serif text-gray-900">{req.estimatedDays} Days</p>
                            </div>
                          )}
                          {req.adminNotes && (
                            <div className="md:col-span-1">
                              <p className="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-1">Studio Notes</p>
                              <p className="text-xs text-gray-500 italic">{req.adminNotes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-3 lg:border-l lg:border-gray-50 lg:pl-10 lg:w-64">
                    {req.status === 'New' && (
                      <button
                        onClick={() => openQuoteModal(req)}
                        className="w-full bg-gray-900 text-white px-8 py-5 text-[10px] font-bold tracking-widest uppercase hover:bg-gold-600 transition-all flex items-center justify-center gap-2 shadow-soft"
                      >
                        <DollarSign className="w-4 h-4" /> Send Appraisal
                      </button>
                    )}

                    {req.status === 'Quoted' && (
                      <button
                        onClick={() => handleStatusUpdate(req.id!, 'Approved')}
                        className="w-full bg-emerald-600 text-white px-8 py-5 text-[10px] font-bold tracking-widest uppercase hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-soft"
                      >
                        <CheckCircle className="w-4 h-4" /> Approve Concept
                      </button>
                    )}

                    {req.status === 'Approved' && (
                      <button
                        onClick={() => handleStatusUpdate(req.id!, 'In Progress')}
                        className="w-full bg-indigo-600 text-white px-8 py-5 text-[10px] font-bold tracking-widest uppercase hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-soft"
                      >
                        <Clock className="w-4 h-4" /> Initiate Crafting
                      </button>
                    )}

                    {req.status === 'In Progress' && (
                      <button
                        onClick={() => handleStatusUpdate(req.id!, 'Completed')}
                        className="w-full bg-emerald-600 text-white px-8 py-5 text-[10px] font-bold tracking-widest uppercase hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-soft"
                      >
                        <CheckCircle className="w-4 h-4" /> Finalize Work
                      </button>
                    )}

                    <a
                      href={`mailto:${req.customerEmail}`}
                      className="w-full border border-gray-100 bg-white px-8 py-5 text-[10px] font-bold tracking-widest uppercase text-gray-500 hover:text-gray-900 hover:border-gray-300 transition-all text-center flex items-center justify-center gap-2 shadow-soft"
                    >
                      <Mail className="w-4 h-4" /> Communication
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quote Modal */}
        {showQuoteModal && selectedRequest && (
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-6">
            <div className="bg-white shadow-premium max-w-2xl w-full border border-gray-100">
              <div className="border-b border-gray-50 px-10 py-8">
                <span className="text-[10px] tracking-[0.4em] text-gold-600 font-bold uppercase mb-2 block">Project Appraisal</span>
                <h2 className="text-3xl font-serif text-gray-900">Quote for {selectedRequest.customerName}</h2>
              </div>

              <div className="p-10 space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-2">Valuation (₦)</label>
                    <input
                      type="number"
                      min="0"
                      value={quotePrice}
                      onChange={(e) => setQuotePrice(Number(e.target.value))}
                      className="w-full px-5 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-gold-300 transition-all outline-none font-serif text-lg"
                      placeholder="50,000"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-2">Timeline (Days)</label>
                    <input
                      type="number"
                      min="0"
                      value={estimatedDays}
                      onChange={(e) => setEstimatedDays(Number(e.target.value))}
                      className="w-full px-5 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-gold-300 transition-all outline-none font-serif text-lg"
                      placeholder="7"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-2">Studio Disclosures</label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={4}
                    className="w-full px-5 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-gold-300 transition-all outline-none font-sans-serif text-sm italic"
                    placeholder="Specific requirements or creative constraints..."
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={submitQuote}
                    disabled={submitting || quotePrice === 0}
                    className="flex-1 bg-gray-900 text-white py-5 text-[10px] font-bold tracking-widest uppercase hover:bg-gold-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-premium"
                  >
                    {submitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <DollarSign className="w-4 h-4" />
                    )}
                    Dispatch Appraisal
                  </button>
                  <button
                    onClick={() => setShowQuoteModal(false)}
                    className="px-10 py-5 border border-gray-100 text-[10px] font-bold tracking-widest uppercase text-gray-400 hover:text-gray-900 hover:border-gray-300 transition-all"
                  >
                    Retract
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
