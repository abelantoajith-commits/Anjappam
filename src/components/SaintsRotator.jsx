import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SAINTS } from '../data/saints';
import { ChevronLeft, ChevronRight, Quote, Sparkles } from 'lucide-react';

export default function SaintsRotator() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const timerRef = useRef(null);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const listener = (e) => setReducedMotion(e.matches);
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', listener);
    } else {
      mediaQuery.addListener(listener);
    }
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', listener);
      } else {
        mediaQuery.removeListener(listener);
      }
    };
  }, []);

  // Preload next image
  useEffect(() => {
    const nextIdx = (currentIndex + 1) % SAINTS.length;
    const img = new Image();
    img.src = SAINTS[nextIdx].image;
  }, [currentIndex]);

  const changeSlide = useCallback((newIndex) => {
    if (reducedMotion) {
      setCurrentIndex(newIndex);
      return;
    }

    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(newIndex);
      setIsTransitioning(false);
    }, 300); // 300ms fade out, then fade in = ~600ms total
  }, [reducedMotion]);

  const goToPrev = () => {
    const prevIdx = (currentIndex - 1 + SAINTS.length) % SAINTS.length;
    changeSlide(prevIdx);
  };

  const goToNext = useCallback(() => {
    const nextIdx = (currentIndex + 1) % SAINTS.length;
    changeSlide(nextIdx);
  }, [currentIndex, changeSlide]);

  // Auto-advance every 10 seconds (unless paused or reduced motion)
  useEffect(() => {
    if (reducedMotion || isPaused) return;

    timerRef.current = setInterval(() => {
      goToNext();
    }, 10000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [goToNext, isPaused, reducedMotion]);

  // Reset timer on user interaction
  const handleUserNav = (action) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    action();
  };

  const current = SAINTS[currentIndex];

  return (
    <section 
      aria-label="Saints on Sharing Food"
      className="py-16 sm:py-20 bg-[#FFF8EE] border-b border-[#E8D9C5] relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Two-Column Card Container */}
        <div className="bg-[#FFF1E8]/70 rounded-3xl border border-[#E8D9C5] p-6 sm:p-10 shadow-[0_8px_30px_rgba(59,42,26,0.05)] relative">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Saint Image with decorative warm gold arch / glow */}
            <div className="md:col-span-5 flex flex-col items-center justify-center">
              <div className="relative w-full max-w-[280px] sm:max-w-[320px] h-[280px] sm:h-[320px] md:h-[380px] flex items-center justify-center">
                
                {/* Decorative Warm Gold Arch and Radial Glow behind cutout */}
                <div 
                  className="absolute inset-x-4 bottom-2 top-6 bg-gradient-to-t from-[#C98A2B]/25 via-[#FFEADA] to-[#FFF8EE] rounded-t-full rounded-b-2xl border-t-2 border-x-2 border-[#C98A2B]/30 shadow-inner pointer-events-none" 
                  aria-hidden="true" 
                />
                <div 
                  className="absolute w-44 h-44 sm:w-56 sm:h-56 bg-[#C98A2B]/15 rounded-full blur-2xl pointer-events-none" 
                  aria-hidden="true" 
                />

                {/* Saint Cutout Image - No crop, no recolor, object-contain */}
                <img
                  src={current.image}
                  alt={`${current.name} - ${current.title}`}
                  className={`relative z-10 w-full h-full object-contain drop-shadow-[0_10px_20px_rgba(59,42,26,0.18)] transition-all duration-[600ms] ${
                    isTransitioning && !reducedMotion
                      ? 'opacity-0 scale-95'
                      : 'opacity-100 scale-100'
                  }`}
                  loading="eager"
                />
              </div>
            </div>

            {/* Right Column: Saint Text & Information */}
            <div className="md:col-span-7 flex flex-col justify-center text-left">
              
              {/* Section Tag */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFEADA] text-[#845400] text-xs uppercase font-bold tracking-wider mb-4 border border-[#E8D9C5] w-fit">
                <Sparkles className="w-3.5 h-3.5 text-[#C98A2B]" />
                <span>Saints on Sharing Food</span>
              </div>

              {/* Dynamic Text Container with aria-live="polite" */}
              <div 
                aria-live="polite"
                className={`min-h-[170px] sm:min-h-[190px] flex flex-col justify-center transition-all duration-[600ms] ${
                  isTransitioning && !reducedMotion ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0'
                }`}
              >
                
                {/* 1 & 2. Quote and About Kinds: large italic Playfair Display inside quotation marks */}
                {(current.kind === 'quote' || current.kind === 'about') && (
                  <div className="relative">
                    <Quote className="w-8 h-8 text-[#C98A2B]/30 -ml-1 mb-1 rotate-180" aria-hidden="true" />
                    <blockquote className="font-serif italic text-2xl sm:text-3xl md:text-3xl font-semibold text-[#3B2A1A] leading-snug">
                      &ldquo;{current.text}&rdquo;
                    </blockquote>
                  </div>
                )}

                {/* 3. Teaching Kind: regular non-italic serif WITHOUT quotation marks, label "Taught by the saint" */}
                {current.kind === 'teaching' && (
                  <div>
                    <span className="text-xs uppercase font-bold tracking-widest text-[#5E7B3A] block mb-2">
                      Taught by the saint
                    </span>
                    <p className="font-serif text-xl sm:text-2xl md:text-2xl font-normal text-[#3B2A1A] leading-relaxed">
                      {current.text}
                    </p>
                  </div>
                )}

                {/* 4. Tradition Kind: regular non-italic serif WITHOUT quotation marks, label "Remembered for" */}
                {current.kind === 'tradition' && (
                  <div>
                    <span className="text-xs uppercase font-bold tracking-widest text-[#845400] block mb-2">
                      Remembered for
                    </span>
                    <p className="font-serif text-xl sm:text-2xl md:text-2xl font-normal text-[#3B2A1A] leading-relaxed">
                      {current.text}
                    </p>
                  </div>
                )}

                {/* Metadata: Label (for about), Name in gold, Title, and Source beneath */}
                <div className="mt-5 pt-4 border-t border-[#E8D9C5]/80">
                  {current.kind === 'about' && (
                    <span className="text-xs uppercase font-bold tracking-widest text-[#7A2E2E] block mb-1">
                      Words about the saint
                    </span>
                  )}
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#C98A2B] tracking-tight">
                    {current.name}
                  </h3>
                  <p className="text-xs uppercase font-semibold tracking-wider text-[#514536] mt-0.5">
                    {current.title}
                  </p>
                  <p className="text-xs text-[#837564] mt-1 font-sans">
                    Source: {current.source}
                  </p>
                </div>

              </div>

              {/* Navigation Controls: Arrows and Dots */}
              <div className="flex items-center justify-between mt-6 pt-2">
                
                {/* Dot Indicators */}
                <div className="flex items-center gap-2">
                  {SAINTS.map((saint, idx) => (
                    <button
                      key={saint.id}
                      onClick={() => handleUserNav(() => changeSlide(idx))}
                      aria-label={`Jump to ${saint.name}`}
                      className={`rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#C98A2B] ${
                        idx === currentIndex
                          ? 'w-7 h-2.5 bg-[#C98A2B]'
                          : 'w-2.5 h-2.5 bg-[#D6C4B1] hover:bg-[#C98A2B]/60'
                      }`}
                    />
                  ))}
                </div>

                {/* Prev / Next Arrows */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUserNav(goToPrev)}
                    aria-label="Previous saint"
                    className="p-2.5 rounded-full bg-white text-[#3B2A1A] hover:bg-[#FFEADA] border border-[#E8D9C5] shadow-sm hover:shadow transition-all focus:outline-none focus:ring-2 focus:ring-[#C98A2B]"
                  >
                    <ChevronLeft className="w-5 h-5 text-[#845400]" />
                  </button>

                  <button
                    onClick={() => handleUserNav(goToNext)}
                    aria-label="Next saint"
                    className="p-2.5 rounded-full bg-white text-[#3B2A1A] hover:bg-[#FFEADA] border border-[#E8D9C5] shadow-sm hover:shadow transition-all focus:outline-none focus:ring-2 focus:ring-[#C98A2B]"
                  >
                    <ChevronRight className="w-5 h-5 text-[#845400]" />
                  </button>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
