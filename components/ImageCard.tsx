import Image from 'next/image';
import Link from 'next/link';
import { Obraz } from '@/types';

interface ImageCardProps {
  obraz: Obraz;
}

export default function ImageCard({ obraz }: ImageCardProps) {
  return (
    <Link href={`/obraz/${obraz.id}`}>
      <div className="group cursor-pointer bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
        {/* Obrázok */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={obraz.url_obrazka}
            alt={obraz.nazov}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {!obraz.dostupny && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="bg-white text-gray-900 px-4 py-2 rounded-full font-semibold text-sm">
                Predané
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-semibold text-lg text-gray-900 mb-1 group-hover:text-indigo-600 transition">
            {obraz.nazov}
          </h3>
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {obraz.rozmery && <span>{obraz.rozmery}</span>}
              {obraz.technika && obraz.rozmery && <span className="mx-1">•</span>}
              {obraz.technika && <span>{obraz.technika}</span>}
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <span className="text-2xl font-bold text-indigo-600">
              {obraz.cena.toFixed(2)} €
            </span>
            {obraz.dostupny && (
              <span className="text-xs text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full">
                Dostupné
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}