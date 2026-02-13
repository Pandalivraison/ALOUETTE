
import React from 'react';
import { MapPin, Phone, Clock, Instagram, Facebook } from 'lucide-react';
import { RESTAURANT_INFO } from '../constants.tsx';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#4A3728] text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h3 className="text-2xl font-serif font-bold mb-4">L'Alouette des champs</h3>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              {RESTAURANT_INFO.description}
            </p>
            <div className="flex justify-center md:justify-start space-x-4">
              <Instagram className="w-5 h-5 cursor-pointer hover:text-[#C4A484] transition-colors" />
              <Facebook className="w-5 h-5 cursor-pointer hover:text-[#C4A484] transition-colors" />
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-bold text-lg mb-4">Coordonnées</h4>
            <div className="flex items-start justify-center md:justify-start space-x-3 text-sm text-gray-300">
              <MapPin className="w-5 h-5 text-[#C4A484] flex-shrink-0" />
              <span>{RESTAURANT_INFO.address}</span>
            </div>
            <div className="flex items-center justify-center md:justify-start space-x-3 text-sm text-gray-300">
              <Phone className="w-5 h-5 text-[#C4A484]" />
              <span>{RESTAURANT_INFO.phone}</span>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Horaires</h4>
            <div className="flex items-center justify-center md:justify-start space-x-3 text-sm text-gray-300">
              <Clock className="w-5 h-5 text-[#C4A484]" />
              <span>Ouvert tous les jours<br/>{RESTAURANT_INFO.hours}</span>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/10 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} L'Alouette des champs. Tous droits réservés. Design by Annaba Dev.
        </div>
      </div>
    </footer>
  );
};
