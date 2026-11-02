import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useToast } from '../components/Toast';
import DonationCapsule from '../components/DonationCapsule';
import ConfirmDialog from '../components/ConfirmDialog';
import StarRating from '../components/StarRating';
import { 
  UtensilsCrossed, 
  Search, 
  MapPin, 
  Clock, 
  PlusCircle, 
  Phone, 
  User, 
  CheckCircle2,
  Users,
  HeartHandshake,
  Star,
  Edit3,
  PackageCheck
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
  const { 
    donations, 
    ratings, 
    acceptDonation, 
    markDonationPickedUp, 
    submitRating, 
    editRating, 
    addRequest 
  } = useData();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Active Tab for Receivers ('browse' | 'claimed')
  const [activeTab, setActiveTab] = useState('browse');

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [districtFilter, setDistrictFilter] = useState('all');
  const [urgencyFilter, setUrgencyFilter] = useState('all');

  // Accept Donation Modal State
  const [acceptingDonation, setAcceptingDonation] = useState(null);
  const [acceptedContactInfo, setAcceptedContactInfo] = useState(null);

  // Pick up Confirmation State
  const [pickupConfirmDonation, setPickupConfirmDonation] = useState(null);

  // Rating Modal State
  const [ratingDialog, setRatingDialog] = useState({
    isOpen: false,
    donation: null,
    ratingId: null,
    stars: 5,
    comment: '',
    isInitial: false,
    isSubmitting: false,
  });

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

  // Receiver's Claimed Donations (accepted or completed)
  const myClaimedDonations = useMemo(() => {
    if (!isReceiver || !user) return [];
    return donations.filter((d) => d.acceptedBy === user.id);
  }, [donations, isReceiver, user]);

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

  // Pick-up confirmation flow
  const handleOpenPickupConfirm = (donation) => {
    setPickupConfirmDonation(donation);
  };

  const handleConfirmPickup = async () => {
    if (!pickupConfirmDonation || !user) return;
    const currentDonation = pickupConfirmDonation;

    try {
      await markDonationPickedUp(currentDonation.id, user);
      addToast('Donation marked as picked up! Please rate your experience.', 'success');
      setPickupConfirmDonation(null);

      // Open the Rating dialog immediately with Skip option
      setRatingDialog({
        isOpen: true,
        donation: currentDonation,
        ratingId: null,
        stars: 5,
        comment: '',
        isInitial: true,
        isSubmitting: false,
      });
    } catch (err) {
      addToast(err.message || 'Failed to mark as picked up.', 'error');
      setPickupConfirmDonation(null);
    }
  };

  // Open Rating modal for a specific completed donation
  const handleOpenRateDialog = (donation) => {
    const existing = ratings.find((r) => r.donationId === donation.id);
    if (existing) {
      // Edit mode
      setRatingDialog({
        isOpen: true,
        donation,
        ratingId: existing.id,
        stars: existing.stars,
        comment: existing.comment || '',
        isInitial: false,
        isSubmitting: false,
      });
    } else {
      // New rating mode
      setRatingDialog({
        isOpen: true,
        donation,
        ratingId: null,
        stars: 5,
        comment: '',
        isInitial: false,
        isSubmitting: false,
      });
    }
  };

  const handleSaveRating = async () => {
    if (!ratingDialog.donation || !user) return;

    setRatingDialog((prev) => ({ ...prev, isSubmitting: true }));
    try {
      if (ratingDialog.ratingId) {
        // Edit existing rating
        await editRating(
          ratingDialog.ratingId,
          {
            stars: ratingDialog.stars,
            comment: ratingDialog.comment,
          },
          user
        );
        addToast('Your rating has been updated successfully!', 'success');
      } else {
        // Add new rating
        await submitRating({
          donationId: ratingDialog.donation.id,
          donorId: ratingDialog.donation.donorId,
          receiverUser: user,
          stars: ratingDialog.stars,
          comment: ratingDialog.comment,
        });
        addToast('Thank you for rating this donor!', 'success');
      }

      setRatingDialog({
        isOpen: false,
        donation: null,
        ratingId: null,
        stars: 5,
        comment: '',
        isInitial: false,
        isSubmitting: false,
      });
    } catch (err) {
      addToast(err.message || 'Failed to save rating.', 'error');
      setRatingDialog((prev) => ({ ...prev, isSubmitting: false }));
    }
  };

  const handleSkipRating = () => {
    setRatingDialog({
      isOpen: false,
      donation: null,
      ratingId: null,
      stars: 5,
      comment: '',
      isInitial: false,
      isSubmitting: false,
    });
    addToast('You can rate this donor anytime from your Claimed Meals.', 'info');
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
      <section className="mb-8 text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-[#E8D9C5] pb-8">
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

      {/* Navigation Tabs for Logged-in Receivers */}
      {isReceiver && (
        <section className="mb-8 flex items-center gap-3 border-b border-[#E8D9C5] pb-4">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-all ${
              activeTab === 'browse'
                ? 'bg-[#845400] text-white shadow-sm'
                : 'bg-white text-[#514536] hover:bg-[#FFEADA] border border-[#E8D9C5]'
            }`}
          >
            Available Offerings ({filteredDonations.length})
          </button>
          <button
            onClick={() => setActiveTab('claimed')}
            className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-all flex items-center gap-2 ${
              activeTab === 'claimed'
                ? 'bg-[#5E7B3A] text-white shadow-sm'
                : 'bg-white text-[#514536] hover:bg-[#FFEADA] border border-[#E8D9C5]'
            }`}
          >
            <PackageCheck className="w-4 h-4" />
            <span>My Claimed Meals ({myClaimedDonations.length})</span>
          </button>
        </section>
      )}

      {/* TAB 1: BROWSE AVAILABLE DONATIONS */}
      {(!isReceiver || activeTab === 'browse') && (
        <>
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
        </>
      )}

      {/* TAB 2: RECEIVER'S CLAIMED MEALS (Pick up & Rating flow) */}
      {isReceiver && activeTab === 'claimed' && (
        <section className="space-y-4">
          {myClaimedDonations.length === 0 ? (
            <div className="p-12 rounded-3xl bg-white border border-[#E8D9C5] text-center max-w-md mx-auto shadow-sm">
              <div className="w-16 h-16 rounded-full bg-[#FFEADA] text-[#5E7B3A] flex items-center justify-center mx-auto mb-4">
                <PackageCheck className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#3B2A1A] mb-2">
                No Claimed Donations Yet
              </h3>
              <p className="text-sm text-[#514536] mb-6 leading-relaxed">
                When you accept available food donations from generous donors, they will appear here so you can coordinate pickup and leave reviews.
              </p>
              <button
                onClick={() => setActiveTab('browse')}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#845400] text-white font-semibold text-sm hover:bg-[#643F00] transition-colors"
              >
                Browse Available Food
              </button>
            </div>
          ) : (
            myClaimedDonations.map((item) => {
              const isCompleted = item.status === 'completed';
              const rating = ratings.find((r) => r.donationId === item.id);

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-5 border border-[#E8D9C5] shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {isCompleted ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#CCEEA0] text-[#1E3500] text-xs font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#5E7B3A]" />
                          Picked Up
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFEADA] text-[#845400] text-xs font-bold">
                          <Clock className="w-3.5 h-3.5 text-[#C98A2B]" />
                          Ready for Pickup
                        </span>
                      )}

                      <span className="text-xs font-semibold text-[#845400] bg-[#FFDDB5] px-2.5 py-0.5 rounded-full">
                        {item.quantity} {item.unit}
                      </span>
                    </div>

                    <h3 className="font-serif text-xl font-bold text-[#3B2A1A]">
                      {item.item}
                    </h3>

                    {/* Donor Details & Direct Phone */}
                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs sm:text-sm text-[#514536]">
                      <span className="inline-flex items-center gap-1 text-[#845400]">
                        <User className="w-3.5 h-3.5" />
                        <span>Offered by:</span>
                        <Link
                          to={`/donors/${item.donorId}`}
                          className="font-bold underline hover:text-[#5E7B3A]"
                        >
                          {item.donorName}
                        </Link>
                      </span>

                      <span className="inline-flex items-center gap-1 text-[#1E3500] font-medium">
                        <Phone className="w-3.5 h-3.5 text-[#5E7B3A]" />
                        <a href={`tel:${item.donorPhone}`} className="hover:underline">
                          {item.donorPhone}
                        </a>
                      </span>

                      <span className="inline-flex items-center gap-1 text-[#514536]">
                        <MapPin className="w-3.5 h-3.5 text-[#C98A2B]" />
                        <span>{item.location}</span>
                      </span>
                    </div>

                    {/* Existing Rating Info if Completed and Rated */}
                    {isCompleted && rating && (
                      <div className="mt-2 p-3 bg-[#FFF8EE] rounded-xl border border-[#E8D9C5] text-xs">
                        <div className="flex items-center gap-2 mb-1">
                          <StarRating mode="display" value={rating.stars} size={14} id={`claimed-rate-${rating.id}`} />
                          <span className="font-bold text-[#3B2A1A]">Your Rating: {rating.stars}/5</span>
                        </div>
                        {rating.comment && (
                          <p className="text-[#514536] italic">&ldquo;{rating.comment}&rdquo;</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions: Mark as picked up, Rate now, Edit rating */}
                  <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-2 w-full md:w-auto">
                    {!isCompleted && (
                      <button
                        onClick={() => handleOpenPickupConfirm(item)}
                        className="px-5 py-2.5 rounded-full bg-[#5E7B3A] hover:bg-[#4B6728] text-white font-semibold text-xs sm:text-sm shadow-sm transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Mark as picked up</span>
                      </button>
                    )}

                    {isCompleted && !rating && (
                      <button
                        onClick={() => handleOpenRateDialog(item)}
                        className="px-5 py-2.5 rounded-full bg-[#C98A2B] hover:bg-[#845400] text-white font-semibold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-1.5"
                      >
                        <Star className="w-4 h-4 fill-white" />
                        <span>Rate now</span>
                      </button>
                    )}

                    {isCompleted && rating && (
                      <button
                        onClick={() => handleOpenRateDialog(item)}
                        className="px-4 py-2 rounded-full bg-white hover:bg-[#FFF8EE] text-[#845400] border border-[#E8D9C5] font-semibold text-xs transition-all flex items-center justify-center gap-1.5"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit rating</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </section>
      )}

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
          confirmText="Go to My Claimed Meals"
          cancelText="Close"
          type="success"
          onConfirm={() => {
            setAcceptedContactInfo(null);
            setActiveTab('claimed');
          }}
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

      {/* Mark As Picked Up Confirmation Dialog */}
      {pickupConfirmDonation && (
        <ConfirmDialog
          isOpen={!!pickupConfirmDonation}
          onClose={() => setPickupConfirmDonation(null)}
          onConfirm={handleConfirmPickup}
          title="Confirm Food Collection"
          confirmText="Yes, Picked Up"
          cancelText="Cancel"
          type="success"
        >
          <div className="space-y-3 pt-2 text-sm text-[#514536]">
            <p>
              Have you received and collected <strong>{pickupConfirmDonation.item}</strong> from <strong>{pickupConfirmDonation.donorName}</strong>?
            </p>
            <p className="text-xs text-[#837564]">
              Marking this as picked up completes the food sharing and invites you to leave a rating for this donor.
            </p>
          </div>
        </ConfirmDialog>
      )}

      {/* RATE THIS DONOR DIALOG (PRD §8.7) */}
      {ratingDialog.isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn"
          role="dialog"
          aria-modal="true"
          aria-labelledby="rating-dialog-title"
        >
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#E8D9C5] shadow-2xl relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-[#FFEADA] text-[#C98A2B] flex items-center justify-center">
                <Star className="w-5 h-5 fill-[#C98A2B]" />
              </div>
              <div>
                <h3 id="rating-dialog-title" className="font-serif text-xl font-bold text-[#3B2A1A]">
                  {ratingDialog.ratingId ? 'Edit Your Rating' : 'Rate this Donor'}
                </h3>
                <p className="text-xs text-[#514536]">
                  {ratingDialog.donation?.donorName}
                </p>
              </div>
            </div>

            <p className="text-xs text-[#837564] mb-4">
              How was the food quality, packaging, and pickup coordination? Your rating helps fellow shelters across Kerala.
            </p>

            {/* Interactive Star Selector */}
            <div className="my-5 flex flex-col items-center justify-center p-4 bg-[#FFF8EE] rounded-2xl border border-[#E8D9C5]">
              <span className="text-xs font-bold text-[#845400] mb-2 uppercase tracking-wider">
                Select Rating
              </span>
              <StarRating
                mode="input"
                value={ratingDialog.stars}
                onChange={(newStars) => setRatingDialog((prev) => ({ ...prev, stars: newStars }))}
                size={32}
                id="dialog-rating-input"
              />
              <span className="text-xs font-medium text-[#514536] mt-2">
                {ratingDialog.stars === 5 && 'Outstanding & Generous'}
                {ratingDialog.stars === 4 && 'Very Good & Fresh'}
                {ratingDialog.stars === 3 && 'Satisfactory'}
                {ratingDialog.stars === 2 && 'Needs Improvement'}
                {ratingDialog.stars === 1 && 'Poor Experience'}
              </span>
            </div>

            {/* Optional Comment Box with Character Counter */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="rating-comment" className="text-xs font-bold text-[#3B2A1A]">
                  Review Comment <span className="font-normal text-[#837564]">(optional)</span>
                </label>
                <span className="text-xs text-[#837564]">
                  {ratingDialog.comment.length} / 200
                </span>
              </div>
              <textarea
                id="rating-comment"
                rows={3}
                maxLength={200}
                placeholder="e.g. Food was hot, fresh, and neatly packed. Very kind supervisor."
                value={ratingDialog.comment}
                onChange={(e) => setRatingDialog((prev) => ({ ...prev, comment: e.target.value.slice(0, 200) }))}
                className="w-full p-3 rounded-2xl bg-[#FFF8EE] border border-[#E8D9C5] text-xs sm:text-sm text-[#3B2A1A] focus:outline-none focus:ring-2 focus:ring-[#C98A2B] resize-none"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#E8D9C5]">
              {ratingDialog.isInitial ? (
                <button
                  type="button"
                  onClick={handleSkipRating}
                  className="px-5 py-2.5 rounded-full text-xs font-medium text-[#837564] hover:bg-[#F5EFE6] transition-colors"
                >
                  Skip for now
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setRatingDialog((prev) => ({ ...prev, isOpen: false }))}
                  className="px-5 py-2.5 rounded-full text-xs font-medium text-[#837564] hover:bg-[#F5EFE6] transition-colors"
                >
                  Cancel
                </button>
              )}

              <button
                type="button"
                disabled={ratingDialog.isSubmitting}
                onClick={handleSaveRating}
                className="px-6 py-2.5 rounded-full bg-[#C98A2B] hover:bg-[#845400] text-white font-bold text-xs sm:text-sm shadow-md transition-all disabled:opacity-50"
              >
                {ratingDialog.isSubmitting ? 'Saving...' : (ratingDialog.ratingId ? 'Update Rating' : 'Submit Rating')}
              </button>
            </div>
          </div>
        </div>
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
