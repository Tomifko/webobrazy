import { supabase } from '@/lib/supabase';
import ImageCard from '@/components/ImageCard';
import { Obraz } from '@/types';

async function getObrazy(): Promise<Obraz[]> {
  const { data, error } = await supabase
    .from('obrazy')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Chyba pri načítaní obrazov:', error);
    return [];
  }

  return data || [];
}

export default async function GaleriaPage() {
  const obrazy = await getObrazy();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Galéria
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Prehliadajte si moju zbierku originálnych výtvarných diel. 
            Každý obraz je jedinečný a vytvorený s láskou k umeniu.
          </p>
        </div>

        {/* Galéria mriežka */}
        {obrazy.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {obrazy.map((obraz) => (
              <ImageCard key={obraz.id} obraz={obraz} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              Zatiaľ tu nie sú žiadne obrazy. Čoskoro pridáme nové diela!
            </p>
          </div>
        )}

        {/* Počet obrazov */}
        {obrazy.length > 0 && (
          <div className="text-center mt-12 text-gray-600">
            Zobrazených {obrazy.length} {obrazy.length === 1 ? 'obraz' : obrazy.length < 5 ? 'obrazy' : 'obrazov'}
          </div>
        )}
      </div>
    </div>
  );
}