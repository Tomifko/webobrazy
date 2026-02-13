'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { uploadImageToSupabase } from '@/lib/uploadImage';
import AdminGuard from '@/components/AdminGuard';
import Link from 'next/link';
import { ArrowLeft, Upload, Loader2 } from 'lucide-react';
import Image from 'next/image';

function PridatObrazContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nazov: '',
    popis: '',
    cena: '',
    rozmery: '',
    technika: '',
    rok: new Date().getFullYear().toString(),
    dostupny: true,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validácia
      if (!imageFile) {
        throw new Error('Vyberte obrázok');
      }

      if (!formData.nazov || !formData.cena) {
        throw new Error('Vyplňte všetky povinné polia');
      }

      // Upload obrázku
      const imageUrl = await uploadImageToSupabase(imageFile);
      if (!imageUrl) {
        throw new Error('Nepodarilo sa nahrať obrázok');
      }

      // Ulož do databázy
      const { error: dbError } = await supabase.from('obrazy').insert({
        nazov: formData.nazov,
        popis: formData.popis || null,
        cena: parseFloat(formData.cena),
        url_obrazka: imageUrl,
        rozmery: formData.rozmery || null,
        technika: formData.technika || null,
        rok: formData.rok ? parseInt(formData.rok) : null,
        dostupny: formData.dostupny,
      });

      if (dbError) {
        throw dbError;
      }

      router.push('/admin');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Neznáma chyba';
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/admin"
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-indigo-600 mb-8 transition"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Späť na admin</span>
        </Link>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Pridať nový obraz
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Upload obrázku */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Obrázok *
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-500 transition">
                <div className="space-y-1 text-center">
                  {imagePreview ? (
                    <div className="relative w-full h-64 mb-4">
                      <Image
                        src={imagePreview}
                        alt="Náhľad"
                        fill
                        className="object-contain rounded-lg"
                      />
                    </div>
                  ) : (
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  )}
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                      <span>Nahrať súbor</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="sr-only"
                        required
                      />
                    </label>
                    <p className="pl-1">alebo pretiahnite sem</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF do 10MB
                  </p>
                </div>
              </div>
            </div>

            {/* Názov */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Názov obrazu *
              </label>
              <input
                type="text"
                value={formData.nazov}
                onChange={(e) =>
                  setFormData({ ...formData, nazov: e.target.value })
                }
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-gray-700"
              />
            </div>

            {/* Popis */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Popis
              </label>
              <textarea
                value={formData.popis}
                onChange={(e) =>
                  setFormData({ ...formData, popis: e.target.value })
                }
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-gray-700"
              />
            </div>

            {/* Cena */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cena (€) *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.cena}
                onChange={(e) =>
                  setFormData({ ...formData, cena: e.target.value })
                }
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-gray-700"
              />
            </div>

            {/* Rozmery a Technika */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rozmery
                </label>
                <input
                  type="text"
                  value={formData.rozmery}
                  onChange={(e) =>
                    setFormData({ ...formData, rozmery: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Technika
                </label>
                <input
                  type="text"
                  value={formData.technika}
                  onChange={(e) =>
                    setFormData({ ...formData, technika: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-gray-700"
                />
              </div>
            </div>

            {/* Rok */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rok vytvorenia
              </label>
              <input
                type="number"
                value={formData.rok}
                onChange={(e) =>
                  setFormData({ ...formData, rok: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-gray-700"
              />
            </div>

            {/* Dostupnosť */}
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.dostupny}
                onChange={(e) =>
                  setFormData({ ...formData, dostupny: e.target.checked })
                }
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Obraz je dostupný na predaj
              </label>
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Buttons */}
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Ukladám...</span>
                  </>
                ) : (
                  <span>Pridať obraz</span>
                )}
              </button>
              <Link
                href="/admin"
                className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition text-center"
              >
                Zrušiť
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function PridatObrazPage() {
  return (
    <AdminGuard>
      <PridatObrazContent />
    </AdminGuard>
  );
}