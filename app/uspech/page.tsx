'use client';

import { useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { CheckCircle, Home, Mail } from 'lucide-react';

export default function UspechPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    // Vyprázdni košík po úspešnej platbe
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Ďakujeme za vašu objednávku!
        </h1>
        
        <p className="text-gray-600 mb-8">
          Vaša platba bola úspešne spracovaná. Potvrdenie objednávky vám 
          príde na email spolu s informáciami o dodaní.
        </p>

        <div className="bg-indigo-50 rounded-lg p-6 mb-8">
          <Mail className="h-8 w-8 text-indigo-600 mx-auto mb-3" />
          <p className="text-sm text-gray-700">
            Skontrolujte si emailovú schránku pre potvrdenie objednávky 
            a ďalšie informácie o dodaní.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-indigo-700 transition"
        >
          <Home className="h-5 w-5" />
          <span>Späť na domovskú stránku</span>
        </Link>
      </div>
    </div>
  );
}