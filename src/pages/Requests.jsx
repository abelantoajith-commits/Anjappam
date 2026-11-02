import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useToast } from '../components/Toast';
import RequestCapsule from '../components/RequestCapsule';
import ConfirmDialog from '../components/ConfirmDialog';
import { 
  ClipboardList, 
  MapPin, 
  PlusCircle, 
  HeartHandshake, 
  Phone, 
  CheckCircle2, 
  Info,
  Users
} from 'lucide-react';

const KERALA_DISTRICTS = [
  { value: 'all', label: 'All Districts' },
  { value: 'kochi', label: 'Kochi / Ernakulam' },
  { value: 'thrissur', label: 'Thrissur' },
  { value: 'kozhikode', label: 'Kozhikode' },
  { value: 'kottayam', label: 'Kottayam' },
  { value: 'trivandrum', label: 'Trivandrum' },
];

export default function Requests() {
  const { user, isDonor, isReceiver, isVisitor } = useAuth();
  const { requests, acceptRequest, addRequest } = useData();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'urgent' | 'my'
  const [districtFilter, setDistrictFilter] = useState('all');

  // Accept Request Modal State
  const [acceptingRequest, setAcceptingRequest] = useState(null);
  const [revealedContact, setRevealedContact] = useState(null);

  // New Request Modal State (Sized by NUMBER OF PEOPLE)
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [requestForm, setRequestForm] = useState({
    item: '',
    numberOfPeople: '',
    location: '',
    neededByDate: new Date().toISOString().split('T')[0],
    neededByTime: '19:00',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Filter requests
  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      // Tab filter
      if (activeTab === 'urgent') {
        const todayStr = new Date().toISOString().split('T')[0];
        if (r.neededByDate !== todayStr) return false;
      } else if (activeTab === 'my') {
        if (!user || r.receiverId !== user.id) return false;
      }

      // District filter
      if (districtFilter !== 'all') {
        const locLower = r.location.toLowerCase();
        if (districtFilter === 'kochi' && !locLower.includes('kochi') && !locLower.includes('ernakulam') && !locLower.includes('edappally') && !locLower.includes('aluva') && !locLower.includes('kakkanad') && !locLower.includes('kaloor')) {
          return false;
        } else if (districtFilter !== 'kochi' && !locLower.includes(districtFilter)) {
          return false;
        }
      }

      return true;
    });
  }, [requests, activeTab, districtFilter, user]);

  const handleOpenAccept = (request) => {
    if (isVisitor) {
      navigate('/login', { state: { from: { pathname: '/requests' } } });
      return;
    }
    if (!isDonor) {
      addToast('Only registered donor accounts can accept and fulfill requests.', 'info');
      return;
    }
    setAcceptingRequest(request);
  };

  const handleConfirmAccept = async () => {
    if (!acceptingRequest || !user) return;

    try {
      const updated = await acceptRequest(acceptingRequest.id, user);
      addToast('Request accepted! Shelter contact info is displayed below.', 'success');
      setRevealedContact(updated);
      setAcceptingRequest(null);
    } catch (err) {
      addToast(err.message || 'Failed to accept request.', 'error');
      setAcceptingRequest(null);
    }
  };

  const handleOpenPostModal = () => {
    if (isVisitor) {
      navigate('/login', { state: { from: { pathname: '/requests' } } });
      return;
    }
    if (isDonor) {
      addToast('Food requests are posted by receivers and community shelters.', 'info');
      return;
    }
    setPostModalOpen(true);
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!requestForm.item.trim()) errs.item = 'Item name is required.';
    if (!requestForm.numberOfPeople || Number(requestForm.numberOfPeople) <= 0) {
      errs.numberOfPeople = 'Number of people must be greater than 0.';
    }
    if (!requestForm.location.trim()) errs.location = 'Location is required.';
    if (!requestForm.neededByDate) errs.neededByDate = 'Date is required.';
    if (!requestForm.neededByTime) errs.neededByTime = 'Time is required.';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);
    setErrors({});

    try {
      await addRequest({
        receiverId: user.id,
        ...requestForm,
      });

      addToast('New food request posted successfully.', 'success');
      setPostModalOpen(false);
      setRequestForm({
        item: '',
        numberOfPeople: '',
        location: '',
        neededByDate: new Date().toISOString().split('T')[0],
        neededByTime: '19:00',
      });
    } catch (err) {
      addToast(err.message || 'Failed to post request.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-24 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header Section (PRD §8.4) */}
      <section className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-[#E8D9C5] pb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFEADA] text-[#845400] text-xs font-bold uppercase tracking-wider mb-2 border border-[#E8D9C5]">
            <ClipboardList className="w-3.5 h-3.5 text-[#C98A2B]" />
            <span>Community Breadlines & Shelters</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#3B2A1A] tracking-tight">
            Food Requests
          </h1>

          <p className="text-sm sm:text-base text-[#514536] mt-2 max-w-2xl">
            Shelters, orphanages, and community groups requesting urgent meals. Review needs sized by number of people and accept to fulfill them with reverence and care.
          </p>
        </div>

        {/* Post Request button for Receivers */}
        <button
          onClick={handleOpenPostModal}
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#845400] hover:bg-[#643F00] text-white font-sans font-bold text-sm shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post a Request</span>
        </button>
      </section>

      {/* Info Notice Banner */}
      <section className="mb-8 p-5 rounded-3xl bg-[#FFF1E8] border border-[#E8D9C5] flex items-start gap-4">
        <div className="w-9 h-9 rounded-full bg-[#FFEADA] text-[#845400] flex items-center justify-center shrink-0">
          <Info className="w-5 h-5 text-[#C98A2B]" />
        </div>
        <div className="text-xs sm:text-sm text-[#514536] leading-relaxed">
          <p className="font-bold text-[#3B2A1A] mb-0.5">Immediate Contact & Handover Guidance</p>
          <p>
            Direct contact numbers, shelter caretaker details, and delivery addresses are revealed immediately after a food donor clicks <strong className="text-[#845400]">&lsquo;Accept Request&rsquo;</strong>.
          </p>
        </div>
      </section>

      {/* Tabs and Filters */}
      <section className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Tab Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-[#FFF8EE] rounded-full border border-[#E8D9C5] max-w-full overflow-x-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === 'all'
                ? 'bg-[#C98A2B] text-white shadow-sm'
                : 'text-[#514536] hover:bg-white/60'
            }`}
          >
            All Requests ({requests.length})
          </button>

          <button
            onClick={() => setActiveTab('urgent')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === 'urgent'
                ? 'bg-[#C98A2B] text-white shadow-sm'
                : 'text-[#514536] hover:bg-white/60'
            }`}
          >
            Needed Today
          </button>

          {user && (
            <button
              onClick={() => setActiveTab('my')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeTab === 'my'
                  ? 'bg-[#C98A2B] text-white shadow-sm'
                  : 'text-[#514536] hover:bg-white/60'
              }`}
            >
              My Shelter&apos;s Needs
            </button>
          )}
        </div>

        {/* District Filter Dropdown */}
        <div className="relative w-full sm:w-56">
          <MapPin className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#837564]" />
          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="w-full pl-10 pr-8 py-2.5 rounded-full bg-white border border-[#E8D9C5] text-xs font-medium text-[#3B2A1A] focus:outline-none focus:ring-2 focus:ring-[#C98A2B] shadow-sm cursor-pointer"
          >
            {KERALA_DISTRICTS.map((d) => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>
        </div>

      </section>

      {/* Capsule List of Requests */}
      <section className="space-y-4">
        {filteredRequests.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white border border-[#E8D9C5] text-center max-w-lg mx-auto shadow-sm">
            <ClipboardList className="w-12 h-12 text-[#D6C4B1] mx-auto mb-3" />
            <h3 className="font-serif text-xl font-bold text-[#3B2A1A] mb-1">
              No Food Requests Found
            </h3>
            <p className="text-xs sm:text-sm text-[#514536] mb-4">
              {activeTab === 'my'
                ? "Your shelter hasn't submitted any food requests yet."
                : "No matching community food requests found for the selected filter."}
            </p>
            <button
              onClick={handleOpenPostModal}
              className="px-6 py-2.5 rounded-full bg-[#845400] text-white text-xs font-bold shadow-sm hover:bg-[#643F00] transition-colors"
            >
              Post a Food Request
            </button>
          </div>
        ) : (
          filteredRequests.map((request) => (
            <RequestCapsule
              key={request.id}
              request={request}
              onAccept={handleOpenAccept}
            />
          ))
        )}
      </section>

      {/* Accept Confirmation Dialog (PRD §8.4) */}
      {acceptingRequest && (
        <ConfirmDialog
          isOpen={!!acceptingRequest}
          onClose={() => setAcceptingRequest(null)}
          onConfirm={handleConfirmAccept}
          title="Fulfill Community Food Request"
          confirmText="Yes, Accept Request"
          cancelText="Cancel"
          type="primary"
        >
          <div className="space-y-3 pt-2 text-sm text-[#514536]">
            <p>
              You are offering to fulfill the request for <strong>{acceptingRequest.item}</strong> (for <strong>{acceptingRequest.numberOfPeople} people</strong>) from <strong>{acceptingRequest.receiverName}</strong>.
            </p>
            <div className="p-3 bg-[#FFEADA] rounded-2xl border border-[#E8D9C5] text-xs">
              <p className="font-semibold text-[#845400] mb-1">Fulfillment Notice:</p>
              <p>
                By accepting, you pledge to prepare/provide food needed by <strong>{acceptingRequest.neededByDate} at {acceptingRequest.neededByTime}</strong>. Shelter contact person and phone number will be displayed immediately.
              </p>
            </div>
          </div>
        </ConfirmDialog>
      )}

      {/* Post-Accept Contact Info Modal */}
      {revealedContact && (
        <ConfirmDialog
          isOpen={!!revealedContact}
          onClose={() => setRevealedContact(null)}
          title="Request Accepted with Grace!"
          confirmText="Done"
          cancelText="Close"
          type="success"
          onConfirm={() => setRevealedContact(null)}
        >
          <div className="space-y-4 pt-2">
            <div className="p-4 bg-[#CCEEA0]/40 rounded-2xl border border-[#B0D186]">
              <span className="text-xs uppercase font-bold text-[#1E3500] tracking-wider">
                Shelter Caretaker Details
              </span>
              <h4 className="font-serif text-xl font-bold text-[#3B2A1A] mt-1">
                {revealedContact.receiverName}
              </h4>
              {revealedContact.receiverContactName && (
                <p className="text-sm text-[#514536]">Caretaker: {revealedContact.receiverContactName}</p>
              )}
              
              <div className="flex items-center gap-2 mt-3 text-base font-bold text-[#1E3500]">
                <Phone className="w-5 h-5 text-[#5E7B3A]" />
                <a href={`tel:${revealedContact.receiverPhone}`} className="hover:underline">
                  {revealedContact.receiverPhone}
                </a>
              </div>

              <div className="flex items-start gap-2 mt-2 text-xs text-[#514536]">
                <MapPin className="w-4 h-4 text-[#845400] shrink-0 mt-0.5" />
                <span>Delivery / Handover: <strong>{revealedContact.location}</strong></span>
              </div>
            </div>

            <p className="text-xs text-[#514536] italic">
              Please call the shelter caretaker to confirm meal delivery arrangements and dietary specifics.
            </p>
          </div>
        </ConfirmDialog>
      )}

      {/* Post Request Modal (Sized by NUMBER OF PEOPLE) */}
      {postModalOpen && (
        <ConfirmDialog
          isOpen={postModalOpen}
          onClose={() => setPostModalOpen(false)}
          title="Post a Food Request"
          confirmText={submitting ? "Posting..." : "Submit Request"}
          cancelText="Cancel"
          type="primary"
          onConfirm={handleSubmitRequest}
        >
          <div className="space-y-4 pt-2 text-left">
            <div>
              <label htmlFor="modal-item" className="text-xs font-bold text-[#3B2A1A] block mb-1">
                Food Item Needed <span className="text-[#7A2E2E]">*</span>
              </label>
              <input
                id="modal-item"
                type="text"
                placeholder="e.g. Biriyani, Rice & Curry, Chapatis"
                value={requestForm.item}
                onChange={(e) => setRequestForm({ ...requestForm, item: e.target.value })}
                className="w-full px-4 py-2.5 rounded-full bg-[#FFF8EE] border border-[#E8D9C5] text-sm text-[#3B2A1A] focus:outline-none focus:ring-2 focus:ring-[#C98A2B]"
              />
              {errors.item && <p className="text-xs text-[#7A2E2E] mt-1">{errors.item}</p>}
            </div>

            {/* OVERRIDE: NUMBER OF PEOPLE */}
            <div>
              <label htmlFor="modal-people" className="text-xs font-bold text-[#3B2A1A] block mb-1">
                Number of People to Feed <span className="text-[#7A2E2E]">*</span>
              </label>
              <div className="relative">
                <Users className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#837564]" />
                <input
                  id="modal-people"
                  type="number"
                  min="1"
                  placeholder="e.g. 50"
                  value={requestForm.numberOfPeople}
                  onChange={(e) => setRequestForm({ ...requestForm, numberOfPeople: e.target.value })}
                  className="w-full pl-11 pr-4 py-2.5 rounded-full bg-[#FFF8EE] border border-[#E8D9C5] text-sm text-[#3B2A1A] focus:outline-none focus:ring-2 focus:ring-[#C98A2B]"
                />
              </div>
              {errors.numberOfPeople && <p className="text-xs text-[#7A2E2E] mt-1">{errors.numberOfPeople}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="modal-date" className="text-xs font-bold text-[#3B2A1A] block mb-1">
                  Needed-by Date <span className="text-[#7A2E2E]">*</span>
                </label>
                <input
                  id="modal-date"
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={requestForm.neededByDate}
                  onChange={(e) => setRequestForm({ ...requestForm, neededByDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-full bg-[#FFF8EE] border border-[#E8D9C5] text-xs text-[#3B2A1A] focus:outline-none focus:ring-2 focus:ring-[#C98A2B]"
                />
                {errors.neededByDate && <p className="text-xs text-[#7A2E2E] mt-0.5">{errors.neededByDate}</p>}
              </div>

              <div>
                <label htmlFor="modal-time" className="text-xs font-bold text-[#3B2A1A] block mb-1">
                  Needed-by Time <span className="text-[#7A2E2E]">*</span>
                </label>
                <input
                  id="modal-time"
                  type="time"
                  value={requestForm.neededByTime}
                  onChange={(e) => setRequestForm({ ...requestForm, neededByTime: e.target.value })}
                  className="w-full px-3 py-2 rounded-full bg-[#FFF8EE] border border-[#E8D9C5] text-xs text-[#3B2A1A] focus:outline-none focus:ring-2 focus:ring-[#C98A2B]"
                />
                {errors.neededByTime && <p className="text-xs text-[#7A2E2E] mt-0.5">{errors.neededByTime}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="modal-location" className="text-xs font-bold text-[#3B2A1A] block mb-1">
                Shelter Location Address <span className="text-[#7A2E2E]">*</span>
              </label>
              <input
                id="modal-location"
                type="text"
                placeholder="e.g. Kakkanad, Kochi"
                value={requestForm.location}
                onChange={(e) => setRequestForm({ ...requestForm, location: e.target.value })}
                className="w-full px-4 py-2.5 rounded-full bg-[#FFF8EE] border border-[#E8D9C5] text-sm text-[#3B2A1A] focus:outline-none focus:ring-2 focus:ring-[#C98A2B]"
              />
              {errors.location && <p className="text-xs text-[#7A2E2E] mt-1">{errors.location}</p>}
            </div>
          </div>
        </ConfirmDialog>
      )}

    </div>
  );
}

