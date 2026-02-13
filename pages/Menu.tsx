
import React, { useState } from 'react';
import { MenuItem } from '../types';
import { Search, Image as ImageIcon } from 'lucide-react';

interface MenuProps {
  menu: MenuItem[];
  onOrder: (item: MenuItem) => void;
}

export const Menu: React.FC<MenuProps> = ({ menu, onOrder }) => {
  const [activeCategory, setActiveCategory] = useState<MenuItem['category'] | 'tous'>('tous');
  const [search, setSearch] = useState('');

  const categories: {id: MenuItem['category'] | 'tous', label: string}[] = [
    { id: 'tous', label: 'Tous' },
    { id: 'salée', label: 'Salées' },
    { id: 'sucrée', label: 'Sucrées' },
    { id: 'boisson', label: 'Boissons' },
  ];

  const filteredMenu = menu.filter(item => {
    const matchesCategory = activeCategory === 'tous' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-serif font-bold text-[#4A3728] mb-4 text-amber-900">Notre Carte</h1>
        <p className="text-gray-500 italic font-serif">Découvrez nos crêpes artisanales et nos boissons fraîches</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between">
        <div className="flex gap-2 p-1 bg-gray-100 rounded-full overflow-x-auto max-w-full">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                activeCategory === cat.id 
                ? 'bg-white text-[#4A3728] shadow-sm' 
                : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#C4A484]"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredMenu.map((item) => (
          <div key={item.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col group hover:shadow-xl transition-all overflow-hidden">
            <div className="h-48 bg-gray-100 relative overflow-hidden">
              {item.image ? (
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                  <ImageIcon size={40} className="mb-2 opacity-20" />
                  <span className="text-[10px] uppercase font-bold tracking-widest">Image bientôt disponible</span>
                </div>
              )}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#4A3728] shadow-sm">
                {item.price} DA
              </div>
            </div>
            
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-[#C4A484] transition-colors">{item.name}</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-6 line-clamp-2 flex-grow">{item.description}</p>
              
              <button 
                onClick={() => onOrder(item)}
                className="w-full bg-[#4A3728] text-white py-3 rounded-2xl font-bold text-sm hover:bg-[#5D4636] transition-all transform active:scale-95 shadow-md"
              >
                Commander
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredMenu.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          Aucun produit trouvé dans cette catégorie.
        </div>
      )}
    </div>
  );
};
