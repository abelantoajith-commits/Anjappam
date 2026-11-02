import React, { useState, useEffect } from 'react';
import { ROTATING_QUOTES } from '../data/quotes';
import { Quote } from 'lucide-react';

export default function QuoteRotator() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [fadeState, setFadeState] = useState(true);

  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      // Trigger fade out
      setFadeState(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % ROTATING_QUOTES.length);
        setFadeState(true);
      }, 350);
    }, 8000);

    return () => clearInterval(interval);
  }, [isHovered]);

  const handleSelect = (idx) => {
    if (idx === currentIndex) return;
    setFadeState(false);
    setTimeout(() => {
      setCurrentIndex(idx);
      setFadeState(true);
    }, 250);
  };

  const currentQuote = ROTATING_QUOTES[currentIndex];

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="max-w-2xl mx-auto my-6 p-6 sm:p-7 rounded-3xl bg-white/90 backdrop-blur-md border border-[#E8D9C5] shadow-[0_8px_30px_rgba(59,42,26,0.06)] transition-all duration-300 relative group"
      aria-live="polite"
    >
      <div className="flex flex-col items-center text-center">
        <Quote className="w-6 h-6 text-[#C98A2B]/40 mb-2 rotate-180 group-hover:text-[#C98A2B] transition-colors" />

        <div className="min-h-[90px] sm:min-h-[75px] flex flex-col items-center justify-center">
          <p
            className={`font-serif text-lg sm:text-xl italic text-[#27180A] leading-relaxed transition-opacity duration-300 ${
              fadeState ? 'opacity-100' : 'opacity-0'
            }`}
          >
            &ldquo;{currentQuote.verse}&rdquo;
          </p>
          <span
            className={`text-xs uppercase font-bold tracking-widest text-[#845400] mt-2 transition-opacity duration-300 ${
              fadeState ? 'opacity-100' : 'opacity-0'
            }`}
          >
            — {currentQuote.reference}
          </span>
        </div>

        {/* Carousel Dot Indicators */}
        <div className="flex items-center justify-center gap-2 mt-4 pt-1">
          {ROTATING_QUOTES.map((quote, idx) => (
            <button
              key={quote.id}
              onClick={() => handleSelect(idx)}
              className={`rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? 'w-6 h-2 bg-[#C98A2B]'
                  : 'w-2 h-2 bg-[#D6C4B1] hover:bg-[#C98A2B]/60'
              }`}
              aria-label={`Jump to verse ${idx + 1}: ${quote.reference}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

