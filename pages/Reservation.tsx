
import React, { useState } from 'react';
import { Calendar as CalendarIcon, Users, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { format, addDays, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale/fr';
import { User, Reservation } from '../types';

interface ReservationProps {
  user: User | null;
  onAuthRequired: () => void;
  onSubmit: (res: Reservation) => void;
}

export const ReservationPage: React.FC<ReservationProps> = ({ user, onAuthRequired, onSubmit }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedEndTime, setSelectedEndTime] = useState('');
  const [guests, setGuests] = useState(2);
  const [resType, setResType] = useState<'table' | 'espace'>('table');
  const [isSuccess, setIsSuccess] = useState(false);

  const timeSlots = ['12:00', '13:00', '14:00', '15:00', '18:00', '19:00', '20:00', '21:00', '22:00'];
  const dates = Array.from({ length: 14 }).map((_, i) => addDays(new Date(), i));

  const isEspace = resType === 'espace';
  const isInvalidGuestCount = isEspace && guests < 8;

  const handleBooking = () => {
    if (!user) {
      onAuthRequired();
      return;
    }
    if (!selectedTime) return;
    if (isEspace && (!selectedEndTime || isInvalidGuestCount)) return;

    const newRes: Reservation = {
      id: Math.random().toString(36).substr(2, 9),
      customerName: user.name,
      phone: user.phone,
      isWhatsApp: user.isWhatsApp,
      address: user.address,
      date: format(selectedDate, 'yyyy-MM-dd'),
      startTime: selectedTime,
      endTime: isEspace ? selectedEndTime : undefined,
      guests,
      status: 'pending',
      type: resType
    };

    onSubmit(newRes);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="max-w-md mx-auto py-24 text-center px-4">
        <div className="mb-6 inline-flex p-4 bg-green-50 rounded-full text-green-600">
          <CheckCircle2 size={48} />
        </div>
        <h1 className="text-3xl font-serif font-bold mb-4">Réservation Reçue !</h1>
        <p className="text-gray-600 mb-8">
          Merci {user?.name}. Votre demande de réservation pour le {format(selectedDate, 'd MMMM', { locale: fr })} {isEspace ? `de ${selectedTime} à ${selectedEndTime}` : `à ${selectedTime}`} est en cours de confirmation.
        </p>
        <button 
          onClick={() => setIsSuccess(false)}
          className="bg-[#4A3728] text-white px-8 py-3 rounded-full font-bold"
        >
          Nouvelle réservation
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-serif font-bold text-[#4A3728] mb-4">Réservez votre Moment</h1>
        <p className="text-gray-500">Choisissez une table ou privatisez notre espace pour vos événements</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Type Selector */}
          <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex gap-2">
            <button 
              onClick={() => { setResType('table'); setGuests(2); }}
              className={`flex-1 py-4 rounded-xl font-bold transition-all ${resType === 'table' ? 'bg-[#4A3728] text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}
            >TABLE INDIVIDUELLE</button>
            <button 
              onClick={() => { setResType('espace'); setGuests(8); }}
              className={`flex-1 py-4 rounded-xl font-bold transition-all ${resType === 'espace' ? 'bg-[#C4A484] text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}
            >PRIVATISATION ESPACE</button>
          </div>

          {/* Date Selector */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="flex items-center gap-2 font-bold mb-6 text-gray-700">
              <CalendarIcon size={20} className="text-[#C4A484]" /> 1. Choisir la Date
            </h3>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {dates.map((date) => (
                <button
                  key={date.toISOString()}
                  onClick={() => setSelectedDate(date)}
                  className={`p-3 rounded-xl flex flex-col items-center transition-all ${
                    isSameDay(selectedDate, date)
                    ? 'bg-[#4A3728] text-white'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-[10px] uppercase opacity-70">{format(date, 'EEE', { locale: fr })}</span>
                  <span className="text-lg font-bold">{format(date, 'd')}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Time Slots */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="flex items-center gap-2 font-bold mb-6 text-gray-700">
              <Clock size={20} className="text-[#C4A484]" /> 2. {isEspace ? 'Plage Horaire' : 'Heure d\'arrivée'}
            </h3>
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase mb-3 block">{isEspace ? 'HEURE DE DÉBUT' : 'CHOISIR L\'HEURE'}</span>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {timeSlots.map((time) => (
                    <button
                      key={`start-${time}`}
                      onClick={() => setSelectedTime(time)}
                      className={`py-3 rounded-xl font-medium transition-all ${
                        selectedTime === time ? 'bg-[#C4A484] text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {isEspace && (
                <div className="pt-4 border-t border-gray-50">
                  <span className="text-xs font-bold text-gray-400 uppercase mb-3 block">HEURE DE FIN</span>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {timeSlots.filter(t => t > selectedTime).map((time) => (
                      <button
                        key={`end-${time}`}
                        onClick={() => setSelectedEndTime(time)}
                        className={`py-3 rounded-xl font-medium transition-all ${
                          selectedEndTime === time ? 'bg-[#4A3728] text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                  {!selectedTime && <p className="text-xs text-amber-600 mt-2 italic">Veuillez d'abord choisir l'heure de début.</p>}
                </div>
              )}
            </div>
          </div>

          {/* Guests */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="flex items-center gap-2 font-bold text-gray-700">
                  <Users size={20} className="text-[#C4A484]" /> 3. Nombre de personnes
                </h3>
                {isEspace && (
                  <p className="text-xs text-amber-600 mt-1 font-medium flex items-center gap-1">
                    <AlertTriangle size={12} /> Minimum 8 couverts pour l'espace
                  </p>
                )}
              </div>
              <div className="flex items-center gap-4 bg-gray-50 rounded-full px-4 py-2 border border-transparent transition-colors">
                <button 
                  onClick={() => setGuests(Math.max(1, guests - 1))}
                  className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm"
                >-</button>
                <span className={`w-8 text-center font-bold ${isInvalidGuestCount ? 'text-red-500' : 'text-gray-800'}`}>{guests}</span>
                <button 
                  onClick={() => setGuests(guests + 1)}
                  className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm"
                >+</button>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 h-fit sticky top-24">
          <h3 className="font-serif font-bold text-xl mb-6 text-[#4A3728]">Récapitulatif</h3>
          
          <div className="space-y-4 mb-8">
            <div className="flex justify-between text-sm py-2 border-b border-gray-50">
              <span className="text-gray-500">Type</span>
              <span className="font-bold uppercase tracking-wider">{resType}</span>
            </div>
            <div className="flex justify-between text-sm py-2 border-b border-gray-50">
              <span className="text-gray-500">Date</span>
              <span className="font-bold">{format(selectedDate, 'd MMMM yyyy', { locale: fr })}</span>
            </div>
            <div className="flex justify-between text-sm py-2 border-b border-gray-50">
              <span className="text-gray-500">Horaire</span>
              <span className="font-bold">
                {selectedTime ? (isEspace ? `${selectedTime} - ${selectedEndTime || '...'}` : selectedTime) : 'Non choisi'}
              </span>
            </div>
            <div className="flex justify-between text-sm py-2 border-b border-gray-50">
              <span className="text-gray-500">Couverts</span>
              <span className={`font-bold ${isInvalidGuestCount ? 'text-red-500' : ''}`}>{guests} pers.</span>
            </div>
          </div>

          <button 
            disabled={!selectedTime || (isEspace && !selectedEndTime) || isInvalidGuestCount}
            onClick={handleBooking}
            className="w-full bg-[#4A3728] text-white py-4 rounded-xl font-bold shadow-xl hover:bg-[#5D4636] disabled:bg-gray-200 disabled:shadow-none transition-all"
          >
            {user ? 'Confirmer la Réservation' : 'Se connecter pour réserver'}
          </button>
          
          {isInvalidGuestCount && (
            <p className="text-[10px] text-red-500 font-bold mt-4 text-center">
              * Veuillez augmenter le nombre de couverts pour privatiser l'espace.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
