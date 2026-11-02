import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import QuoteRotator from '../components/QuoteRotator';
import SaintsRotator from '../components/SaintsRotator';
import StarRating from '../components/StarRating';
import { useData } from '../context/DataContext';
import { ratingsService } from '../services/ratingsService';
import { 
  HeartHandshake, 
  UtensilsCrossed, 
  HandPlatter, 
  Clock, 
  ShieldCheck, 
  MapPin, 
  Sparkles, 
  ArrowRight,
  Building2,
  Users,
  Wheat,
  Smile,
  CheckCircle2,
  Star,
  Award
} from 'lucide-react';
import { CLOSING_VERSE } from '../data/quotes';

export default function Home() {
  const { impactStats } = useData();
  const [topDonors, setTopDonors] = useState([]);

  useEffect(() => {
    ratingsService.listTopDonors(3, 4).then(setTopDonors).catch(console.error);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Hero Section */}
      <section className="relative pt-28 pb-20 sm:pt-36 sm:pb-28 overflow-hidden min-h-[640px] md:min-h-[720px] flex items-center justify-center">
        {/* Main Sacred Loaves & Fish Background from Images/Main Bg for homepage.jpeg */}
        <div 
          className="absolute inset-0 bg-cover bg-center sm:bg-[center_35%] bg-no-repeat" 
          style={{ backgroundImage: `url('/main-bg.jpeg')` }}
          aria-hidden="true"
        />
        {/* Subtle Light Scrim to let the artwork shine clearly */}
        <div className="absolute inset-0 bg-[#FFF8EE]/20" />
        {/* Soft bottom blend to transition smoothly into the impact counter section */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFF8EE]/10 via-transparent to-[#FFF8EE]" />
        
        {/* Subtle decorative background circles */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#C98A2B]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-48 right-10 w-72 h-72 bg-[#5E7B3A]/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          
          {/* Subtle Kerala Sanctuary Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFEADA] text-[#845400] text-xs uppercase tracking-widest font-bold mb-6 border border-[#E8D9C5] shadow-sm">
            <Wheat className="w-4 h-4 text-[#C98A2B]" />
            <span>Kerala’s Sacred Food Sharing Sanctuary</span>
          </div>

          {/* Large Title: ANJAPPAM */}
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#27180A] mb-2 drop-shadow-[0_2px_12px_rgba(255,248,238,0.9)]">
            ANJAPPAM
          </h1>

          {/* Sacred Subtitle */}
          <p className="font-sans text-xs sm:text-sm uppercase tracking-[0.3em] text-[#845400] font-extrabold mb-4 drop-shadow-[0_1px_6px_rgba(255,248,238,0.95)]">
            Five Loaves · Bread for All
          </p>

          {/* Rotating Bible Quote (PRD §8.1 & §10) */}
          <QuoteRotator />

          {/* Two Large Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6 w-full max-w-md">
            <Link
              to="/donate"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#C98A2B] text-white hover:bg-[#845400] font-sans font-bold text-base shadow-[0_8px_24px_rgba(201,138,43,0.35)] hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <HandPlatter className="w-5 h-5" />
              <span>I Have Food</span>
            </Link>

            <Link
              to="/receive"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#FFEADA] hover:bg-[#FFE3CD] text-[#3B2A1A] font-sans font-bold text-base border border-[#E8D9C5] shadow-sm hover:shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <UtensilsCrossed className="w-5 h-5 text-[#5E7B3A]" />
              <span>I Need Food</span>
            </Link>
          </div>

          {/* Five Loaves Pips Indicator */}
          <div className="flex items-center gap-2 mt-8 text-xs font-semibold text-[#837564] uppercase tracking-wider">
            <span>Consecrated Portions:</span>
            <div className="flex items-center gap-1 text-[#C98A2B]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C98A2B] shadow-sm"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#C98A2B] shadow-sm"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#C98A2B] shadow-sm"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#C98A2B] shadow-sm"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#C98A2B] shadow-sm"></span>
            </div>
          </div>

        </div>
      </section>

      {/* Saints on Sharing Food (PRD §8.1) */}
      <SaintsRotator />

      {/* Top-Rated Donors Section (PRD §8.7) - Shown only if at least 3 donors qualify */}
      {topDonors.length >= 3 && (
        <section className="py-16 bg-[#FFFDF9] border-t border-[#E8D9C5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFEADA] text-[#845400] text-xs font-bold uppercase tracking-wider mb-2 border border-[#E8D9C5]">
                <Award className="w-3.5 h-3.5 text-[#C98A2B]" />
                <span>Faithful Stewards</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#3B2A1A] tracking-tight">
                Top-Rated Food Donors
              </h2>
              <p className="text-sm sm:text-base text-[#514536] mt-2 leading-relaxed">
                Celebrating Kerala caterers and kitchens recognized by shelters for punctual food pickups, warmth, and nutritious abundance.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {topDonors.map((donor) => (
                <Link
                  key={donor.id}
                  to={`/donors/${donor.id}`}
                  className="group bg-white rounded-3xl p-6 border border-[#E8D9C5] shadow-sm hover:shadow-md hover:border-[#C98A2B] transition-all flex flex-col justify-between transform hover:-translate-y-1"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-[#FFEADA] text-[#845400] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform border border-[#E8D9C5]">
                      <Building2 className="w-6 h-6 text-[#845400]" />
                    </div>

                    <h3 className="font-serif text-lg font-bold text-[#3B2A1A] group-hover:text-[#845400] transition-colors leading-snug line-clamp-2 mb-2">
                      {donor.institutionName}
                    </h3>

                    {/* Star Rating & Count */}
                    <div className="flex items-center gap-2 mb-3">
                      <StarRating mode="display" value={donor.averageRating} size={15} id={`home-top-${donor.id}`} />
                      <span className="text-xs font-bold text-[#3B2A1A]">
                        {donor.averageRating.toFixed(1)}
                      </span>
                      <span className="text-xs text-[#837564]">
                        ({donor.ratingCount})
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#F5EFE6] flex items-center justify-between text-xs text-[#514536]">
                    <span className="inline-flex items-center gap-1 font-medium text-[#5E7B3A]">
                      <HeartHandshake className="w-3.5 h-3.5" />
                      <span>{donor.mealsShared.toLocaleString()} meals shared</span>
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#C98A2B] group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Impact Counters Section (PRD §8.1) */}
      <section className="py-16 bg-[#FFF8EE] border-y border-[#E8D9C5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
            
            <div className="p-6 rounded-3xl bg-white border border-[#E8D9C5] shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#FFEADA] text-[#845400] flex items-center justify-center mx-auto mb-3">
                <UtensilsCrossed className="w-6 h-6 text-[#C98A2B]" />
              </div>
              <p className="font-serif text-3xl sm:text-4xl font-bold text-[#3B2A1A] mb-1">
                {impactStats.mealsShared.toLocaleString()}+
              </p>
              <p className="text-xs uppercase tracking-wider text-[#837564] font-semibold">
                Meals Shared Freely
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-[#E8D9C5] shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#FFEADA] text-[#845400] flex items-center justify-center mx-auto mb-3">
                <HandPlatter className="w-6 h-6 text-[#5E7B3A]" />
              </div>
              <p className="font-serif text-3xl sm:text-4xl font-bold text-[#3B2A1A] mb-1">
                {impactStats.activeDonors}+
              </p>
              <p className="text-xs uppercase tracking-wider text-[#837564] font-semibold">
                Active Donors & Caterers
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-[#E8D9C5] shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#FFEADA] text-[#845400] flex items-center justify-center mx-auto mb-3">
                <Building2 className="w-6 h-6 text-[#7A2E2E]" />
              </div>
              <p className="font-serif text-3xl sm:text-4xl font-bold text-[#3B2A1A] mb-1">
                {impactStats.receivingInstitutions}+
              </p>
              <p className="text-xs uppercase tracking-wider text-[#837564] font-semibold">
                Shelters & Care Homes
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-[#E8D9C5] shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#FFEADA] text-[#845400] flex items-center justify-center mx-auto mb-3">
                <MapPin className="w-6 h-6 text-[#845400]" />
              </div>
              <p className="font-serif text-3xl sm:text-4xl font-bold text-[#3B2A1A] mb-1">
                {impactStats.districtsServed}
              </p>
              <p className="text-xs uppercase tracking-wider text-[#837564] font-semibold">
                Kerala Districts Active
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* How It Works (PRD §8.1: 4 Steps) */}
      <section className="py-20 bg-[#FFF1E8]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase font-bold tracking-widest text-[#845400] bg-[#FFEADA] px-3.5 py-1 rounded-full border border-[#E8D9C5]">
              Simplicity & Grace
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#3B2A1A] mt-3 mb-4">
              How Food Flows in Fellowship
            </h2>
            <p className="text-sm sm:text-base text-[#514536]">
              A direct, respectful connection from the kitchen hearth to those seeking wholesome nourishment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* Step 1 */}
            <div className="bg-white rounded-3xl p-6 border border-[#E8D9C5] shadow-sm flex flex-col relative group hover:-translate-y-1 transition-all">
              <div className="w-10 h-10 rounded-full bg-[#C98A2B] text-white flex items-center justify-center font-bold text-sm mb-4 shadow-sm">
                1
              </div>
              <h3 className="font-serif text-lg font-bold text-[#3B2A1A] mb-2">Donor Posts Surplus</h3>
              <p className="text-xs sm:text-sm text-[#514536] leading-relaxed">
                A restaurant, wedding caterer, or family posts available food specifying item name, portions, pickup time, and Kerala locality.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-3xl p-6 border border-[#E8D9C5] shadow-sm flex flex-col relative group hover:-translate-y-1 transition-all">
              <div className="w-10 h-10 rounded-full bg-[#845400] text-white flex items-center justify-center font-bold text-sm mb-4 shadow-sm">
                2
              </div>
              <h3 className="font-serif text-lg font-bold text-[#3B2A1A] mb-2">Receiver Accepts</h3>
              <p className="text-xs sm:text-sm text-[#514536] leading-relaxed">
                An orphanage, shelter caretaker, or community member browses available donations and claims the meal with a single tap.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-3xl p-6 border border-[#E8D9C5] shadow-sm flex flex-col relative group hover:-translate-y-1 transition-all">
              <div className="w-10 h-10 rounded-full bg-[#5E7B3A] text-white flex items-center justify-center font-bold text-sm mb-4 shadow-sm">
                3
              </div>
              <h3 className="font-serif text-lg font-bold text-[#3B2A1A] mb-2">Pickup Arranged</h3>
              <p className="text-xs sm:text-sm text-[#514536] leading-relaxed">
                Direct contact details and address are revealed immediately. Both parties coordinate prompt and respectful collection.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-3xl p-6 border border-[#E8D9C5] shadow-sm flex flex-col relative group hover:-translate-y-1 transition-all">
              <div className="w-10 h-10 rounded-full bg-[#7A2E2E] text-white flex items-center justify-center font-bold text-sm mb-4 shadow-sm">
                4
              </div>
              <h3 className="font-serif text-lg font-bold text-[#3B2A1A] mb-2">Nourishment Shared</h3>
              <p className="text-xs sm:text-sm text-[#514536] leading-relaxed">
                Fresh food is served with dignity and gratitude, turning potential food waste into a sacred blessing of community love.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Who Can Give / Who Can Receive (PRD §8.1: Two Cards) */}
      <section className="py-20 bg-[#FFF8EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#3B2A1A] mb-3">
              All Are Welcome at the Table
            </h2>
            <p className="text-sm sm:text-base text-[#514536]">
              Whether you have loaves to spare or hearts to feed, Anjappam welcomes your participation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Donors Card */}
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#E8D9C5] shadow-md flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#FFEADA] text-[#845400] flex items-center justify-center mb-6">
                  <HandPlatter className="w-6 h-6 text-[#C98A2B]" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#3B2A1A] mb-3">Who Can Give?</h3>
                <p className="text-sm text-[#514536] leading-relaxed mb-6">
                  Anyone in Kerala with excess clean, prepared meals:
                </p>
                <ul className="space-y-3 text-sm text-[#514536] mb-8">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#5E7B3A] shrink-0" />
                    <span>Wedding & Event Caterers with surplus hot meals</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#5E7B3A] shrink-0" />
                    <span>Restaurants, Cafes & Hotels at closing shifts</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#5E7B3A] shrink-0" />
                    <span>Neighborhood Bakeries with daily fresh breads & buns</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#5E7B3A] shrink-0" />
                    <span>Church Parish Feasts, Retreat Centers & Families</span>
                  </li>
                </ul>
              </div>
              <Link
                to="/donate"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#C98A2B] text-white hover:bg-[#845400] font-semibold text-sm transition-all"
              >
                <span>Pledge Surplus Food</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Receivers Card */}
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#E8D9C5] shadow-md flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#FFEADA] text-[#5E7B3A] flex items-center justify-center mb-6">
                  <UtensilsCrossed className="w-6 h-6 text-[#5E7B3A]" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#3B2A1A] mb-3">Who Can Receive?</h3>
                <p className="text-sm text-[#514536] leading-relaxed mb-6">
                  Institutions, community shelters, and families seeking food provision:
                </p>
                <ul className="space-y-3 text-sm text-[#514536] mb-8">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#5E7B3A] shrink-0" />
                    <span>Orphanages & Children&apos;s Homes across Kerala</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#5E7B3A] shrink-0" />
                    <span>Elderly Care Homes (*Snehabhavans*) & Day Sanctuaries</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#5E7B3A] shrink-0" />
                    <span>Charity Hospices, Relief Camps & Rehabilitation Centers</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#5E7B3A] shrink-0" />
                    <span>Individuals & Families facing unexpected hardship</span>
                  </li>
                </ul>
              </div>
              <Link
                to="/receive"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#5E7B3A] text-white hover:bg-[#4B6728] font-semibold text-sm transition-all"
              >
                <span>Browse Available Meals</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Why Food Waste Matters (PRD §8.1: paragraph + 3 highlights) */}
      <section className="py-20 bg-[#FFEADA]/60 border-t border-[#E8D9C5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="text-xs uppercase font-bold tracking-widest text-[#7A2E2E]">
              Stewardship & Conscience
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#3B2A1A] mt-2 mb-4">
              Why Food Waste Matters
            </h2>
            <p className="text-sm sm:text-base text-[#514536] leading-relaxed">
              Every day, thousands of kilograms of wholesome, freshly prepared food in Kerala banquet halls and eateries are discarded simply because coordination is difficult, while nearby shelters struggle to balance kitchen budgets. Food is God&apos;s sacred bounty; sharing it honors both the Creator and the recipient.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-white p-6 rounded-3xl border border-[#E8D9C5] shadow-sm">
              <div className="w-10 h-10 rounded-2xl bg-[#FFDAD8] text-[#7A2E2E] flex items-center justify-center mb-4">
                <Wheat className="w-5 h-5" />
              </div>
              <h4 className="font-serif text-lg font-bold text-[#3B2A1A] mb-2">Sacred Stewardship</h4>
              <p className="text-xs sm:text-sm text-[#514536] leading-relaxed">
                When Jesus fed the multitude, he instructed his disciples to &ldquo;gather up the fragments that remain, that nothing be lost&rdquo; (John 6:12). Waste diminishes dignity; sharing restores it.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#E8D9C5] shadow-sm">
              <div className="w-10 h-10 rounded-2xl bg-[#FFE3CD] text-[#845400] flex items-center justify-center mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="font-serif text-lg font-bold text-[#3B2A1A] mb-2">Time-Critical Blessing</h4>
              <p className="text-xs sm:text-sm text-[#514536] leading-relaxed">
                Cooked food has a golden window. By connecting donors and nearby receivers instantly within the same locality, food arrives hot, fresh, and appetizing.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#E8D9C5] shadow-sm">
              <div className="w-10 h-10 rounded-2xl bg-[#CCEEA0] text-[#5E7B3A] flex items-center justify-center mb-4">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h4 className="font-serif text-lg font-bold text-[#3B2A1A] mb-2">Community Resilience</h4>
              <p className="text-xs sm:text-sm text-[#514536] leading-relaxed">
                Shelter homes can reallocate limited financial donations toward healthcare, education, and shelter maintenance when daily meals are supported by local kitchens.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Stories / Testimonials (PRD §8.1) */}
      <section className="py-20 bg-[#FFF8EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase font-bold tracking-widest text-[#5E7B3A]">
              Voices of Grace
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#3B2A1A] mt-2 mb-3">
              Stories from Kerala’s Shared Tables
            </h2>
            <p className="text-sm sm:text-base text-[#514536]">
              Real connections forged in faith across Ernakulam, Thrissur, and beyond.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E8D9C5] shadow-sm flex flex-col justify-between">
              <p className="italic text-xs sm:text-sm text-[#514536] leading-relaxed mb-6">
                &ldquo;After a 600-guest wedding banquet in Edappally, we had 75 untouched portions of chicken biriyani. Within 30 minutes of posting on Anjappam, St. Joseph’s Shelter arranged pickup. The relief of seeing food bless children rather than enter a bin is indescribable.&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-[#F5E8D3]">
                <div className="w-10 h-10 rounded-full bg-[#FFEADA] flex items-center justify-center font-serif font-bold text-[#845400]">
                  T
                </div>
                <div>
                  <h5 className="font-bold text-xs sm:text-sm text-[#3B2A1A]">Thomas Mathew</h5>
                  <p className="text-xs text-[#837564]">Malabar Palace Caterers, Kochi</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E8D9C5] shadow-sm flex flex-col justify-between">
              <p className="italic text-xs sm:text-sm text-[#514536] leading-relaxed mb-6">
                &ldquo;Our care home houses 42 senior residents. Receiving hot meals and fresh bakery bread directly from neighborhood donors brings the elders such joy and reminds them that society has not forgotten them. Anjappam has been a true Godsend.&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-[#F5E8D3]">
                <div className="w-10 h-10 rounded-full bg-[#CCEEA0] flex items-center justify-center font-serif font-bold text-[#5E7B3A]">
                  G
                </div>
                <div>
                  <h5 className="font-bold text-xs sm:text-sm text-[#3B2A1A]">Sr. Gracy Joseph</h5>
                  <p className="text-xs text-[#837564]">St. Joseph&apos;s Shelter, Kakkanad</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E8D9C5] shadow-sm flex flex-col justify-between">
              <p className="italic text-xs sm:text-sm text-[#514536] leading-relaxed mb-6">
                &ldquo;At Cochin Breadworks, baking fresh loaves daily means unsold items each evening. Knowing they go directly to the night shelter near Aluva gives our entire bakery team purposeful meaning in our daily craft.&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-[#F5E8D3]">
                <div className="w-10 h-10 rounded-full bg-[#FFDDB5] flex items-center justify-center font-serif font-bold text-[#845400]">
                  M
                </div>
                <div>
                  <h5 className="font-bold text-xs sm:text-sm text-[#3B2A1A]">Mariam Varghese</h5>
                  <p className="text-xs text-[#837564]">Cochin Breadworks, Aluva</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Closing Emphasis Section: Matthew 25:40 Pull-Quote (PRD §8.1) */}
      <section className="py-24 bg-gradient-to-b from-[#FFF1E8] to-[#FFF8EE] border-t border-[#E8D9C5] text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          
          <div className="w-14 h-14 rounded-full bg-[#FFEADA] text-[#C98A2B] flex items-center justify-center mb-6 shadow-sm border border-[#E8D9C5]">
            <Sparkles className="w-7 h-7 text-[#845400]" />
          </div>

          <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#845400] mb-4">
            Sharing Food is an Act of Kindness
          </span>

          {/* Large Pull-Quote: Matthew 25:40 */}
          <blockquote className="font-serif text-2xl sm:text-3xl md:text-4xl italic font-semibold text-[#27180A] leading-tight max-w-3xl mb-4">
            &ldquo;{CLOSING_VERSE.verse}&rdquo;
          </blockquote>
          
          <p className="font-sans text-sm uppercase tracking-widest text-[#C98A2B] font-bold mb-8">
            — {CLOSING_VERSE.reference}
          </p>

          <div className="max-w-2xl text-sm sm:text-base text-[#514536] space-y-4 leading-relaxed mb-10 text-center">
            <p>
              In Christian faith and Kerala’s venerable tradition of *athithya maryada* (sacred hospitality), extending food to the hungry is not mere charity—it is an encounter with the divine in our neighbor. Every portion offered is an affirmation of mutual human dignity.
            </p>
            <p>
              By bridging the gap between abundant kitchens and hungry tables, we turn potential waste into community blessings, ensuring no bread is lost and no brother or sister goes to bed hungry.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
            <Link
              to="/donate"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#C98A2B] text-white hover:bg-[#845400] font-bold text-base shadow-md hover:shadow-xl transition-all"
            >
              <HandPlatter className="w-5 h-5" />
              <span>I Have Food</span>
            </Link>

            <Link
              to="/receive"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#5E7B3A] text-white hover:bg-[#4B6728] font-bold text-base shadow-md hover:shadow-xl transition-all"
            >
              <UtensilsCrossed className="w-5 h-5" />
              <span>I Need Food</span>
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}

