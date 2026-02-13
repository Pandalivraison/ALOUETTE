
import React, { useState } from 'react';
import { Menu, X, User as UserIcon, LayoutDashboard, LogOut, ShoppingCart } from 'lucide-react';
import { RESTAURANT_INFO } from '../constants.tsx';
import { User } from '../types';

interface NavbarProps {
  navigate: (page: 'home' | 'menu' | 'reservation' | 'admin') => void;
  currentPage: string;
  user: User | null;
  onAuthClick: () => void;
  onLogout: () => void;
  cartItemCount: number;
  onCartClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  navigate, 
  currentPage, 
  user, 
  onAuthClick, 
  onLogout,
  cartItemCount,
  onCartClick
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Accueil' },
    { id: 'menu', label: 'Carte' },
    { id: 'reservation', label: 'Réservation' },
  ];

  return (
    <nav className="fixed w-full bg-white/90 backdrop-blur-md shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center cursor-pointer gap-3" onClick={() => navigate('home')}>
             <img 
               src={RESTAURANT_INFO.images.logo} 
               alt="Logo L'Alouette" 
               className="w-12 h-12 rounded-full object-cover border border-amber-100 shadow-sm"
             />
             <span className="text-xl font-serif font-bold text-[#4A3728]">L'Alouette</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-8 items-center">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.id as any)}
                className={`text-sm font-medium transition-colors ${
                  currentPage === item.id ? 'text-[#C4A484] border-b-2 border-[#C4A484]' : 'text-gray-600 hover:text-[#C4A484]'
                }`}
              >
                {item.label}
              </button>
            ))}

            {/* Cart Button */}
            <button 
              onClick={onCartClick}
              className="relative p-2 text-gray-600 hover:text-[#C4A484] transition-colors"
            >
              <ShoppingCart size={22} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm animate-bounce">
                  {cartItemCount}
                </span>
              )}
            </button>
            
            {user ? (
              <div className="flex items-center space-x-4">
                {user.isAdmin && (
                  <button 
                    onClick={() => navigate('admin')}
                    className="flex items-center text-sm font-medium text-gray-600 hover:text-[#C4A484]"
                  >
                    <LayoutDashboard className="w-4 h-4 mr-1" />
                    Admin
                  </button>
                )}
                <div className="flex items-center text-sm font-medium text-gray-800 bg-gray-100 px-3 py-1 rounded-full">
                  <UserIcon className="w-4 h-4 mr-2" />
                  {user.name}
                </div>
                <button onClick={onLogout} className="text-gray-400 hover:text-red-500">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onAuthClick}
                className="bg-[#4A3728] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-[#5D4636] transition-all shadow-md"
              >
                Connexion
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button 
              onClick={onCartClick}
              className="relative p-2 text-gray-600"
            >
              <ShoppingCart size={22} />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 bg-amber-600 text-white text-[8px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {cartItemCount}
                </span>
              )}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 p-2">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 p-4 space-y-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                navigate(item.id as any);
                setIsOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-gray-600 font-medium hover:bg-gray-50 rounded-lg"
            >
              {item.label}
            </button>
          ))}
          {user ? (
            <div className="pt-4 border-t border-gray-100">
              <div className="px-4 py-2 font-bold">{user.name}</div>
              {user.isAdmin && (
                 <button onClick={() => { navigate('admin'); setIsOpen(false); }} className="block w-full text-left px-4 py-2 text-gray-600">Tableau de Bord</button>
              )}
              <button onClick={() => { onLogout(); setIsOpen(false); }} className="block w-full text-left px-4 py-2 text-red-500">Déconnexion</button>
            </div>
          ) : (
            <button
              onClick={() => { onAuthClick(); setIsOpen(false); }}
              className="w-full bg-[#4A3728] text-white py-3 rounded-lg font-medium"
            >
              Connexion
            </button>
          )}
        </div>
      )}
    </nav>
  );
};
