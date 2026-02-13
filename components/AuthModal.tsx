
import React, { useState } from 'react';
import { X, Phone, User as UserIcon, MessageSquare, MapPin } from 'lucide-react';
import { User } from '../types';

interface AuthModalProps {
  onClose: () => void;
  onLogin: (phone: string, name: string, isWhatsApp: boolean, address: string) => void;
  existingUsers: User[];
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onLogin, existingUsers }) => {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [isWhatsApp, setIsWhatsApp] = useState(false);
  const [address, setAddress] = useState('');
  const [step, setStep] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (phone.length >= 3) {
        // Check if user already exists
        const foundUser = existingUsers.find(u => u.phone.replace(/\s/g, '') === phone.replace(/\s/g, ''));
        
        if (foundUser) {
          // Bypass step 2 and log in directly
          onLogin(foundUser.phone, foundUser.name, foundUser.isWhatsApp, foundUser.address);
        } else {
          // If admin special codes are entered directly without being in "existingUsers" yet
          if (phone === 'admin' || phone === '0556948090' || phone === '099999999') {
             onLogin(phone, 'Admin', true, 'Bureau Administration');
             return;
          }
          setStep(2);
        }
      }
    } else {
      if (name.length >= 2 && address.length >= 5) {
        onLogin(phone, name, isWhatsApp, address);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[#4A3728]/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 overflow-hidden">
        <button onClick={onClose} className="absolute right-6 top-6 text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-amber-50 text-[#C4A484] rounded-full flex items-center justify-center mx-auto mb-4">
             {step === 1 ? <Phone size={32} /> : <UserIcon size={32} />}
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#4A3728]">
            {step === 1 ? 'Bienvenue !' : 'Informations Client'}
          </h2>
          <p className="text-sm text-gray-400 mt-2">
            {step === 1 
              ? 'Saisissez votre numéro pour continuer' 
              : 'Complétez votre profil pour les livraisons'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">Téléphone</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">+213</span>
                  <input 
                    autoFocus
                    type="tel"
                    placeholder="05 55 55 55 55"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-16 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#C4A484] text-lg font-bold"
                    required
                  />
                </div>
              </div>
              <p className="text-[10px] text-gray-400 text-center px-4">
                Si vous avez déjà commandé chez nous, vous serez connecté automatiquement.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">Nom Complet</label>
                <input 
                  autoFocus
                  type="text"
                  placeholder="Votre nom..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#C4A484]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">Adresse de livraison</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
                  <textarea 
                    placeholder="Votre adresse complète à Annaba (Quartier, N° porte...)"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={3}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#C4A484] resize-none"
                    required
                  />
                </div>
              </div>
              <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl cursor-pointer hover:bg-gray-100 transition-colors">
                <input 
                  type="checkbox" 
                  checked={isWhatsApp} 
                  onChange={(e) => setIsWhatsApp(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-[#25D366] focus:ring-[#25D366]"
                />
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[#25D366]" />
                  <span className="text-sm font-medium text-gray-700">Utilise WhatsApp sur ce numéro</span>
                </div>
              </label>
            </div>
          )}

          <button 
            type="submit"
            className="w-full bg-[#4A3728] text-white py-4 rounded-2xl font-bold text-lg hover:bg-[#5D4636] transition-all shadow-xl"
          >
            {step === 1 ? 'Continuer' : 'Enregistrer mon profil'}
          </button>
        </form>
      </div>
    </div>
  );
};
