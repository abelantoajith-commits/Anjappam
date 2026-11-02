import React from 'react';
import { Link } from 'react-router-dom';
import { Wheat, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="text-center max-w-md bg-white p-8 sm:p-10 rounded-3xl border border-[#E8D9C5] shadow-lg">
        <div className="w-16 h-16 rounded-full bg-[#FFEADA] text-[#C98A2B] flex items-center justify-center mx-auto mb-4">
          <Wheat className="w-8 h-8 text-[#845400]" />
        </div>
        <h1 className="font-serif text-4xl font-bold text-[#3B2A1A] mb-2">404</h1>
        <h2 className="font-serif text-xl font-bold text-[#3B2A1A] mb-3">Sanctuary Page Not Found</h2>
        <p className="text-sm text-[#514536] mb-6">
          The path you seek has been moved or does not exist. Please return to the table of fellowship.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#C98A2B] text-white hover:bg-[#845400] font-bold text-sm shadow-sm transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
}

