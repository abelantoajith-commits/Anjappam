import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Users, Clock, MapPin, CheckCircle, Home, HeartHandshake } from 'lucide-react';

export default function RequestCapsule({ request, onAccept }) {
  const { user, isDonor, isReceiver, isVisitor } = useAuth();
  const navigate = useNavigate();

  const isOpen = request.status === 'open';
  const isAccepted = request.status === 'accepted';
  const isOwnRequest = user && user.id === request.receiverId;

  // Format date and time
  const formatNeededTime = (dateStr, timeStr) => {
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

      let timePart = timeStr || '';
      if (timeStr && timeStr.includes(':')) {
        const [h, m] = timeStr.split(':');
        const hour = parseInt(h, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const formattedHour = hour % 12 || 12;
        timePart = `${formattedHour}:${m} ${ampm}`;
      }

      return `Needed ${dayPart} by ${timePart}`;
    } catch {
      return `Needed by ${dateStr} ${timeStr}`;
    }
  };

  const handleAcceptClick = () => {
    if (isVisitor) {
      navigate('/login', { state: { from: '/requests' } });
      return;
    }
    if (isDonor && onAccept) {
      onAccept(request);
    }
  };

  return (
    <article
      className={`group relative bg-white hover:bg-[#FFF8EE] rounded-2xl p-5 border border-[#E8D9C5] shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
        isAccepted ? 'bg-[#FDF4E7] opacity-85' : ''
      }`}
    >
      <div className="flex items-start gap-4 flex-1">
        {/* Shelter / Receiver Icon */}
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#FFEADA] text-[#845400] flex items-center justify-center shrink-0 border border-[#E8D9C5] group-hover:scale-105 transition-transform">
          <Users className="w-6 h-6 text-[#C98A2B]" />
        </div>

        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            {isOpen ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#CCEEA0] text-[#102000] text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5E7B3A] animate-pulse"></span>
                Open Need
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FFE3CD] text-[#845400] text-xs font-semibold">
                <CheckCircle className="w-3.5 h-3.5 text-[#5E7B3A]" />
                Fulfilled by {request.donorName || request.acceptedByName || 'Donor'}
              </span>
            )}

            <span className="text-xs font-bold text-[#7A2E2E] bg-[#FFDAD8] px-2.5 py-0.5 rounded-full">
              For {request.numberOfPeople} people
            </span>

            {isOwnRequest && (
              <span className="text-[11px] font-semibold text-[#845400] bg-[#FFDDB5] px-2 py-0.5 rounded-full">
                Your Shelter Request
              </span>
            )}
          </div>

          {/* PRD OVERRIDE READOUT: "Biriyani · for 50 people · Kakkanad, Kochi · Accept" */}
          <h3 className="font-serif text-lg sm:text-xl font-bold text-[#3B2A1A] group-hover:text-[#845400] transition-colors">
            {request.item} · for {request.numberOfPeople} people · {request.location}
          </h3>

          <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs sm:text-sm text-[#514536]">
            <span className="inline-flex items-center gap-1.5 font-medium text-[#7A2E2E]">
              <Clock className="w-4 h-4 shrink-0" />
              <span>{formatNeededTime(request.neededByDate, request.neededByTime)}</span>
            </span>

            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#C98A2B] shrink-0" />
              <span>{request.location}</span>
            </span>

            <span className="inline-flex items-center gap-1.5 text-[#6B5440]">
              <Home className="w-3.5 h-3.5" />
              <span>Requested by {request.receiverName}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="w-full md:w-auto flex md:flex-col items-center justify-end gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#F5E8D3]">
        {isOpen && (
          <>
            {isVisitor && (
              <button
                onClick={handleAcceptClick}
                className="w-full md:w-auto px-6 py-2.5 rounded-full bg-[#845400] text-white hover:bg-[#643F00] font-semibold text-sm shadow-sm transition-all transform active:scale-95"
              >
                Accept (Donor Login)
              </button>
            )}

            {isDonor && (
              <button
                onClick={handleAcceptClick}
                className="w-full md:w-auto px-6 py-2.5 rounded-full bg-[#C98A2B] text-white hover:bg-[#845400] font-semibold text-sm shadow-sm transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Accept Request
              </button>
            )}

            {isReceiver && !isOwnRequest && (
              <button
                disabled
                title="Only donors can accept food requests"
                className="w-full md:w-auto px-6 py-2.5 rounded-full bg-[#E8D9C5] text-[#837564] cursor-not-allowed font-medium text-sm"
              >
                Accept
              </button>
            )}

            {isReceiver && isOwnRequest && (
              <div className="text-xs font-semibold text-[#845400] bg-[#FFEADA] px-3 py-1.5 rounded-full border border-[#E8D9C5]">
                Awaiting Donor
              </div>
            )}
          </>
        )}

        {isAccepted && (
          <div className="text-xs font-semibold text-[#5E7B3A] bg-[#CCEEA0]/60 px-3 py-1.5 rounded-full border border-[#B0D186]">
            Fulfillment Arranged
          </div>
        )}
      </div>
    </article>
  );
}

