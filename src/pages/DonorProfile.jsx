import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { ratingsService } from '../services/ratingsService';
import StarRating from '../components/StarRating';
import { 
  Building2, 
  User, 
  Calendar, 
  HeartHandshake, 
  ArrowLeft, 
  Star, 
  MessageSquareHeart, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export default function DonorProfile() {
  const { id } = useParams();
  const [donor, setDonor] = useState(null);
  const [summary, setSummary] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDonorProfile() {
      setLoading(true);
      try {
        const users = await authService.listUsers();
        const found = users.find((u) => u.id === id && u.userType === 'donor');
        setDonor(found || null);

        if (found) {
          const stats = await ratingsService.getDonorSummary(id);
          const donorReviews = await ratingsService.listRatingsForDonor(id);
          setSummary(stats);
          setReviews(donorReviews);
        }
      } catch (err) {
        console.error('Error loading donor profile:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDonorProfile();
  }, [id]);

  // Extract contact first name only (Privacy rule)
  const contactFirstName = donor?.contactName ? donor.contactName.trim().split(' ')[0] : 'Community Partner';

  const formatReviewDate = (isoStr) => {
    if (!isoStr) return '';
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return '';
    }
  };

  if (loading) {
    return (
      <div className="pt-32 pb-20 max-w-4xl mx-auto px-4 text-center">
        <div className="inline-block w-8 h-8 border-4 border-[#C98A2B] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-sm text-[#514536]">Loading donor profile...</p>
      </div>
    );
  }

  if (!donor) {
    return (
      <div className="pt-32 pb-20 max-w-xl mx-auto px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-[#FFEADA] text-[#845400] flex items-center justify-center mx-auto mb-4">
          <Building2 className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#3B2A1A] mb-2">Donor Not Found</h2>
        <p className="text-sm text-[#514536] mb-6">
          The requested donor profile does not exist or may have been removed.
        </p>
        <Link
          to="/receive"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#845400] text-white font-semibold text-sm hover:bg-[#643F00] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Offerings</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Navigation back */}
      <div className="mb-6">
        <Link
          to="/receive"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#845400] hover:text-[#5E7B3A] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Food Offerings</span>
        </Link>
      </div>

      {/* Header Banner */}
      <header className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8D9C5] shadow-sm mb-8 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#FFEADA] text-[#C98A2B] flex items-center justify-center shrink-0 border border-[#E8D9C5] shadow-inner">
              <Building2 className="w-8 h-8 sm:w-10 sm:h-10 text-[#845400]" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#CCEEA0]/60 text-[#1E3500] text-xs font-bold uppercase tracking-wider mb-1.5 border border-[#B0D186]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#5E7B3A]" />
                <span>Verified Food Donor</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#3B2A1A]">
                {donor.institutionName}
              </h1>

              {/* Contact first name only (Privacy constraint) */}
              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-[#514536] mt-1.5">
                <span className="inline-flex items-center gap-1.5">
                  <User className="w-4 h-4 text-[#C98A2B]" />
                  <span>Representative: <strong>{contactFirstName}</strong></span>
                </span>
                <span className="text-[#D4C3AF]">•</span>
                <span className="inline-flex items-center gap-1.5">
                  <HeartHandshake className="w-4 h-4 text-[#5E7B3A]" />
                  <span><strong>{summary?.completedDonationsCount || 0}</strong> donations completed</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Rating Badge */}
          {summary && summary.ratingCount > 0 ? (
            <div className="sm:text-right bg-[#FFF8EE] px-5 py-3 rounded-2xl border border-[#E8D9C5]">
              <div className="flex items-center sm:justify-end gap-1.5 mb-1">
                <span className="font-serif text-3xl font-bold text-[#3B2A1A]">
                  {summary.averageRating.toFixed(1)}
                </span>
                <span className="text-xs text-[#837564]">/ 5</span>
              </div>
              <StarRating mode="display" value={summary.averageRating} size={18} id="header-rating" />
              <p className="text-xs text-[#837564] mt-1">
                Based on {summary.ratingCount} review{summary.ratingCount > 1 ? 's' : ''}
              </p>
            </div>
          ) : (
            <div className="bg-[#FFF8EE] px-4 py-3 rounded-2xl border border-[#E8D9C5] text-center">
              <span className="text-xs font-semibold text-[#845400] bg-[#FFDDB5] px-3 py-1 rounded-full">
                New Donor
              </span>
              <p className="text-xs text-[#837564] mt-2">No reviews yet</p>
            </div>
          )}
        </div>
      </header>

      {/* Rating Breakdown & Stats */}
      {summary && summary.ratingCount > 0 ? (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Left: Overall score box */}
          <div className="bg-white rounded-3xl p-6 border border-[#E8D9C5] shadow-sm flex flex-col items-center justify-center text-center">
            <span className="text-xs uppercase font-bold text-[#845400] tracking-wider mb-2">
              Overall Donor Rating
            </span>
            <div className="font-serif text-5xl font-bold text-[#3B2A1A] mb-2">
              {summary.averageRating.toFixed(1)}
            </div>
            <StarRating mode="display" value={summary.averageRating} size={22} id="scorebox-rating" />
            <p className="text-xs text-[#837564] mt-3">
              {summary.ratingCount} verified feedback review{summary.ratingCount > 1 ? 's' : ''} from shelters
            </p>
          </div>

          {/* Right: Distribution bars (5 to 1) */}
          <div className="md:col-span-2 bg-white rounded-3xl p-6 border border-[#E8D9C5] shadow-sm flex flex-col justify-center">
            <h3 className="text-xs uppercase font-bold text-[#845400] tracking-wider mb-4">
              Rating Distribution
            </h3>
            <div className="space-y-2.5">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = summary.distribution[star] || 0;
                const percentage = summary.ratingCount > 0 ? (count / summary.ratingCount) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-3 text-xs">
                    <span className="w-12 font-medium text-[#3B2A1A] flex items-center gap-1 justify-end">
                      <span>{star}</span>
                      <Star size={12} className="fill-[#C98A2B] text-[#C98A2B]" />
                    </span>
                    <div className="flex-1 h-3 rounded-full bg-[#F5EFE6] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#C98A2B] transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-8 text-right font-medium text-[#514536]">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      {/* Reviews List */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8D9C5] shadow-sm">
        <div className="flex items-center justify-between border-b border-[#E8D9C5] pb-4 mb-6">
          <div className="flex items-center gap-2">
            <MessageSquareHeart className="w-5 h-5 text-[#845400]" />
            <h2 className="font-serif text-xl font-bold text-[#3B2A1A]">
              Receiver Reviews & Blessings
            </h2>
          </div>
          <span className="text-xs text-[#837564] font-medium">
            {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
          </span>
        </div>

        {reviews.length === 0 ? (
          <div className="py-12 text-center max-w-sm mx-auto">
            <div className="w-12 h-12 rounded-full bg-[#FFEADA] text-[#C98A2B] flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#3B2A1A] mb-1">No ratings yet</h3>
            <p className="text-xs text-[#514536] leading-relaxed">
              This donor has not received any shelter ratings yet. Once completed meals are picked up, reviews will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#F5EFE6] space-y-5">
            {reviews.map((review) => (
              <div key={review.id} className="pt-5 first:pt-0 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <StarRating mode="display" value={review.stars} size={15} id={`rev-${review.id}`} />
                    <span className="text-xs font-bold text-[#3B2A1A]">
                      {review.stars} / 5
                    </span>
                  </div>
                  <span className="text-xs text-[#837564]">
                    {formatReviewDate(review.createdAt)}
                  </span>
                </div>

                {review.comment ? (
                  <p className="text-sm text-[#3B2A1A] italic leading-relaxed">
                    &ldquo;{review.comment}&rdquo;
                  </p>
                ) : (
                  <p className="text-xs text-[#837564] italic">
                    (No written comment provided)
                  </p>
                )}

                <div className="flex items-center gap-1.5 text-xs text-[#5E7B3A] font-medium pt-0.5">
                  <span>Verified Receiver:</span>
                  <span className="text-[#3B2A1A]">{review.receiverName}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

