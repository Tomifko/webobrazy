import Link from 'next/link';
import { Mail, Instagram, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* O Galérii */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              Galéria Umenia
            </h3>
            <p className="text-sm leading-relaxed">
              Originálne výtvarné diela vytvorené s vášňou a láskou k umeniu. 
              Každý obraz je jedinečný a má svoju vlastnú dušu.
            </p>
          </div>

          {/* Rýchle odkazy */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              Rýchle odkazy
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/galeria" className="hover:text-white transition">
                  Galéria
                </Link>
              </li>
              <li>
                <Link href="/o-mne" className="hover:text-white transition">
                  O mne
                </Link>
              </li>
              <li>
                <Link href="/kontakt" className="hover:text-white transition">
                  Kontakt
                </Link>
              </li>
              <li>
                <Link href="/obchodne-podmienky" className="hover:text-white transition">
                  Obchodné podmienky
                </Link>
              </li>
            </ul>
          </div>

          {/* Kontakt a sociálne siete */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              Kontakt
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <a href="mailto:info@galeria.sk" className="hover:text-white transition">
                  info@galeria.sk
                </a>
              </li>
              <li className="flex items-center space-x-4 mt-4">
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} Galéria Umenia. Všetky práva vyhradené.</p>
        </div>
      </div>
    </footer>
  );
}