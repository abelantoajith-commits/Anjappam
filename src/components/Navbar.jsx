import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  LogOut, 
  Menu, 
  X, 
  HandPlatter, 
  UtensilsCrossed, 
  ClipboardList
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Per PRD Override: Navbar appears on all pages except Login and Sign Up
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  if (isAuthPage) return null;

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#FFF8EE]/95 backdrop-blur-md border-b border-[#E8D9C5]/80 shadow-[0_2px_12px_rgba(59,42,26,0.04)] transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-20 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center">
        
        {/* Left Column: Requests button + Desktop Quick links (aligned left) */}
        <div className="col-start-1 justify-self-start flex items-center gap-1.5 sm:gap-3 min-w-0">
          <Link
            to="/requests"
            className={`inline-flex items-center gap-1.5 p-2 sm:px-4 sm:py-2 rounded-full font-sans font-medium text-xs sm:text-sm transition-all duration-200 shrink-0 ${
              location.pathname === '/requests'
                ? 'bg-[#C98A2B] text-white shadow-sm'
                : 'bg-[#FFEADA] text-[#3B2A1A] hover:bg-[#FFE3CD] active:scale-95'
            }`}
            aria-label="View food requests"
            title="Requests"
          >
            <ClipboardList className="w-4 h-4 text-[#845400] shrink-0" />
            <span className="font-semibold hidden sm:inline">Requests</span>
          </Link>

          {/* Quick links on medium+ screens */}
          <nav className="hidden md:flex items-center gap-1 pl-1">
            <Link
              to="/donate"
              className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap ${
                location.pathname === '/donate'
                  ? 'text-[#845400] bg-[#FFE3CD]'
                  : 'text-[#6B5440] hover:text-[#3B2A1A] hover:bg-[#FFEADA]/60'
              }`}
            >
              I Have Food
            </Link>
            <Link
              to="/receive"
              className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap ${
                location.pathname === '/receive'
                  ? 'text-[#845400] bg-[#FFE3CD]'
                  : 'text-[#6B5440] hover:text-[#3B2A1A] hover:bg-[#FFEADA]/60'
              }`}
            >
              I Need Food
            </Link>
          </nav>
        </div>

        {/* Center Column: Exactly Centered Anjappam Logo and Wordmark */}
        <div className="col-start-2 justify-self-center px-1">
          <Link 
            to="/" 
            className="flex flex-col items-center group cursor-pointer focus:outline-none whitespace-nowrap"
            aria-label="Anjappam Home"
          >
            <div className="flex items-center gap-1.5 sm:gap-2">
              <img 
                src="/logo.svg" 
                alt="Anjappam Five Loaves Emblem" 
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full shadow-sm group-hover:scale-105 transition-transform shrink-0" 
              />
              <span className="font-serif text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-[#3B2A1A] group-hover:text-[#845400] transition-colors whitespace-nowrap select-none">
                ANJAPPAM
              </span>
            </div>
            <span className="text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-[#C98A2B] font-semibold hidden sm:block -mt-0.5 whitespace-nowrap">
              Five Loaves · Bread for All
            </span>
          </Link>
        </div>

        {/* Right Column: Login button or User Account + Mobile menu toggle (aligned right) */}
        <div className="col-start-3 justify-self-end flex items-center justify-end gap-1.5 sm:gap-2 min-w-0">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="inline-flex items-center gap-1.5 sm:gap-2 p-1.5 sm:pl-3 sm:pr-4 sm:py-1.5 rounded-full bg-[#FFEADA] text-[#3B2A1A] hover:bg-[#FFE3CD] transition-all text-sm font-medium border border-[#E8D9C5] focus:outline-none focus:ring-2 focus:ring-[#C98A2B]"
                aria-expanded={userDropdownOpen}
                aria-haspopup="true"
                title={user.institutionName || user.username}
              >
                <div className="w-7 h-7 rounded-full bg-[#C98A2B] text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm shrink-0">
                  {user.institutionName ? user.institutionName[0] : user.username[0]}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-bold leading-tight truncate max-w-[100px] md:max-w-[140px]">
                    {user.institutionName || user.username}
                  </span>
                  <span className="text-[10px] text-[#5E7B3A] font-semibold uppercase leading-tight tracking-wider">
                    {user.userType === 'donor' ? 'Food Donor' : 'Food Receiver'}
                  </span>
                </div>
              </button>

              {/* Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-xl border border-[#E8D9C5] py-2 z-50 animate-fadeIn">
                  <div className="px-4 py-2 border-b border-[#F5E8D3]">
                    <p className="text-xs font-semibold text-[#837564] uppercase tracking-wider">Signed in as</p>
                    <p className="text-sm font-bold text-[#3B2A1A] truncate">{user.contactName || user.username}</p>
                    <p className="text-xs text-[#6B5440] truncate">{user.phone}</p>
                  </div>

                  {user.userType === 'donor' && (
                    <Link
                      to="/donate"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#3B2A1A] hover:bg-[#FFF8EE] transition-colors"
                    >
                      <HandPlatter className="w-4 h-4 text-[#C98A2B]" />
                      <span>Your Donations Portal</span>
                    </Link>
                  )}

                  {user.userType === 'receiver' && (
                    <Link
                      to="/receive"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#3B2A1A] hover:bg-[#FFF8EE] transition-colors"
                    >
                      <UtensilsCrossed className="w-4 h-4 text-[#5E7B3A]" />
                      <span>Available Food Sanctuary</span>
                    </Link>
                  )}

                  <Link
                    to="/requests"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#3B2A1A] hover:bg-[#FFF8EE] transition-colors"
                  >
                    <ClipboardList className="w-4 h-4 text-[#845400]" />
                    <span>Food Requests</span>
                  </Link>

                  <div className="border-t border-[#F5E8D3] my-1" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#7A2E2E] hover:bg-[#FFDAD8]/40 transition-colors font-medium text-left"
                  >
                    <LogOut className="w-4 h-4 text-[#7A2E2E]" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 p-2 sm:px-5 sm:py-2 rounded-full bg-[#845400] text-white hover:bg-[#643F00] font-sans font-medium text-xs sm:text-sm shadow-sm transition-all transform hover:-translate-y-0.5 active:translate-y-0 shrink-0"
              aria-label="Log in to Anjappam"
              title="Login"
            >
              <User className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Login</span>
            </Link>
          )}

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full text-[#3B2A1A] hover:bg-[#FFEADA] focus:outline-none shrink-0"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FFF8EE] border-b border-[#E8D9C5] px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <div className="grid grid-cols-2 gap-2 pb-2">
            <Link
              to="/donate"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-[#C98A2B] text-white text-sm font-semibold shadow-sm"
            >
              <HandPlatter className="w-4 h-4" />
              I Have Food
            </Link>
            <Link
              to="/receive"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-[#FFEADA] text-[#3B2A1A] border border-[#E8D9C5] text-sm font-semibold shadow-sm"
            >
              <UtensilsCrossed className="w-4 h-4 text-[#5E7B3A]" />
              I Need Food
            </Link>
          </div>

          <Link
            to="/requests"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between p-3 rounded-2xl bg-[#FFE3CD] text-[#3B2A1A] text-sm font-bold shadow-sm"
          >
            <div className="flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-[#845400]" />
              <span>Community Food Requests</span>
            </div>
            <span className="text-xs bg-[#C98A2B] text-white px-2 py-0.5 rounded-full font-normal">Active</span>
          </Link>

          {user ? (
            <div className="pt-2 border-t border-[#E8D9C5] flex items-center justify-between">
              <div className="text-xs text-[#514536]">
                Logged in as <strong className="text-[#3B2A1A]">{user.institutionName || user.username}</strong> ({user.userType === 'donor' ? 'Donor' : 'Receiver'})
              </div>
              <button
                onClick={handleLogout}
                className="text-xs font-bold text-[#7A2E2E] px-3 py-1.5 rounded-full bg-[#FFDAD8] hover:bg-[#FE9693]"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-[#E8D9C5] flex gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 py-2.5 rounded-full bg-[#845400] text-white text-center text-sm font-semibold shadow-sm"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 py-2.5 rounded-full bg-[#C98A2B] text-white text-center text-sm font-semibold shadow-sm"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
