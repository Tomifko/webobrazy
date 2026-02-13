'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { uploadImageToSupabase, deleteImageFromSupabase } from '@/lib/uploadImage';
import { Obraz } from '@/types';
import AdminGuard from '@/components/AdminGuard';
import Link from 'next/link';
import { ArrowLeft, Upload, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { use } from 'react';

function UpravitObrazContent({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingObraz, setLoadingObraz] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [obraz, setObraz] = useState<Obraz | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nazov: '',
    popis: '',
    cena: '',
    rozmery: '',
    technika: '',
    rok: '',
    dostupny: true,
  });

  useEffect(() => {
    const loadObraz = async () => {
      const { data, error } = await supabase
        .from('obrazy')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        setError('Obraz sa nenašiel');
        setLoadingObraz(false);
        return;
      }

      setObraz(data);
      setFormData({
        nazov: data.nazov,
        popis: data.popis || '',
        cena: data.cena.toString(),
        rozmery: data.rozmery || '',
        technika: data.technika || '',
        rok: data.rok?.toString() || '',
        dostupny: data.dostupny,
      });
      setImagePreview(data.url_obrazka);
      setLoadingObraz(false);
    };

    loadObraz();
  }, [id]);

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
      if (!obraz) {
        throw new Error('Obraz sa nenašiel');
      }

      let imageUrl = obraz.url_obrazka;

      // Ak je nový obrázok, nahraj ho
      if (imageFile) {
        const newImageUrl = await uploadImageToSupabase(imageFile);
        if (!newImageUrl) {
          throw new Error('Nepodarilo sa nahrať nový obrázok');
        }
        imageUrl = newImageUrl;

        // Vymaž starý obrázok (ak nie je z unsplash)
        if (!obraz.url_obrazka.includes('unsplash.com')) {
          await deleteImageFromSupabase(obraz.url_obrazka);
        }
      }

      // Aktualizuj v databáze
      const { error: dbError } = await supabase
        .from('obrazy')
        .update({
          nazov: formData.nazov,
          popis: formData.popis || null,
          cena: parseFloat(formData.cena),
          url_obrazka: imageUrl,
          rozmery: formData.rozmery || null,
          technika: formData.technika || null,
          rok: formData.rok ? parseInt(formData.rok) : null,
          dostupny: formData.dostupny,
        })
        .eq('id', id);

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

  if (loadingObraz) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Načítavam obraz...</p>
        </div>
      </div>
    );
  }

  if (!obraz) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Obraz sa nenašiel
          </h1>
          <Link
            href="/admin"
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Späť na admin
          </Link>
        </div>
      </div>
    );
  }

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
            Upraviť obraz
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Upload obrázku */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Obrázok
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-500 transition">
                <div className="space-y-1 text-center">
                  {imagePreview && (
                    <div className="relative w-full h-64 mb-4">
                      <Image
                        src={imagePreview}
                        alt="Náhľad"
                        fill
                        className="object-contain rounded-lg"
                      />
                    </div>
                  )}
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                      <span>Zmeniť obrázok</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="sr-only"
                      />
                    </label>
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
                  <span>Uložiť zmeny</span>
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

export default function UpravitObrazPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <AdminGuard>
      <UpravitObrazContent id={id} />
    </AdminGuard>
  );
}