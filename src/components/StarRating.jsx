import React, { useState } from 'react';
import { Star } from 'lucide-react';

/**
 * Reusable StarRating component supporting 'display' and 'input' modes.
 * - display: Renders 5 stars with full/half/empty fill based on rating value.
 * - input: Interactive 1-5 star selector with hover states, keyboard navigation (Arrow keys).
 */
export default function StarRating({
  mode = 'display', // 'display' | 'input'
  value = 0,
  onChange,
  size = 18,
  className = '',
  id = 'star-rating',
}) {
  const [hoverValue, setHoverValue] = useState(0);

  if (mode === 'input') {
    const activeValue = hoverValue || value || 0;

    const handleKeyDown = (e, star) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        e.preventDefault();
        const next = Math.min(5, (value || 0) + 1);
        if (onChange) onChange(next);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        e.preventDefault();
        const prev = Math.max(1, (value || 1) - 1);
        if (onChange) onChange(prev);
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (onChange) onChange(star);
      }
    };

    return (
      <div
        role="radiogroup"
        aria-label="Donor rating from 1 to 5 stars"
        className={`inline-flex items-center gap-1.5 ${className}`}
        onMouseLeave={() => setHoverValue(0)}
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= activeValue;
          return (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={value === star}
              aria-label={`${star} star${star > 1 ? 's' : ''}`}
              tabIndex={value === star || (!value && star === 1) ? 0 : -1}
              onMouseEnter={() => setHoverValue(star)}
              onClick={() => onChange && onChange(star)}
              onKeyDown={(e) => handleKeyDown(e, star)}
              className="p-1 rounded-md transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#C98A2B] focus:ring-offset-1 text-[#C98A2B]"
            >
              <Star
                size={size}
                className={isFilled ? 'fill-[#C98A2B] text-[#C98A2B]' : 'fill-[#E8DFD3] text-[#D4C3AF]'}
              />
            </button>
          );
        })}
      </div>
    );
  }

  // Display mode
  const numericValue = typeof value === 'number' && !isNaN(value) ? value : 0;
  const uniqueId = `star-grad-${id}`;

  return (
    <div
      className={`inline-flex items-center gap-1 ${className}`}
      aria-label={`${numericValue.toFixed(1)} out of 5 stars`}
    >
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id={`${uniqueId}-half`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="50%" stopColor="#C98A2B" />
            <stop offset="50%" stopColor="#E8DFD3" />
          </linearGradient>
        </defs>
      </svg>

      {[1, 2, 3, 4, 5].map((star) => {
        const diff = numericValue - (star - 1);
        let fillType = 'empty';

        if (diff >= 0.75) {
          fillType = 'full';
        } else if (diff >= 0.25) {
          fillType = 'half';
        }

        return (
          <span key={star} className="inline-block leading-none">
            {fillType === 'full' && (
              <Star size={size} className="fill-[#C98A2B] text-[#C98A2B]" />
            )}
            {fillType === 'half' && (
              <Star
                size={size}
                style={{ fill: `url(#${uniqueId}-half)` }}
                className="text-[#C98A2B]"
              />
            )}
            {fillType === 'empty' && (
              <Star size={size} className="fill-[#E8DFD3] text-[#D4C3AF]" />
            )}
          </span>
        );
      })}
    </div>
  );
}
