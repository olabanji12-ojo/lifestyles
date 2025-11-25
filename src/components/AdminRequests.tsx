// src/pages/admin/AdminRequests.tsx
import { useState, useEffect } from 'react';
import { Mail, Phone, Image as ImageIcon, Clock, Loader2, MessageSquare, CheckCircle, DollarSign } from 'lucide-react';
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
    New: 'bg-blue-500/20 text-blue-400',
    Quoted: 'bg-yellow-500/20 text-yellow-400',
    Approved: 'bg-green-500/20 text-green-400',
    'In Progress': 'bg-purple-500/20 text-purple-400',
    Completed: 'bg-green-600/20 text-green-300',
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
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif mb-2">Personalization Requests</h1>
          <p className="text-gray-400">Manage custom order requests from customers</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {Object.entries(groupedRequests).map(([status, reqs]) => (
            <div key={status} className="bg-white/5 border border-white/10 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">{status}</p>
              <p className="text-2xl font-bold">{reqs.length}</p>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="mb-6">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-6 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-600"
          >
            <option value="All">All Requests</option>
            <option value="New">New</option>
            <option value="Quoted">Quoted</option>
            <option value="Approved">Approved</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Requests List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-12 h-12 animate-spin text-yellow-600" />
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="text-center py-16">
            <MessageSquare className="w-16 h-16 mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400">No requests found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredRequests.map(req => (
              <div 
                key={req.id} 
                className="bg-white/5 border-l-4 border-yellow-600 rounded-xl p-8"
              >
                <div className="flex flex-col lg:flex-row lg:justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold mb-1">{req.customerName}</h3>
                        <p className="text-sm text-gray-400">
                          {req.createdAt?.toDate?.().toLocaleDateString() || 'N/A'}
                        </p>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm font-bold ${statusColors[req.status]}`}>
                        {req.status}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Product Type</p>
                        <p className="font-medium text-lg">{req.productType}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Description</p>
                        <p className="font-medium italic">"{req.description}"</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-6 mb-6">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <span className="text-sm">{req.customerEmail}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <span className="text-sm">{req.customerPhone}</span>
                      </div>
                      {req.imageUrl && (
                        <a 
                          href={req.imageUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 text-yellow-600 hover:text-yellow-500"
                        >
                          <ImageIcon className="w-5 h-5" />
                          <span className="text-sm">View Reference Image</span>
                        </a>
                      )}
                    </div>

                    {/* Quote Details */}
                    {req.quotedPrice && (
                      <div className="bg-white/5 rounded-lg p-4 space-y-2">
                        <p><span className="text-gray-400">Quoted Price:</span> <span className="text-yellow-600 font-bold">₦{req.quotedPrice.toLocaleString()}</span></p>
                        {req.estimatedDays && (
                          <p><span className="text-gray-400">Estimated Days:</span> {req.estimatedDays} days</p>
                        )}
                        {req.adminNotes && (
                          <p><span className="text-gray-400">Notes:</span> {req.adminNotes}</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-3">
                    {req.status === 'New' && (
                      <button 
                        onClick={() => openQuoteModal(req)}
                        className="bg-yellow-600 text-black px-6 py-3 rounded-full hover:bg-yellow-500 transition font-medium flex items-center justify-center gap-2"
                      >
                        <DollarSign className="w-5 h-5" /> Send Quote
                      </button>
                    )}
                    
                    {req.status === 'Quoted' && (
                      <button 
                        onClick={() => handleStatusUpdate(req.id!, 'Approved')}
                        className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-500 transition font-medium flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-5 h-5" /> Mark Approved
                      </button>
                    )}
                    
                    {req.status === 'Approved' && (
                      <button 
                        onClick={() => handleStatusUpdate(req.id!, 'In Progress')}
                        className="bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-500 transition font-medium flex items-center justify-center gap-2"
                      >
                        <Clock className="w-5 h-5" /> Start Work
                      </button>
                    )}
                    
                    {req.status === 'In Progress' && (
                      <button 
                        onClick={() => handleStatusUpdate(req.id!, 'Completed')}
                        className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-500 transition font-medium flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-5 h-5" /> Mark Complete
                      </button>
                    )}
                    
                    <a 
                      href={`mailto:${req.customerEmail}`}
                      className="border border-white/20 px-6 py-3 rounded-full hover:border-yellow-600 hover:text-yellow-600 transition text-center flex items-center justify-center gap-2"
                    >
                      <Mail className="w-5 h-5" /> Email Customer
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quote Modal */}
        {showQuoteModal && selectedRequest && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-2xl max-w-2xl w-full">
              <div className="border-b border-white/10 px-8 py-6">
                <h2 className="text-2xl font-bold">Send Quote to {selectedRequest.customerName}</h2>
              </div>

              <div className="p-8 space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Quoted Price (₦)</label>
                  <input
                    type="number"
                    min="0"
                    value={quotePrice}
                    onChange={(e) => setQuotePrice(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-600"
                    placeholder="e.g., 50000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Estimated Completion (Days)</label>
                  <input
                    type="number"
                    min="0"
                    value={estimatedDays}
                    onChange={(e) => setEstimatedDays(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-600"
                    placeholder="e.g., 7"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Additional Notes (Optional)</label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-600"
                    placeholder="Any special instructions or requirements..."
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={submitQuote}
                    disabled={submitting || quotePrice === 0}
                    className="flex-1 bg-yellow-600 text-black py-4 rounded-lg font-bold hover:bg-yellow-500 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <DollarSign className="w-5 h-5" />
                        Send Quote
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setShowQuoteModal(false)}
                    className="px-8 py-4 border border-white/20 rounded-lg hover:border-yellow-600 transition"
                  >
                    Cancel
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