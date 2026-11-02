import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useToast } from '../components/Toast';
import DonationCapsule from '../components/DonationCapsule';
import ConfirmDialog from '../components/ConfirmDialog';
import { 
  UtensilsCrossed, 
  Search, 
  MapPin, 
  Clock, 
  PlusCircle, 
  AlertCircle, 
  Phone, 
  User, 
  Calendar, 
  CheckCircle2,
  Users
} from 'lucide-react';

const KERALA_DISTRICTS = [
  { value: 'all', label: 'All Kerala' },
  { value: 'kochi', label: 'Kochi / Ernakulam' },
  { value: 'thrissur', label: 'Thrissur' },
  { value: 'kozhikode', label: 'Kozhikode' },
  { value: 'kottayam', label: 'Kottayam' },
  { value: 'trivandrum', label: 'Trivandrum' },
];

export default function Receive() {
  const { user, isDonor, isReceiver, isVisitor } = useAuth();
  const { donations, acceptDonation, addRequest } = useData();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [districtFilter, setDistrictFilter] = useState('all');
  const [urgencyFilter, setUrgencyFilter] = useState('all');

  // Accept Donation Modal State
  const [acceptingDonation, setAcceptingDonation] = useState(null);
  const [acceptedContactInfo, setAcceptedContactInfo] = useState(null);

  // Request Food Modal State (Sized by NUMBER OF PEOPLE - PRD Override)
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [requestForm, setRequestForm] = useState({
    item: '',
    numberOfPeople: '',
    location: '',
    neededByDate: new Date().toISOString().split('T')[0],
    neededByTime: '19:00',
  });
  const [requestErrors, setRequestErrors] = useState({});
  const [submittingRequest, setSubmittingRequest] = useState(false);

  // Filter donations: available only, non-expired
  const filteredDonations = useMemo(() => {
    return donations.filter((d) => {
      // Must be currently available and not expired
      if (d.status !== 'available') return false;

      // Search match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const itemMatch = d.item.toLowerCase().includes(query);
        const locMatch = d.location.toLowerCase().includes(query);
        if (!itemMatch && !locMatch) return false;
      }

      // District match
      if (districtFilter !== 'all') {
        const locLower = d.location.toLowerCase();
        if (districtFilter === 'kochi' && !locLower.includes('kochi') && !locLower.includes('ernakulam') && !locLower.includes('edappally') && !locLower.includes('aluva') && !locLower.includes('kakkanad') && !locLower.includes('kaloor')) {
          return false;
        } else if (districtFilter !== 'kochi' && !locLower.includes(districtFilter)) {
          return false;
        }
      }

      // Urgency filter
      if (urgencyFilter === 'today') {
        const todayStr = new Date().toISOString().split('T')[0];
        if (d.date !== todayStr) return false;
      }

      return true;
    });
  }, [donations, searchQuery, districtFilter, urgencyFilter]);

  const handleOpenAccept = (donation) => {
    if (isVisitor) {
      navigate('/login', { state: { from: { pathname: '/receive' } } });
      return;
    }
    if (isDonor) {
      addToast('Only registered receiver accounts can accept food donations.', 'info');
      return;
    }
    setAcceptingDonation(donation);
  };

  const handleConfirmAccept = async () => {
    if (!acceptingDonation || !user) return;

    try {
      const updated = await acceptDonation(acceptingDonation.id, user);
      addToast('Blessing accepted! Donor contact details are revealed below.', 'success');
      setAcceptedContactInfo(updated);
      setAcceptingDonation(null);
    } catch (err) {
      addToast(err.message || 'Failed to accept donation.', 'error');
      setAcceptingDonation(null);
    }
  };

  // Handle Request Food Submission
  const handleOpenRequestModal = () => {
    if (isVisitor) {
      navigate('/login', { state: { from: { pathname: '/receive' } } });
      return;
    }
    if (isDonor) {
      addToast('Food requests are placed by shelters and receivers.', 'info');
      return;
    }
    setRequestModalOpen(true);
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!requestForm.item.trim()) errs.item = 'Item name is required.';
    if (!requestForm.numberOfPeople || Number(requestForm.numberOfPeople) <= 0) {
      errs.numberOfPeople = 'Number of people must be greater than 0.';
    }
    if (!requestForm.location.trim()) errs.location = 'Location address is required.';
    if (!requestForm.neededByDate) errs.neededByDate = 'Date is required.';
    if (!requestForm.neededByTime) errs.neededByTime = 'Time is required.';

    if (Object.keys(errs).length > 0) {
      setRequestErrors(errs);
      return;
    }

    setSubmittingRequest(true);
    setRequestErrors({});

    try {
      await addRequest({
        receiverId: user.id,
        ...requestForm,
      });

      addToast('Your food request has been posted to the Requests Board.', 'success');
      setRequestModalOpen(false);
      setRequestForm({
        item: '',
        numberOfPeople: '',
        location: '',
        neededByDate: new Date().toISOString().split('T')[0],
        neededByTime: '19:00',
      });
      navigate('/requests');
    } catch (err) {
      addToast(err.message || 'Failed to submit request.', 'error');
    } finally {
      setSubmittingRequest(false);
    }
  };

  return (
    <div className="pt-24 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header (PRD §8.3) */}
      <section className="mb-10 text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-[#E8D9C5] pb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#CCEEA0]/60 text-[#1E3500] text-xs font-bold uppercase tracking-wider mb-2 border border-[#B0D186]">
            <UtensilsCrossed className="w-3.5 h-3.5 text-[#5E7B3A]" />
            <span>Open Table of Grace</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#3B2A1A] tracking-tight">
            Food Available Near You
          </h1>
          <p className="text-sm sm:text-base text-[#514536] mt-2 max-w-2xl">
            Browse freshly prepared surplus offerings pledged by warmhearted caterers, restaurants, and bakeries across Kerala.
          </p>
        </div>

        {/* Request Food CTA button (PRD §8.3) */}
        <button
          onClick={handleOpenRequestModal}
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#C98A2B] hover:bg-[#845400] text-white font-sans font-bold text-sm shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Request Food</span>
        </button>
      </section>

      {/* Filter and Search Bar */}
      <section className="mb-8 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          
          {/* Search Input */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#837564]" />
            <input
              type="text"
              placeholder="Search by meal name or locality..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-full bg-white border border-[#E8D9C5] text-sm text-[#3B2A1A] placeholder-[#837564]/70 focus:outline-none focus:ring-2 focus:ring-[#C98A2B] shadow-sm"
            />
          </div>

          {/* District Dropdown */}
          <div className="sm:col-span-3 relative">
            <MapPin className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#837564]" />
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="w-full pl-10 pr-8 py-3 rounded-full bg-white border border-[#E8D9C5] text-sm text-[#3B2A1A] focus:outline-none focus:ring-2 focus:ring-[#C98A2B] shadow-sm cursor-pointer"
            >
              {KERALA_DISTRICTS.map((d) => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
          </div>

          {/* Urgency Dropdown */}
          <div className="sm:col-span-3 relative">
            <Clock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#837564]" />
            <select
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
              className="w-full pl-10 pr-8 py-3 rounded-full bg-white border border-[#E8D9C5] text-sm text-[#3B2A1A] focus:outline-none focus:ring-2 focus:ring-[#C98A2B] shadow-sm cursor-pointer"
            >
              <option value="all">Any Urgency</option>
              <option value="today">Available Today</option>
            </select>
          </div>

        </div>

        {/* Quick info chip */}
        <div className="flex items-center justify-between text-xs text-[#837564] px-1">
          <span>Showing {filteredDonations.length} available donation offering(s)</span>
          {isDonor && (
            <span className="text-[#845400] font-medium bg-[#FFEADA] px-2.5 py-0.5 rounded-full">
              Logged in as Donor (Accept disabled)
            </span>
          )}
        </div>
      </section>

      {/* Available Donations Capsule List */}
      <section className="space-y-4">
        {filteredDonations.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white border border-[#E8D9C5] text-center max-w-lg mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#FFEADA] text-[#C98A2B] flex items-center justify-center mx-auto mb-4">
              <UtensilsCrossed className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#3B2A1A] mb-2">
              No Surplus Food Currently Available
            </h3>
            <p className="text-sm text-[#514536] mb-6 leading-relaxed">
              All posted food donations in this locality have been claimed or expired. If your shelter is in immediate need, post a food request so generous donors can respond.
            </p>
            <button
              onClick={handleOpenRequestModal}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#C98A2B] text-white font-bold text-sm shadow-md hover:bg-[#845400] transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post a Food Request</span>
            </button>
          </div>
        ) : (
          filteredDonations.map((donation) => (
            <DonationCapsule
              key={donation.id}
              donation={donation}
              onAccept={handleOpenAccept}
            />
          ))
        )}
      </section>

      {/* Accept Confirmation Dialog (PRD §8.3) */}
      {acceptingDonation && (
        <ConfirmDialog
          isOpen={!!acceptingDonation}
          onClose={() => setAcceptingDonation(null)}
          onConfirm={handleConfirmAccept}
          title="Accept Food Offering"
          confirmText="Yes, Accept & View Contact"
          cancelText="Cancel"
          type="success"
        >
          <div className="space-y-3 pt-2 text-sm text-[#514536]">
            <p>
              You are about to accept <strong>{acceptingDonation.item}</strong> ({acceptingDonation.quantity} {acceptingDonation.unit.toLowerCase()}) located at <strong>{acceptingDonation.location}</strong>.
            </p>
            <div className="p-3 bg-[#FFF1E8] rounded-2xl border border-[#E8D9C5] text-xs">
              <p className="font-semibold text-[#845400] mb-1">Pickup Commitment:</p>
              <p>
                By clicking accept, you commit to arranging pickup by <strong>{acceptingDonation.date} at {acceptingDonation.time}</strong>. The donor&apos;s phone number and direct address will be shown immediately.
              </p>
            </div>
          </div>
        </ConfirmDialog>
      )}

      {/* Post-Accept Contact Info Card Modal */}
      {acceptedContactInfo && (
        <ConfirmDialog
          isOpen={!!acceptedContactInfo}
          onClose={() => setAcceptedContactInfo(null)}
          title="Donation Accepted with Gratitude!"
          confirmText="Done"
          cancelText="Close"
          type="success"
          onConfirm={() => setAcceptedContactInfo(null)}
        >
          <div className="space-y-4 pt-2">
            <div className="p-4 bg-[#CCEEA0]/40 rounded-2xl border border-[#B0D186]">
              <span className="text-xs uppercase font-bold text-[#1E3500] tracking-wider">
                Direct Donor Contact Details
              </span>
              <h4 className="font-serif text-xl font-bold text-[#3B2A1A] mt-1">
                {acceptedContactInfo.donorName}
              </h4>
              {acceptedContactInfo.donorContactName && (
                <p className="text-sm text-[#514536]">Contact: {acceptedContactInfo.donorContactName}</p>
              )}
              
              <div className="flex items-center gap-2 mt-3 text-base font-bold text-[#1E3500]">
                <Phone className="w-5 h-5 text-[#5E7B3A]" />
                <a href={`tel:${acceptedContactInfo.donorPhone}`} className="hover:underline">
                  {acceptedContactInfo.donorPhone}
                </a>
              </div>

              <div className="flex items-start gap-2 mt-2 text-xs text-[#514536]">
                <MapPin className="w-4 h-4 text-[#845400] shrink-0 mt-0.5" />
                <span>Pickup Address: <strong>{acceptedContactInfo.location}</strong></span>
              </div>
            </div>

            <p className="text-xs text-[#514536] italic">
              Please contact the donor right away to coordinate the collection time and thank them for their kindness!
            </p>
          </div>
        </ConfirmDialog>
      )}

      {/* Request Food Modal (OVERRIDE: Sized by NUMBER OF PEOPLE) */}
      {requestModalOpen && (
        <ConfirmDialog
          isOpen={requestModalOpen}
          onClose={() => setRequestModalOpen(false)}
          title="Post a Food Request"
          confirmText={submittingRequest ? "Submitting..." : "Submit Request"}
          cancelText="Cancel"
          type="primary"
          onConfirm={handleSubmitRequest}
        >
          <div className="space-y-4 pt-2 text-left">
            <p className="text-xs text-[#514536]">
              Specify the meal requirements for your shelter or institution. Sized by number of people.
            </p>

            <div>
              <label htmlFor="req-item" className="text-xs font-bold text-[#3B2A1A] block mb-1">
                Food Item Needed <span className="text-[#7A2E2E]">*</span>
              </label>
              <input
                id="req-item"
                type="text"
                placeholder="e.g. Biriyani, Rice & Vegetable Curry, Chapatis"
                value={requestForm.item}
                onChange={(e) => setRequestForm({ ...requestForm, item: e.target.value })}
                className="w-full px-4 py-2.5 rounded-full bg-[#FFF8EE] border border-[#E8D9C5] text-sm text-[#3B2A1A] focus:outline-none focus:ring-2 focus:ring-[#C98A2B]"
              />
              {requestErrors.item && <p className="text-xs text-[#7A2E2E] mt-1">{requestErrors.item}</p>}
            </div>

            {/* OVERRIDE: NUMBER OF PEOPLE */}
            <div>
              <label htmlFor="req-people" className="text-xs font-bold text-[#3B2A1A] block mb-1">
                Number of People to Feed <span className="text-[#7A2E2E]">*</span>
              </label>
              <div className="relative">
                <Users className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#837564]" />
                <input
                  id="req-people"
                  type="number"
                  min="1"
                  placeholder="e.g. 50"
                  value={requestForm.numberOfPeople}
                  onChange={(e) => setRequestForm({ ...requestForm, numberOfPeople: e.target.value })}
                  className="w-full pl-11 pr-4 py-2.5 rounded-full bg-[#FFF8EE] border border-[#E8D9C5] text-sm text-[#3B2A1A] focus:outline-none focus:ring-2 focus:ring-[#C98A2B]"
                />
              </div>
              {requestErrors.numberOfPeople && <p className="text-xs text-[#7A2E2E] mt-1">{requestErrors.numberOfPeople}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="req-date" className="text-xs font-bold text-[#3B2A1A] block mb-1">
                  Needed-by Date <span className="text-[#7A2E2E]">*</span>
                </label>
                <input
                  id="req-date"
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={requestForm.neededByDate}
                  onChange={(e) => setRequestForm({ ...requestForm, neededByDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-full bg-[#FFF8EE] border border-[#E8D9C5] text-xs text-[#3B2A1A] focus:outline-none focus:ring-2 focus:ring-[#C98A2B]"
                />
                {requestErrors.neededByDate && <p className="text-xs text-[#7A2E2E] mt-0.5">{requestErrors.neededByDate}</p>}
              </div>

              <div>
                <label htmlFor="req-time" className="text-xs font-bold text-[#3B2A1A] block mb-1">
                  Needed-by Time <span className="text-[#7A2E2E]">*</span>
                </label>
                <input
                  id="req-time"
                  type="time"
                  value={requestForm.neededByTime}
                  onChange={(e) => setRequestForm({ ...requestForm, neededByTime: e.target.value })}
                  className="w-full px-3 py-2 rounded-full bg-[#FFF8EE] border border-[#E8D9C5] text-xs text-[#3B2A1A] focus:outline-none focus:ring-2 focus:ring-[#C98A2B]"
                />
                {requestErrors.neededByTime && <p className="text-xs text-[#7A2E2E] mt-0.5">{requestErrors.neededByTime}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="req-location" className="text-xs font-bold text-[#3B2A1A] block mb-1">
                Shelter / Delivery Location <span className="text-[#7A2E2E]">*</span>
              </label>
              <input
                id="req-location"
                type="text"
                placeholder="e.g. Kakkanad, Kochi / Round West, Thrissur"
                value={requestForm.location}
                onChange={(e) => setRequestForm({ ...requestForm, location: e.target.value })}
                className="w-full px-4 py-2.5 rounded-full bg-[#FFF8EE] border border-[#E8D9C5] text-sm text-[#3B2A1A] focus:outline-none focus:ring-2 focus:ring-[#C98A2B]"
              />
              {requestErrors.location && <p className="text-xs text-[#7A2E2E] mt-1">{requestErrors.location}</p>}
            </div>
          </div>
        </ConfirmDialog>
      )}

    </div>
  );
}

