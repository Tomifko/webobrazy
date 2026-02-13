'use client';

import { supabase } from '@/lib/supabase';
import { Obraz } from '@/types';
import { useAuth } from '@/context/AuthContext';
import AdminGuard from '@/components/AdminGuard';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Edit, Trash2, LogOut, Image as ImageIcon } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

function AdminPageContent() {
  const [obrazy, setObrazy] = useState<Obraz[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, signOut } = useAuth();

  useEffect(() => {
    const loadObrazy = async () => {
      const { data, error } = await supabase
        .from('obrazy')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Chyba pri načítaní obrazov:', error);
      } else {
        setObrazy(data || []);
      }
      setLoading(false);
    };

    loadObrazy();
  }, []); // Prázdne pole - zavolá sa len raz pri mount

  const handleDelete = async (id: string) => {
    if (!confirm('Naozaj chcete vymazať tento obraz?')) {
      return;
    }

    const { error } = await supabase
      .from('obrazy')
      .delete()
      .eq('id', id);

    if (error) {
      alert('Chyba pri mazaní: ' + error.message);
    } else {
      // Znova načítaj obrazy po vymazaní
      setLoading(true);
      const { data } = await supabase
        .from('obrazy')
        .select('*')
        .order('created_at', { ascending: false });
      setObrazy(data || []);
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Admin panel
              </h1>
              <p className="text-gray-600">
                Prihlásený ako: <span className="font-semibold">{user?.email}</span>
              </p>
            </div>
            <div className="flex space-x-4">
              <Link
                href="/admin/pridat"
                className="inline-flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                <Plus className="h-5 w-5" />
                <span>Pridať obraz</span>
              </Link>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center space-x-2 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                <LogOut className="h-5 w-5" />
                <span>Odhlásiť sa</span>
              </button>
            </div>
          </div>
        </div>

        {/* Zoznam obrazov */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : obrazy.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <ImageIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Žiadne obrazy
            </h2>
            <p className="text-gray-600 mb-6">
              Začnite pridávaním prvého obrazu do galérie
            </p>
            <Link
              href="/admin/pridat"
              className="inline-flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              <Plus className="h-5 w-5" />
              <span>Pridať prvý obraz</span>
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Obraz
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Názov
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cena
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dostupnosť
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Akcie
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {obrazy.map((obraz) => (
                  <tr key={obraz.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                        <Image
                          src={obraz.url_obrazka}
                          alt={obraz.nazov}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {obraz.nazov}
                      </div>
                      <div className="text-sm text-gray-500">
                        {obraz.rozmery}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {obraz.cena.toFixed(2)} €
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {obraz.dostupny ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Dostupné
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Predané
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                      <Link
                        href={`/admin/upravit/${obraz.id}`}
                        className="text-indigo-600 hover:text-indigo-900 inline-flex items-center"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Upraviť
                      </Link>
                      <button
                        onClick={() => handleDelete(obraz.id)}
                        className="text-red-600 hover:text-red-900 inline-flex items-center"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Vymazať
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <AdminGuard>
      <AdminPageContent />
    </AdminGuard>
  );
}