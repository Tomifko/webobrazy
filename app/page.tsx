import Link from 'next/link';
import { ArrowRight, Palette, Shield, Truck } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero sekcia */}
      <section className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Originálne výtvarné diela
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Objavte jedinečné obrazy vytvorené s vášňou a láskou k umeniu. 
              Každé dielo rozpráva svoj vlastný príbeh.
            </p>
            <Link
              href="/galeria"
              className="inline-flex items-center space-x-2 bg-indigo-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-indigo-700 transition shadow-lg hover:shadow-xl"
            >
              <span>Prejsť do galérie</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Výhody */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
                <Palette className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Originálne diela</h3>
              <p className="text-gray-600">
                Každý obraz je jedinečný, ručne maľovaný originál
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
                <Shield className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Certifikát pravosti</h3>
              <p className="text-gray-600">
                Ku každému obrazu priložíme certifikát autenticity
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
                <Truck className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Bezpečná doprava</h3>
              <p className="text-gray-600">
                Každý obraz starostlivo zabalíme pre bezpečnú prepravu
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}