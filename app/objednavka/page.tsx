'use client';

import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, CreditCard } from 'lucide-react';

const formSchema = z.object({
  meno: z.string().min(2, 'Meno musí mať aspoň 2 znaky'),
  email: z.string().email('Neplatná emailová adresa'),
  telefon: z.string().optional(),
  adresa: z.string().min(5, 'Adresa musí mať aspoň 5 znakov'),
  mesto: z.string().min(2, 'Mesto musí mať aspoň 2 znaky'),
  psc: z.string().min(5, 'PSČ musí mať aspoň 5 znakov'),
});

type FormData = z.infer<typeof formSchema>;

interface ApiResponse {
  url?: string;
  error?: string;
}

export default function ObjednavkaPage() {
  const { items, getTotalPrice } = useCart();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  // Ak je košík prázdny, presmeruj na galériu
  if (items.length === 0) {
    router.push('/galeria');
    return null;
  }

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const customerInfo = {
        meno: data.meno,
        email: data.email,
        telefon: data.telefon,
        adresa: `${data.adresa}, ${data.mesto}, ${data.psc}`,
      };

      // Vytvor Stripe Checkout Session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          customerInfo,
        }),
      });

      const result = await response.json() as ApiResponse;

      if (result.error) {
        throw new Error(result.error);
      }

      if (!result.url) {
        throw new Error('Nepodarilo sa získať URL pre platbu');
      }

      // Presmeruj používateľa na Stripe Checkout
      window.location.href = result.url;
      
    } catch (err) {
      console.error('Error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Niečo sa pokazilo. Skúste to znova.';
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/kosik"
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-indigo-600 mb-8 transition"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Späť do košíka</span>
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Dokončenie objednávky
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulár */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Dodacie údaje
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Meno a Priezvisko */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meno a priezvisko *
                  </label>
                  <input
                    type="text"
                    {...register('meno')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-gray-700"
                    placeholder="Ján Novák"
                  />
                  {errors.meno && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.meno.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    {...register('email')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-gray-700"
                    placeholder="jan.novak@email.sk"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Telefón */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefón (voliteľné)
                  </label>
                  <input
                    type="tel"
                    {...register('telefon')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-gray-700"
                    placeholder="+421 900 123 456"
                  />
                </div>

                {/* Adresa */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ulica a číslo *
                  </label>
                  <input
                    type="text"
                    {...register('adresa')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-gray-700"
                    placeholder="Hlavná 123"
                  />
                  {errors.adresa && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.adresa.message}
                    </p>
                  )}
                </div>

                {/* Mesto a PSČ */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mesto *
                    </label>
                    <input
                      type="text"
                      {...register('mesto')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-gray-700"
                      placeholder="Bratislava"
                    />
                    {errors.mesto && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.mesto.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      PSČ *
                    </label>
                    <input
                      type="text"
                      {...register('psc')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-gray-700"
                      placeholder="81101"
                    />
                    {errors.psc && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.psc.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Error message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-indigo-600 text-white py-4 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <span>Presmerovanie na platbu...</span>
                  ) : (
                    <>
                      <CreditCard className="h-5 w-5" />
                      <span>Pokračovať na platbu</span>
                    </>
                  )}
                </button>

                <p className="text-sm text-gray-600 text-center">
                  Po kliknutí budete presmerovaní na bezpečnú platobnú bránu Stripe
                </p>
              </form>
            </div>
          </div>

          {/* Súhrn objednávky */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Vaša objednávka
              </h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.obraz.id} className="flex space-x-4">
                    <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                      <Image
                        src={item.obraz.url_obrazka}
                        alt={item.obraz.nazov}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {item.obraz.nazov}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {item.obraz.cena.toFixed(2)} €
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
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
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Celkom:</span>
                    <span className="text-indigo-600">
                      {getTotalPrice().toFixed(2)} €
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}