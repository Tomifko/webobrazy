'use client';

import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export default function KosikPage() {
  const { items, removeFromCart, getTotalPrice, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Váš košík je prázdny
          </h1>
          <p className="text-gray-600 mb-8">
            Pozrite si našu galériu a vyberte si krásne obrazy pre váš domov.
          </p>
          <Link
            href="/galeria"
            className="inline-flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-indigo-700 transition"
          >
            <span>Prejsť do galérie</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Nákupný košík</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Zoznam produktov */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.obraz.id}
                className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-6"
              >
                {/* Obrázok */}
                <div className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                  <Image
                    src={item.obraz.url_obrazka}
                    alt={item.obraz.nazov}
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                </div>

                {/* Info */}
                <div className="flex-grow">
                  <Link
                    href={`/obraz/${item.obraz.id}`}
                    className="text-xl font-semibold text-gray-900 hover:text-indigo-600 transition"
                  >
                    {item.obraz.nazov}
                  </Link>
                  <div className="mt-2 space-y-1 text-sm text-gray-600">
                    {item.obraz.rozmery && <p>Rozmery: {item.obraz.rozmery}</p>}
                    {item.obraz.technika && <p>Technika: {item.obraz.technika}</p>}
                  </div>
                  <p className="mt-3 text-2xl font-bold text-indigo-600">
                    {item.obraz.cena.toFixed(2)} €
                  </p>
                </div>

                {/* Tlačidlo odstrániť */}
                <button
                  onClick={() => removeFromCart(item.obraz.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-full transition"
                  title="Odstrániť z košíka"
                >
                  <Trash2 className="h-6 w-6" />
                </button>
              </div>
            ))}

            {/* Vymazať všetko */}
            <button
              onClick={clearCart}
              className="text-red-600 hover:text-red-700 font-medium text-sm flex items-center space-x-2"
            >
              <Trash2 className="h-4 w-4" />
              <span>Vyprázdniť košík</span>
            </button>
          </div>

          {/* Súhrn objednávky */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Súhrn objednávky
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Počet položiek:</span>
                  <span className="font-semibold">{items.length}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Medzisúčet:</span>
                  <span className="font-semibold">
                    {getTotalPrice().toFixed(2)} €
                  </span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Doprava:</span>
                  <span className="font-semibold">Zdarma</span>
                </div>
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Celkom:</span>
                    <span className="text-indigo-600">
                      {getTotalPrice().toFixed(2)} €
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href="/objednavka"
                className="block w-full bg-indigo-600 text-white text-center py-4 rounded-lg font-semibold hover:bg-indigo-700 transition shadow-lg hover:shadow-xl"
              >
                Pokračovať k objednávke
              </Link>

              <Link
                href="/galeria"
                className="block w-full text-center text-indigo-600 hover:text-indigo-700 font-medium mt-4"
              >
                Pokračovať v nákupe
              </Link>

              {/* Info */}
              <div className="mt-6 pt-6 border-t border-gray-200 text-sm text-gray-600 space-y-2">
                <p className="flex items-start">
                  <span className="mr-2">✓</span>
                  Bezpečná platba cez Stripe
                </p>
                <p className="flex items-start">
                  <span className="mr-2">✓</span>
                  Doprava zdarma
                </p>
                <p className="flex items-start">
                  <span className="mr-2">✓</span>
                  Certifikát pravosti zadarmo
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}