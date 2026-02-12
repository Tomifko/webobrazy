'use client';

import Link from 'next/link';
import { ShoppingCart, Palette } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const { getItemCount } = useCart();
  const cartCount = getItemCount();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <Palette className="h-8 w-8 text-indigo-600 group-hover:text-indigo-700 transition" />
            <span className="text-xl font-bold text-gray-900">
              Tomáš Gonda Art
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-indigo-600 transition font-medium"
            >
              Domov
            </Link>
            <Link 
              href="/galeria" 
              className="text-gray-700 hover:text-indigo-600 transition font-medium"
            >
              Galéria
            </Link>
            <Link 
              href="/o-mne" 
              className="text-gray-700 hover:text-indigo-600 transition font-medium"
            >
              O mne
            </Link>
            <Link 
              href="/kontakt" 
              className="text-gray-700 hover:text-indigo-600 transition font-medium"
            >
              Kontakt
            </Link>
          </div>

          {/* Cart Icon */}
          <Link 
            href="/kosik" 
            className="relative p-2 hover:bg-gray-100 rounded-full transition"
          >
            <ShoppingCart className="h-6 w-6 text-gray-700" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}