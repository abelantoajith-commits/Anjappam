import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, Database, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#FFEADA] text-[#3B2A1A] border-t border-[#E8D9C5] pt-16 pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Brand & Mission */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <img src="/logo.svg" alt="Anjappam Logo" className="w-8 h-8 rounded-full shadow-sm" />
              <span className="font-serif text-2xl font-bold tracking-tight text-[#3B2A1A]">
                ANJAPPAM
              </span>
            </div>
            <p className="text-xs uppercase tracking-widest text-[#845400] font-bold">
              Five Loaves · Bread for All
            </p>
            <p className="text-sm text-[#514536] leading-relaxed">
              A Christian food-sharing sanctuary across Kerala, connecting generous restaurants, caterers, and homes with community shelters and families in need.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF8EE] text-xs text-[#5E7B3A] font-semibold border border-[#E8D9C5]">
              <Heart className="w-3.5 h-3.5 fill-[#5E7B3A]" />
              <span>A Christian Charitable Initiative</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-semibold text-[#3B2A1A]">Sanctuary Navigation</h4>
            <ul className="space-y-2 text-sm text-[#514536]">
              <li>
                <Link to="/" className="hover:text-[#845400] transition-colors">
                  Home Sanctuary
                </Link>
              </li>
              <li>
                <Link to="/donate" className="hover:text-[#845400] transition-colors">
                  Donate Food (For Donors)
                </Link>
              </li>
              <li>
                <Link to="/receive" className="hover:text-[#845400] transition-colors">
                  Receive Food (Available Meals)
                </Link>
              </li>
              <li>
                <Link to="/requests" className="hover:text-[#845400] transition-colors">
                  Community Food Requests
                </Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-[#845400] transition-colors">
                  Registration Form
                </Link>
              </li>
            </ul>
          </div>

          {/* Region & Food Safety */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-semibold text-[#3B2A1A]">Region & Safety</h4>
            <div className="flex items-start gap-2 text-sm text-[#514536]">
              <MapPin className="w-4 h-4 text-[#845400] shrink-0 mt-0.5" />
              <span>Serving Kochi, Thrissur, Kozhikode, Trivandrum & across all 14 districts of Kerala.</span>
            </div>
            <div className="flex items-start gap-2 text-xs text-[#514536] bg-[#FFF8EE] p-3 rounded-2xl border border-[#E8D9C5]">
              <ShieldCheck className="w-4 h-4 text-[#5E7B3A] shrink-0 mt-0.5" />
              <span>
                <strong>Food-Safety Commitment:</strong> Food donors pledge to provide fresh, wholesome meals prepared in clean conditions. Pickups are coordinated with utmost respect for shelf life.
              </span>
            </div>
          </div>

          {/* Scripture & Demo Notice */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-semibold text-[#3B2A1A]">Faith & Reflection</h4>
            <blockquote className="italic text-xs text-[#514536] bg-[#FFF8EE] p-3.5 rounded-2xl border-l-2 border-[#C98A2B] leading-relaxed">
              &ldquo;Inasmuch as ye have done it unto one of the least of these my brethren, ye have done it unto me.&rdquo;
              <footer className="text-[11px] font-bold text-[#845400] mt-1 not-italic">
                — Matthew 25:40
              </footer>
            </blockquote>

            {/* Required Demo-Mode Notice */}
            <div className="flex items-start gap-2 text-xs text-[#7A2E2E] bg-[#FFDAD8]/50 p-2.5 rounded-xl border border-[#FFB3B0]">
              <Database className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>
                <strong>Demo Mode:</strong> All data is stored locally in your current browser. No external servers or SMS gateways are connected.
              </span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#E8D9C5] pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#6B5440] gap-4">
          <p>© {new Date().getFullYear()} Anjappam. Faith, fellowship, and food sharing with dignity.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#5E7B3A]"></span>
              Live Client-Side Prototype
            </span>
            <span>•</span>
            <span>Kerala, India</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

