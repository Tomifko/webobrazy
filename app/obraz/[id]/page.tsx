import { supabase } from '@/lib/supabase';
import { Obraz } from '@/types';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, Check, Truck, Shield } from 'lucide-react';
import Link from 'next/link';
import AddToCartButton from '@/components/AddToCartButton';

async function getObraz(id: string): Promise<Obraz | null> {
  const { data, error } = await supabase
    .from('obrazy')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Chyba pri načítaní obrazu:', error);
    return null;
  }

  return data;
}

export default async function ObrazDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;  // ← Promise!
}) {
  const { id } = await params;  // ← Await params!
  const obraz = await getObraz(id);

  if (!obraz) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Späť na galériu */}
        <Link
          href="/galeria"
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-indigo-600 mb-8 transition"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Späť do galérie</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Obrázok */}
          <div className="relative aspect-square bg-white rounded-lg overflow-hidden shadow-lg">
            <Image
              src={obraz.url_obrazka}
              alt={obraz.nazov}
              fill
              className="object-contain"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {/* Info a nákup */}
          <div className="flex flex-col">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {obraz.nazov}
              </h1>

              {/* Cena */}
              <div className="mb-6">
                <span className="text-4xl font-bold text-indigo-600">
                  {obraz.cena.toFixed(2)} €
                </span>
              </div>

              {/* Dostupnosť */}
              <div className="mb-6">
                {obraz.dostupny ? (
                  <div className="inline-flex items-center space-x-2 bg-green-50 text-green-700 px-4 py-2 rounded-full">
                    <Check className="h-5 w-5" />
                    <span className="font-semibold">Dostupné</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center space-x-2 bg-red-50 text-red-700 px-4 py-2 rounded-full">
                    <span className="font-semibold">Predané</span>
                  </div>
                )}
              </div>

              {/* Technické detaily */}
              <div className="border-t border-b border-gray-200 py-6 mb-6 space-y-3">
                {obraz.rozmery && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rozmery:</span>
                    <span className="font-semibold text-gray-900">
                      {obraz.rozmery}
                    </span>
                  </div>
                )}
                {obraz.technika && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Technika:</span>
                    <span className="font-semibold text-gray-900">
                      {obraz.technika}
                    </span>
                  </div>
                )}
                {obraz.rok && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rok:</span>
                    <span className="font-semibold text-gray-900">
                      {obraz.rok}
                    </span>
                  </div>
                )}
              </div>

              {/* Popis */}
              {obraz.popis && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    O diele
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {obraz.popis}
                  </p>
                </div>
              )}

              {/* Tlačidlo pridať do košíka */}
              {obraz.dostupny && <AddToCartButton obraz={obraz} />}

              {/* Výhody */}
              <div className="mt-8 space-y-4">
                <div className="flex items-start space-x-3">
                  <Shield className="h-6 w-6 text-indigo-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Certifikát pravosti
                    </h4>
                    <p className="text-sm text-gray-600">
                      Každé dielo obsahuje certifikát autenticity
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Truck className="h-6 w-6 text-indigo-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Bezpečná doprava
                    </h4>
                    <p className="text-sm text-gray-600">
                      Profesionálne zabalené a poistené
                    </p>
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