import React from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, MapPin, Phone } from 'lucide-react';
import { MenuItem, User } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: Record<string, number>;
  menu: MenuItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onFinalize: () => void;
  user: User | null;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  menu,
  onUpdateQuantity,
  onRemove,
  onFinalize,
  user
}) => {
  // Fix: Cast 'qty' to 'number' because Object.entries can sometimes infer 'unknown' values.
  const cartItems = Object.entries(cart).map(([id, qty]) => ({
    item: menu.find(m => m.id === id)!,
    quantity: qty as number
  })).filter(ci => ci.item);

  const total = cartItems.reduce((acc, ci) => acc + (ci.item.price * ci.quantity), 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col transform transition-transform animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="px-6 py-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-xl font-serif font-bold text-[#4A3728] flex items-center gap-2">
              <ShoppingBag className="text-[#C4A484]" /> Votre Panier
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X size={24} className="text-gray-400" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-400">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <ShoppingBag size={40} className="opacity-20" />
                </div>
                <p className="font-medium">Votre panier est vide</p>
                <button 
                  onClick={onClose}
                  className="mt-4 text-[#C4A484] font-bold text-sm underline"
                >
                  Continuer mes achats
                </button>
              </div>
            ) : (
              cartItems.map(({ item, quantity }) => (
                <div key={item.id} className="flex gap-4 group">
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-gray-800">{item.name}</h3>
                      <span className="font-bold text-[#4A3728] text-sm">{item.price * quantity} DA</span>
                    </div>
                    <p className="text-xs text-gray-400 mb-3">{item.price} DA l'unité</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-2 py-1">
                        <button 
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-800"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-6 text-center text-sm font-bold">{quantity}</span>
                        <button 
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-800"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button 
                        onClick={() => onRemove(item.id)}
                        className="text-red-300 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer / Summary */}
          {cartItems.length > 0 && (
            <div className="bg-gray-50 px-6 py-8 space-y-6">
              {user && (
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Informations de livraison</p>
                  <div className="flex items-start gap-3">
                    <MapPin size={16} className="text-[#C4A484] mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-gray-600 leading-snug">{user.address}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone size={16} className="text-[#C4A484] flex-shrink-0" />
                    <p className="text-xs text-gray-600 font-medium">{user.phone}</p>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Sous-total</span>
                  <span>{total} DA</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Frais de livraison</span>
                  <span className="text-green-600 font-bold uppercase text-[10px]">Offert</span>
                </div>
                <div className="flex justify-between text-xl font-serif font-bold text-[#4A3728] pt-3 border-t border-gray-200">
                  <span>Total</span>
                  <span>{total} DA</span>
                </div>
              </div>

              <button 
                onClick={onFinalize}
                className="w-full bg-[#4A3728] text-white py-4 rounded-xl font-bold text-lg shadow-xl hover:bg-[#5D4636] transition-all transform active:scale-[0.98]"
              >
                {user ? 'Confirmer la Commande' : 'Se connecter pour commander'}
              </button>
              
              <p className="text-[10px] text-center text-gray-400 px-4">
                En finalisant, vous recevrez un appel de confirmation pour coordonner le moment exact de la livraison.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};