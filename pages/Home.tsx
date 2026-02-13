
import React from 'react';
import { ArrowRight, Utensils, Calendar, Map } from 'lucide-react';
import { RESTAURANT_INFO } from '../constants.tsx';

interface HomeProps {
  navigate: (page: any) => void;
}

export const Home: React.FC<HomeProps> = ({ navigate }) => {
  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={RESTAURANT_INFO.images.ambiance}
            alt="Ambiance restaurant"
            className="w-full h-full object-cover brightness-50"
          />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h1 className="text-5xl md:text-7xl text-white font-serif font-bold mb-6 drop-shadow-lg">
            L'Alouette des champs
          </h1>
          <p className="text-xl text-white/90 mb-10 font-light leading-relaxed max-w-2xl mx-auto">
            La crêperie artisanale la plus charmante d'Annaba. Un voyage culinaire au cœur de la nature.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('menu')}
              className="bg-[#C4A484] text-white px-8 py-4 rounded-full font-bold hover:bg-[#B39373] transition-all flex items-center justify-center gap-2"
            >
              Consulter la Carte <ArrowRight size={20} />
            </button>
            <button 
              onClick={() => navigate('reservation')}
              className="bg-white text-[#4A3728] px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-all shadow-xl"
            >
              Réserver une Table
            </button>
          </div>
        </div>
      </section>

      {/* Presentation */}
      <section className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-4xl font-serif font-bold text-[#4A3728]">Un cadre idyllique sur les hauteurs</h2>
          <p className="text-gray-600 leading-relaxed text-lg">
            {RESTAURANT_INFO.description}
          </p>
          <p className="text-gray-600 leading-relaxed">
            Spécialistes de la galette bretonne revisitée à l'algérienne, nous privilégions les produits locaux et la fraîcheur. Que ce soit pour un déjeuner ensoleillé sur notre terrasse ou un dîner romantique, L'Alouette des champs est votre destination privilégiée.
          </p>
          <div className="grid grid-cols-2 gap-6 pt-6">
             <div className="flex items-center gap-3">
               <div className="p-3 bg-amber-50 rounded-xl text-amber-700">
                  <Utensils size={24} />
               </div>
               <span className="font-semibold">Cuisine Fraîche</span>
             </div>
             <div className="flex items-center gap-3">
               <div className="p-3 bg-green-50 rounded-xl text-green-700">
                  <Map size={24} />
               </div>
               <span className="font-semibold">Vue Panoramique</span>
             </div>
          </div>
        </div>
        <div className="relative group">
          <div className="absolute -inset-4 bg-[#C4A484]/20 rounded-2xl -z-10 transition-transform group-hover:scale-105"></div>
          <img 
            src={RESTAURANT_INFO.images.terrace}
            alt="Terrasse"
            className="rounded-2xl shadow-2xl w-full h-[400px] object-cover"
          />
        </div>
      </section>

      {/* Location/Hours CTA */}
      <section className="bg-[#4A3728] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-8">
           <h2 className="text-3xl font-serif italic">"Une parenthèse enchantée à Annaba"</h2>
           <div className="h-1 w-20 bg-[#C4A484] mx-auto"></div>
           <p className="max-w-xl mx-auto opacity-80">
            Retrouvez-nous route du Cap de Garde, là où le ciel rencontre la mer.
           </p>
        </div>
      </section>
    </div>
  );
};
