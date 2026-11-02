import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Clock, MapPin, CheckCircle2, User, HeartHandshake } from 'lucide-react';

export default function DonationCapsule({ donation, onAccept }) {
  const { user, isDonor, isReceiver, isVisitor } = useAuth();
  const navigate = useNavigate();

  const isAvailable = donation.status === 'available';
  const isAccepted = donation.status === 'accepted';
  const isExpired = donation.status === 'expired';

  // Format date nicely e.g. "Today", "Tomorrow", or "12 Nov"
  const formatFriendlyDate = (dateStr, timeStr) => {
    if (!dateStr) return '';
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      let dayPart = dateStr;
      if (dateStr === todayStr) dayPart = 'Today';
      else if (dateStr === tomorrowStr) dayPart = 'Tomorrow';
      else {
        const parts = dateStr.split('-');
        if (parts.length === 3) {
          const d = new Date(parts[0], parts[1] - 1, parts[2]);
          dayPart = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
        }
      }

      // Format time (e.g., "19:30" -> "7:30 PM")
      let timePart = timeStr || '';
      if (timeStr && timeStr.includes(':')) {
        const [h, m] = timeStr.split(':');
        const hour = parseInt(h, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const formattedHour = hour % 12 || 12;
        timePart = `${formattedHour}:${m} ${ampm}`;
      }

      return `${dayPart}, ${timePart}`;
    } catch {
      return `${dateStr} ${timeStr}`;
    }
  };

  const handleAcceptClick = () => {
    if (isVisitor) {
      navigate('/login', { state: { from: '/receive' } });
      return;
    }
    if (isDonor) {
      return; // Disabled for donors
    }
    if (isReceiver && onAccept) {
      onAccept(donation);
    }
  };

  return (
    <article 
      className={`group relative bg-white hover:bg-[#FFF8EE] rounded-2xl p-4 sm:p-5 border border-[#E8D9C5] shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
        isAccepted ? 'opacity-80 bg-[#FDF4E7]' : ''
      }`}
    >
      <div className="flex items-start gap-4 flex-1">
        {/* Five Loaves / Food Avatar */}
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#FFEADA] text-[#C98A2B] flex items-center justify-center shrink-0 border border-[#E8D9C5] shadow-sm group-hover:scale-105 transition-transform">
          <HeartHandshake className="w-6 h-6 text-[#845400]" />
        </div>

        <div className="space-y-1.5 flex-1 min-w-0">
          {/* Status & Category Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {isAvailable && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#CCEEA0] text-[#102000] text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5E7B3A] animate-pulse"></span>
                Available Now
              </span>
            )}
            {isAccepted && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FFE3CD] text-[#845400] text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#5E7B3A]" />
                Accepted by {donation.acceptedByName || 'Receiver'}
              </span>
            )}
            {isExpired && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FFDAD8] text-[#7A2E2E] text-xs font-semibold">
                Expired
              </span>
            )}

            <span className="text-xs font-semibold text-[#845400] bg-[#FFDDB5] px-2.5 py-0.5 rounded-full">
              {donation.unit}
            </span>
          </div>

          {/* Heading in Capsule Style: Item · Quantity */}
          <h3 className="font-serif text-lg sm:text-xl font-bold text-[#3B2A1A] group-hover:text-[#845400] transition-colors leading-snug">
            {donation.item} · {donation.quantity} {donation.unit.toLowerCase()}
          </h3>

          {/* Metadata: Pickup Time & Kerala Location */}
          <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs sm:text-sm text-[#514536]">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#5E7B3A] shrink-0" />
              <span>Pickup: {formatFriendlyDate(donation.date, donation.time)}</span>
            </span>

            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#C98A2B] shrink-0" />
              <span>{donation.location}</span>
            </span>

            <span className="inline-flex items-center gap-1.5 text-[#6B5440]">
              <User className="w-3.5 h-3.5" />
              <span>Offered by {donation.donorName}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Action Area */}
      <div className="w-full md:w-auto flex md:flex-col items-center justify-end gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#F5E8D3]">
        {isAvailable && (
          <>
            {isVisitor && (
              <button
                onClick={handleAcceptClick}
                className="w-full md:w-auto px-6 py-2.5 rounded-full bg-[#845400] text-white hover:bg-[#643F00] font-semibold text-sm shadow-sm transition-all transform active:scale-95"
              >
                Accept (Login)
              </button>
            )}

            {isDonor && (
              <button
                disabled
                title="Only receivers can accept"
                className="w-full md:w-auto px-6 py-2.5 rounded-full bg-[#E8D9C5] text-[#837564] cursor-not-allowed font-medium text-sm"
              >
                Accept
              </button>
            )}

            {isReceiver && (
              <button
                onClick={handleAcceptClick}
                className="w-full md:w-auto px-6 py-2.5 rounded-full bg-[#5E7B3A] text-white hover:bg-[#4B6728] font-semibold text-sm shadow-sm transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Accept
              </button>
            )}
          </>
        )}

        {isAccepted && (
          <div className="text-xs font-semibold text-[#5E7B3A] bg-[#CCEEA0]/50 px-3 py-1.5 rounded-full border border-[#B0D186]">
            Claimed
          </div>
        )}

        {isExpired && (
          <div className="text-xs font-medium text-[#7A2E2E] bg-[#FFDAD8]/40 px-3 py-1.5 rounded-full">
            Past pickup time
          </div>
        )}
      </div>
    </article>
  );
}

