import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { ratingsService } from '../services/ratingsService';
import { useToast } from '../components/Toast';
import ConfirmDialog from '../components/ConfirmDialog';
import StarRating from '../components/StarRating';
import { 
  HandPlatter, 
  Plus, 
  MapPin, 
  Calendar, 
  Clock, 
  Utensils, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  ArrowRight,
  Star
} from 'lucide-react';

const SUGGESTIONS = ['Biriyani', 'Rice & Curry', 'Chapati', 'Fresh Bread Loaves', 'Vegetable Meals', 'Appam & Stew'];
const UNITS = ['Plates', 'Packets', 'Kg', 'Litres'];

export default function Donate() {
  const { user, isVisitor, isDonor } = useAuth();
  const { donations, addDonation, updateDonation, deleteDonation } = useData();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    item: '',
    quantity: '',
    unit: 'Plates',
    date: new Date().toISOString().split('T')[0],
    time: '19:00',
    location: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Edit State
  const [editingDonation, setEditingDonation] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  // Delete State
  const [deletingId, setDeletingId] = useState(null);

  // Donor Rating Summary State
  const [donorSummary, setDonorSummary] = useState(null);

  useEffect(() => {
    if (user && isDonor) {
      ratingsService.getDonorSummary(user.id).then(setDonorSummary);
    }
  }, [user, isDonor, donations]);

  // Get current donor's donations
  const myDonations = donations.filter((d) => user && d.donorId === user.id);

  const validateForm = (data) => {
    const errs = {};
    if (!data.item.trim()) errs.item = 'Item name is required.';
    if (!data.quantity || Number(data.quantity) <= 0) errs.quantity = 'Quantity must be greater than 0.';
    if (!data.unit) errs.unit = 'Unit is required.';
    if (!data.date) {
      errs.date = 'Date is required.';
    } else {
      const todayStr = new Date().toISOString().split('T')[0];
      if (data.date < todayStr) errs.date = 'Date cannot be in the past.';
    }
    if (!data.time) errs.time = 'Pickup-by time is required.';
    if (!data.location.trim()) errs.location = 'Location address is required.';

    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // If Visitor, redirect to Login per PRD §8.2
    if (isVisitor) {
      navigate('/login', { state: { from: { pathname: '/donate' } } });
      return;
    }

    const errs = validateForm(formData);
    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    setSubmitting(true);
    setFormErrors({});

    try {
      await addDonation({
        donorId: user.id,
        ...formData,
      });

      addToast('Thank you! Your donation has been added.', 'success');
      
      // Reset form (keeping location handy for caterers)
      setFormData((prev) => ({
        item: '',
        quantity: '',
        unit: 'Plates',
        date: new Date().toISOString().split('T')[0],
        time: '19:00',
        location: prev.location,
      }));
    } catch (err) {
      addToast(err.message || 'Failed to add donation.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = (donation) => {
    setEditingDonation(donation);
    setEditFormData({
      item: donation.item,
      quantity: donation.quantity,
      unit: donation.unit,
      date: donation.date,
      time: donation.time,
      location: donation.location,
    });
  };

  const handleSaveEdit = async () => {
    const errs = validateForm(editFormData);
    if (Object.keys(errs).length > 0) {
      addToast('Please correct form errors before saving.', 'error');
      return;
    }

    try {
      await updateDonation(editingDonation.id, editFormData);
      addToast('Donation updated successfully.', 'success');
      setEditingDonation(null);
    } catch (err) {
      addToast(err.message || 'Failed to update donation.', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    try {
      await deleteDonation(deletingId);
      addToast('Donation removed.', 'info');
      setDeletingId(null);
    } catch (err) {
      addToast(err.message || 'Failed to delete donation.', 'error');
    }
  };

  return (
    <div className="pt-24 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Top Heading Section (PRD §8.2) */}
      <section className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-[#FFEADA] text-[#845400] text-xs font-bold uppercase tracking-wider mb-3 border border-[#E8D9C5]">
          <HandPlatter className="w-3.5 h-3.5 text-[#C98A2B]" />
          <span>Sacred Bounty · Five Loaves Ministry</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#3B2A1A] tracking-tight mb-3">
          Every Donation Matters
        </h1>

        <p className="text-sm sm:text-base text-[#514536] leading-relaxed">
          Turn your surplus fresh food into wholesome nourishment for community shelters and families today across Kerala.
        </p>

        {/* Five Loaves Visual Motif / Counter Indicator */}
        <div className="pt-3 flex items-center justify-center gap-2">
          <div className="flex items-center gap-1.5 bg-[#FFF1E8] px-4 py-1.5 rounded-full border border-[#E8D9C5] shadow-sm">
            <span className="text-xs text-[#845400] font-semibold mr-1">Consecrated Portions</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#845400]"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#845400]"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#845400]"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#C98A2B]"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#D6C4B1]"></span>
          </div>
        </div>
      </section>

      {/* Main Donation Form Card */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8D9C5] shadow-lg mb-16 relative overflow-hidden">
        
        {/* Subtle Watermark Decoration */}
        <div className="absolute -right-8 -top-8 w-36 h-36 bg-[#FFEADA]/50 rounded-full pointer-events-none flex items-end justify-start p-6">
          <HandPlatter className="w-14 h-14 text-[#C98A2B]/20" />
        </div>

        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-[#F5E8D3]">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-[#845400]">
                Offering Portal
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#3B2A1A]">
                Pledge Prepared Food
              </h2>
            </div>
            
            <div className="inline-flex items-center gap-2 text-xs text-[#5E7B3A] bg-[#CCEEA0]/40 px-3 py-1 rounded-full border border-[#B0D186]">
              <span className="w-2 h-2 rounded-full bg-[#5E7B3A] animate-pulse"></span>
              <span>Accepting today&apos;s kitchen batch</span>
            </div>
          </div>

          <p className="text-xs text-[#7A2E2E] font-medium mb-4 italic">
            * All fields are required
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Field: Item Name with suggestions */}
            <div className="space-y-1.5">
              <label htmlFor="food-item" className="text-xs font-bold uppercase tracking-wider text-[#3B2A1A] flex items-center gap-1">
                <span>Item Name</span>
                <span className="text-[#7A2E2E] font-bold">*</span>
              </label>
              <div className="relative">
                <Utensils className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#837564]" />
                <input
                  id="food-item"
                  type="text"
                  placeholder="e.g. Thalassery Chicken Biriyani, Vegetable Meals, Bread"
                  value={formData.item}
                  onChange={(e) => setFormData({ ...formData, item: e.target.value })}
                  className="w-full pl-11 pr-4 py-3.5 rounded-full bg-[#FFF8EE] border border-[#E8D9C5] text-sm text-[#3B2A1A] placeholder-[#837564]/70 focus:outline-none focus:ring-2 focus:ring-[#C98A2B] focus:bg-white transition-all"
                  required
                />
              </div>
              {formErrors.item && <p className="text-xs text-[#7A2E2E] pl-3">{formErrors.item}</p>}

              {/* Suggestions chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
                <span className="text-[#837564]">Quick pick:</span>
                {SUGGESTIONS.map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => setFormData({ ...formData, item: sug })}
                    className="px-2.5 py-0.5 rounded-full bg-[#FFEADA] text-[#845400] hover:bg-[#FFE3CD] text-[11px] font-medium transition-colors"
                  >
                    + {sug}
                  </button>
                ))}
              </div>
            </div>

            {/* Split: Quantity and Unit */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="sm:col-span-6 space-y-1.5">
                <label htmlFor="quantity" className="text-xs font-bold uppercase tracking-wider text-[#3B2A1A] flex items-center gap-1">
                  <span>Quantity</span>
                  <span className="text-[#7A2E2E] font-bold">*</span>
                </label>
                <input
                  id="quantity"
                  type="number"
                  min="1"
                  placeholder="e.g. 50"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-full bg-[#FFF8EE] border border-[#E8D9C5] text-sm text-[#3B2A1A] placeholder-[#837564]/70 focus:outline-none focus:ring-2 focus:ring-[#C98A2B] focus:bg-white transition-all"
                  required
                />
                {formErrors.quantity && <p className="text-xs text-[#7A2E2E] pl-3">{formErrors.quantity}</p>}
              </div>

              <div className="sm:col-span-6 space-y-1.5">
                <label htmlFor="unit" className="text-xs font-bold uppercase tracking-wider text-[#3B2A1A] flex items-center gap-1">
                  <span>Unit</span>
                  <span className="text-[#7A2E2E] font-bold">*</span>
                </label>
                <select
                  id="unit"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-full bg-[#FFF8EE] border border-[#E8D9C5] text-sm text-[#3B2A1A] focus:outline-none focus:ring-2 focus:ring-[#C98A2B] focus:bg-white transition-all cursor-pointer"
                  required
                >
                  {UNITS.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
                {formErrors.unit && <p className="text-xs text-[#7A2E2E] pl-3">{formErrors.unit}</p>}
              </div>
            </div>

            {/* Split: Date and Time */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="sm:col-span-6 space-y-1.5">
                <label htmlFor="date" className="text-xs font-bold uppercase tracking-wider text-[#3B2A1A] flex items-center gap-1">
                  <span>Pickup Date</span>
                  <span className="text-[#7A2E2E] font-bold">*</span>
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#837564]" />
                  <input
                    id="date"
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full pl-11 pr-4 py-3.5 rounded-full bg-[#FFF8EE] border border-[#E8D9C5] text-sm text-[#3B2A1A] focus:outline-none focus:ring-2 focus:ring-[#C98A2B] focus:bg-white transition-all cursor-pointer"
                    required
                  />
                </div>
                {formErrors.date && <p className="text-xs text-[#7A2E2E] pl-3">{formErrors.date}</p>}
              </div>

              <div className="sm:col-span-6 space-y-1.5">
                <label htmlFor="time" className="text-xs font-bold uppercase tracking-wider text-[#3B2A1A] flex items-center gap-1">
                  <span>Pickup-by Time</span>
                  <span className="text-[#7A2E2E] font-bold">*</span>
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#837564]" />
                  <input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full pl-11 pr-4 py-3.5 rounded-full bg-[#FFF8EE] border border-[#E8D9C5] text-sm text-[#3B2A1A] focus:outline-none focus:ring-2 focus:ring-[#C98A2B] focus:bg-white transition-all cursor-pointer"
                    required
                  />
                </div>
                {formErrors.time && <p className="text-xs text-[#7A2E2E] pl-3">{formErrors.time}</p>}
              </div>
            </div>

            {/* Field: Location */}
            <div className="space-y-1.5">
              <label htmlFor="location" className="text-xs font-bold uppercase tracking-wider text-[#3B2A1A] flex items-center gap-1">
                <span>Pickup Location Address</span>
                <span className="text-[#7A2E2E] font-bold">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#837564]" />
                <input
                  id="location"
                  type="text"
                  placeholder="e.g. Edappally Toll Junction, Kochi / Malabar Hall, Thrissur"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full pl-11 pr-4 py-3.5 rounded-full bg-[#FFF8EE] border border-[#E8D9C5] text-sm text-[#3B2A1A] placeholder-[#837564]/70 focus:outline-none focus:ring-2 focus:ring-[#C98A2B] focus:bg-white transition-all"
                  required
                />
              </div>
              {formErrors.location && <p className="text-xs text-[#7A2E2E] pl-3">{formErrors.location}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-full bg-[#C98A2B] text-white hover:bg-[#845400] font-sans font-bold text-base shadow-md hover:shadow-lg transition-all transform active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2 mt-4"
            >
              <Plus className="w-5 h-5" />
              <span>{isVisitor ? 'Login to Add Donation' : 'Add Donation'}</span>
            </button>

          </form>
        </div>
      </section>

      {/* Bottom Section: "Your Donations" (PRD §8.2) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8D9C5] pb-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-[#845400]">
              Donor Records
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#3B2A1A]">
              Your Donations
            </h2>
          </div>
          <p className="text-xs text-[#837564]">
            {user ? `${myDonations.length} total offering(s) registered` : 'Log in to track your past offerings'}
          </p>
        </div>

        {/* Donor Rating Summary Banner */}
        {user && isDonor && (
          <div className="bg-white rounded-2xl p-5 border border-[#E8D9C5] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#FFEADA] text-[#C98A2B] flex items-center justify-center shrink-0 border border-[#E8D9C5]">
                <Star className="w-6 h-6 fill-[#C98A2B]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  {donorSummary && donorSummary.ratingCount > 0 ? (
                    <>
                      <span className="font-serif text-xl font-bold text-[#3B2A1A]">
                        ★ {donorSummary.averageRating.toFixed(1)}
                      </span>
                      <span className="text-xs text-[#837564]">
                        ({donorSummary.ratingCount} review{donorSummary.ratingCount > 1 ? 's' : ''})
                      </span>
                    </>
                  ) : (
                    <span className="text-xs font-semibold text-[#845400] bg-[#FFDDB5] px-2.5 py-0.5 rounded-full">
                      New Donor · No ratings yet
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#514536] mt-0.5">
                  Your public rating and feedback from receiving shelters across Kerala
                </p>
              </div>
            </div>

            <Link
              to={`/donors/${user.id}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FFF8EE] hover:bg-[#FFEADA] text-[#845400] text-xs font-bold border border-[#E8D9C5] shadow-sm transition-colors shrink-0"
            >
              <span>View Public Profile</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {!user ? (
          <div className="p-8 rounded-3xl bg-white border border-[#E8D9C5] text-center max-w-md mx-auto">
            <HandPlatter className="w-10 h-10 text-[#C98A2B] mx-auto mb-3" />
            <h3 className="font-serif text-lg font-bold text-[#3B2A1A] mb-1">View Your Pledges</h3>
            <p className="text-xs text-[#514536] mb-4">
              Sign in with your donor account to view, edit, or remove your active food pledges.
            </p>
            <button
              onClick={() => navigate('/login', { state: { from: { pathname: '/donate' } } })}
              className="px-6 py-2.5 rounded-full bg-[#845400] text-white font-semibold text-xs shadow-sm hover:bg-[#643F00] transition-colors"
            >
              Sign In as Donor
            </button>
          </div>
        ) : myDonations.length === 0 ? (
          <div className="p-10 rounded-3xl bg-white border border-[#E8D9C5] text-center max-w-md mx-auto">
            <HandPlatter className="w-12 h-12 text-[#D6C4B1] mx-auto mb-3" />
            <h3 className="font-serif text-lg font-bold text-[#3B2A1A] mb-1">No Donations Posted Yet</h3>
            <p className="text-xs text-[#514536]">
              Fill out the form above to share your first meal batch with shelters in need.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {myDonations.map((donation) => (
              <div
                key={donation.id}
                className="bg-white rounded-2xl p-5 border border-[#E8D9C5] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {donation.status === 'available' && (
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#CCEEA0] text-[#1E3500]">
                        Available
                      </span>
                    )}
                    {donation.status === 'accepted' && (
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#FFEADA] text-[#845400] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#5E7B3A]" />
                        <span>Accepted by {donation.acceptedByName || 'Receiver'}</span>
                      </span>
                    )}
                    {donation.status === 'expired' && (
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#FFDAD8] text-[#7A2E2E]">
                        Expired
                      </span>
                    )}

                    <span className="text-xs text-[#845400] bg-[#FFDDB5] px-2 py-0.5 rounded-full font-semibold">
                      {donation.unit}
                    </span>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-[#3B2A1A]">
                    {donation.item} · {donation.quantity} {donation.unit.toLowerCase()}
                  </h3>

                  <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-[#514536]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#5E7B3A]" />
                      <span>{donation.date} at {donation.time}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#C98A2B]" />
                      <span>{donation.location}</span>
                    </span>
                    {donation.acceptedByPhone && (
                      <span className="font-semibold text-[#5E7B3A]">
                        Receiver Contact: {donation.acceptedByPhone}
                      </span>
                    )}
                  </div>
                </div>

                {/* Edit & Remove controls (PRD §8.2) */}
                <div className="flex items-center gap-2 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-[#F5E8D3]">
                  {donation.status === 'available' && (
                    <button
                      onClick={() => handleEditClick(donation)}
                      className="p-2 rounded-full text-[#845400] hover:bg-[#FFEADA] transition-colors"
                      title="Edit donation details"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    onClick={() => setDeletingId(donation.id)}
                    className="p-2 rounded-full text-[#7A2E2E] hover:bg-[#FFDAD8] transition-colors"
                    title="Remove donation"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Edit Donation Modal */}
      {editingDonation && (
        <ConfirmDialog
          isOpen={!!editingDonation}
          onClose={() => setEditingDonation(null)}
          onConfirm={handleSaveEdit}
          title="Edit Donation Offering"
          confirmText="Save Changes"
          cancelText="Cancel"
          type="primary"
        >
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-bold text-[#3B2A1A] block mb-1">Item Name</label>
              <input
                type="text"
                value={editFormData.item || ''}
                onChange={(e) => setEditFormData({ ...editFormData, item: e.target.value })}
                className="w-full px-4 py-2 rounded-full bg-[#FFF8EE] border border-[#E8D9C5] text-sm text-[#3B2A1A] focus:outline-none focus:ring-2 focus:ring-[#C98A2B]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-[#3B2A1A] block mb-1">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={editFormData.quantity || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, quantity: e.target.value })}
                  className="w-full px-4 py-2 rounded-full bg-[#FFF8EE] border border-[#E8D9C5] text-sm text-[#3B2A1A] focus:outline-none focus:ring-2 focus:ring-[#C98A2B]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#3B2A1A] block mb-1">Unit</label>
                <select
                  value={editFormData.unit || 'Plates'}
                  onChange={(e) => setEditFormData({ ...editFormData, unit: e.target.value })}
                  className="w-full px-4 py-2 rounded-full bg-[#FFF8EE] border border-[#E8D9C5] text-sm text-[#3B2A1A] focus:outline-none focus:ring-2 focus:ring-[#C98A2B]"
                >
                  {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-[#3B2A1A] block mb-1">Date</label>
                <input
                  type="date"
                  value={editFormData.date || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
                  className="w-full px-4 py-2 rounded-full bg-[#FFF8EE] border border-[#E8D9C5] text-sm text-[#3B2A1A] focus:outline-none focus:ring-2 focus:ring-[#C98A2B]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#3B2A1A] block mb-1">Pickup Time</label>
                <input
                  type="time"
                  value={editFormData.time || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, time: e.target.value })}
                  className="w-full px-4 py-2 rounded-full bg-[#FFF8EE] border border-[#E8D9C5] text-sm text-[#3B2A1A] focus:outline-none focus:ring-2 focus:ring-[#C98A2B]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#3B2A1A] block mb-1">Location</label>
              <input
                type="text"
                value={editFormData.location || ''}
                onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                className="w-full px-4 py-2 rounded-full bg-[#FFF8EE] border border-[#E8D9C5] text-sm text-[#3B2A1A] focus:outline-none focus:ring-2 focus:ring-[#C98A2B]"
              />
            </div>
          </div>
        </ConfirmDialog>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <ConfirmDialog
          isOpen={!!deletingId}
          onClose={() => setDeletingId(null)}
          onConfirm={handleDeleteConfirm}
          title="Remove Food Donation"
          description="Are you sure you want to remove this donation offering? Once removed, it will no longer be visible to shelters."
          confirmText="Yes, Remove"
          cancelText="Keep"
          type="danger"
        />
      )}

    </div>
  );
}

