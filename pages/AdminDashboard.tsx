
import React, { useState } from 'react';
import { 
  Users, ShoppingBag, Calendar, BookOpen, Settings,
  Plus, Trash2, Edit2, CheckCircle, Clock, MessageSquare, MapPin, Search, Send, X,
  Bike, Star, Image as ImageIcon, CheckCircle2, Sliders, Info, ChevronRight, CookingPot, PackageCheck,
  CalendarDays
} from 'lucide-react';
import { MenuItem, Reservation, Order, User, Livreur } from '../types';

interface AdminDashboardProps {
  menu: MenuItem[];
  setMenu: (menu: MenuItem[]) => void;
  reservations: Reservation[];
  setReservations: (res: Reservation[]) => void;
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  clients: User[];
  livreurs: Livreur[];
  setLivreurs: (livreurs: Livreur[]) => void;
  waTemplates: any;
  setWaTemplates: (templates: any) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  menu, setMenu, reservations, setReservations, orders, setOrders, clients, livreurs, setLivreurs,
  waTemplates, setWaTemplates
}) => {
  const [activeTab, setActiveTab] = useState<'menu' | 'reservations' | 'orders' | 'clients' | 'livreurs' | 'settings'>('orders');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [isLivreurModalOpen, setIsLivreurModalOpen] = useState(false);
  
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [menuFormData, setMenuFormData] = useState<Partial<MenuItem>>({
    name: '', description: '', price: 0, category: 'salée', image: ''
  });

  const [editingLivreur, setEditingLivreur] = useState<Livreur | null>(null);
  const [livreurFormData, setLivreurFormData] = useState<Partial<Livreur>>({
    name: '', phone: '', vehicle: '', daysOff: [], status: 'available'
  });

  const formatPhoneForWA = (phone: string) => {
    let clean = phone.replace(/\s+/g, '');
    if (clean.startsWith('0')) clean = '213' + clean.substring(1);
    return clean.startsWith('213') ? clean : '213' + clean;
  };

  const sendWA = (phone: string, message: string) => {
    if (!phone) return;
    const url = `https://wa.me/${formatPhoneForWA(phone)}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const getClientName = (phone: string) => {
    return clients.find(c => c.phone === phone)?.name || "Cher client";
  };

  // --- LOGISTIQUE COMMANDES ---
  const handleStatusTransition = (order: Order, newStatus: Order['status'], driverId?: string) => {
    const updatedOrders = orders.map(o => 
      o.id === order.id ? { ...o, status: newStatus, driverId: driverId || o.driverId } : o
    );
    setOrders(updatedOrders);
    
    let templateKey = '';
    if (newStatus === 'preparing') templateKey = 'ord_preparing';
    else if (newStatus === 'delivering') templateKey = 'ord_delivering';
    else if (newStatus === 'completed') templateKey = 'ord_completed';

    if (templateKey && waTemplates[templateKey]) {
      // Important: On récupère le nom du livreur AVANT d'envoyer le message
      const activeDriverId = driverId || order.driverId;
      const driver = activeDriverId ? livreurs.find(l => l.id === activeDriverId) : null;
      
      const msg = waTemplates[templateKey]
        .replace(/{{nom}}/g, getClientName(order.customerPhone))
        .replace(/{{id}}/g, order.id)
        .replace(/{{total}}/g, order.total.toString())
        .replace(/{{livreur}}/g, driver?.name || "un de nos livreurs");

      if (confirm(`Étape : ${newStatus.toUpperCase()}\n\nEnvoyer le message WhatsApp suivant ?\n\n"${msg}"`)) {
        sendWA(order.customerPhone, msg);
      }
    }

    // Mise à jour de la disponibilité des livreurs
    if (newStatus === 'delivering' && driverId) {
      setLivreurs(livreurs.map(l => l.id === driverId ? { ...l, status: 'busy' } : l));
    } else if (newStatus === 'completed' && order.driverId) {
      setLivreurs(livreurs.map(l => l.id === order.driverId ? { 
        ...l, status: 'available', stats: { ...l.stats, totalDeliveries: (l.stats?.totalDeliveries || 0) + 1 } 
      } : l));
    }
  };

  // --- GESTION RÉSERVATIONS ---
  const updateReservationStatus = (res: Reservation, status: Reservation['status']) => {
    setReservations(reservations.map(r => r.id === res.id ? { ...r, status } : r));
    
    const templateKey = status === 'confirmed' ? 'res_confirmation' : 'res_cancellation';
    if (waTemplates[templateKey]) {
      // Gestion spécifique de l'heure de fin pour les espaces
      const finInfo = (res.type === 'espace' && res.endTime) ? ` jusqu'à ${res.endTime}` : "";
      
      const msg = waTemplates[templateKey]
        .replace(/{{nom}}/g, res.customerName)
        .replace(/{{date}}/g, res.date)
        .replace(/{{heure}}/g, res.startTime)
        .replace(/{{fin_info}}/g, finInfo); // Utilise la balise dynamique si présente

      if (confirm(`Action : ${status.toUpperCase()}\n\nNotifier le client par WhatsApp ?\n\n"${msg}"`)) {
        sendWA(res.phone, msg);
      }
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:block shrink-0">
        <div className="p-6"><h2 className="text-xl font-serif font-bold text-[#4A3728]">Admin L'Alouette</h2></div>
        <nav className="px-4 space-y-1">
          {[
            { id: 'orders', label: 'Commandes', icon: ShoppingBag },
            { id: 'reservations', label: 'Réservations', icon: Calendar },
            { id: 'livreurs', label: 'Livreurs', icon: Bike },
            { id: 'clients', label: 'Clients', icon: Users },
            { id: 'menu', label: 'La Carte', icon: BookOpen },
            { id: 'settings', label: 'Paramètres', icon: Sliders },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-[#4A3728] text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>
              <tab.icon size={18} /> {tab.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-grow p-8">
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-serif font-bold text-[#4A3728]">Suivi Logistique</h3>
            <div className="grid gap-4">
              {orders.length === 0 ? <p className="text-center py-20 text-gray-400 italic">Aucune commande en cours.</p> : 
                orders.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(order => (
                  <div key={order.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-center">
                    <div className="shrink-0 text-center md:text-left min-w-[100px]">
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Commande</p>
                      <p className="font-mono font-bold text-amber-900">#{order.id}</p>
                      <p className="text-xs font-bold">{order.total} DA</p>
                    </div>
                    <div className="flex-grow">
                      <p className="font-bold text-gray-800 text-sm">{getClientName(order.customerPhone)} • {order.customerPhone}</p>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {order.items.map((it, idx) => (
                          <span key={idx} className="text-[10px] bg-gray-50 px-2 py-1 rounded border border-gray-100">
                            {it.quantity}x {menu.find(m => m.id === it.menuItemId)?.name}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 shrink-0">
                      {order.status === 'pending' && (
                        <button onClick={() => handleStatusTransition(order, 'preparing')} className="bg-amber-600 text-white px-6 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg hover:bg-amber-700 transition-colors">
                          <CookingPot size={14} /> Préparer
                        </button>
                      )}
                      {order.status === 'preparing' && (
                        <div className="flex flex-col gap-2">
                          <select id={`d-${order.id}`} className="text-[10px] font-bold border-gray-200 rounded-xl bg-gray-50 p-2 focus:ring-1 focus:ring-amber-500">
                            <option value="">Affecter livreur...</option>
                            {livreurs.filter(l => l.status === 'available').map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                          </select>
                          <button onClick={() => {
                            const dId = (document.getElementById(`d-${order.id}`) as HTMLSelectElement).value;
                            if(dId) handleStatusTransition(order, 'delivering', dId);
                            else alert("Veuillez sélectionner un livreur disponible");
                          }} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-[10px] font-bold hover:bg-blue-700 transition-colors">Lancer Livraison</button>
                        </div>
                      )}
                      {order.status === 'delivering' && (
                        <button onClick={() => handleStatusTransition(order, 'completed')} className="bg-green-600 text-white px-6 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg hover:bg-green-700 transition-colors">
                          <CheckCircle2 size={14} /> Marquer Livrée
                        </button>
                      )}
                      {order.status === 'completed' && <div className="text-green-600 font-bold text-xs flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full"><CheckCircle2 size={16}/> Livrée</div>}
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        )}

        {activeTab === 'reservations' && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center"><h3 className="font-bold text-lg text-[#4A3728]">Planning des Réservations</h3></div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase">
                  <tr><th className="px-6 py-4">Client</th><th className="px-6 py-4">Détails</th><th className="px-6 py-4">Statut</th><th className="px-6 py-4">Actions</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {reservations.map(res => (
                    <tr key={res.id} className="text-sm hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold">{res.customerName}<br/><span className="text-xs text-gray-400 font-normal">{res.phone}</span></td>
                      <td className="px-6 py-4 font-medium">
                        {res.date} @ {res.startTime} {res.endTime && <span className="text-amber-600">→ {res.endTime}</span>}
                        <br/>
                        <span className="text-[10px] text-gray-400 capitalize">{res.type} • {res.guests} pers</span>
                      </td>
                      <td className="px-6 py-4 capitalize font-bold">
                        <span className={res.status === 'confirmed' ? 'text-green-600' : res.status === 'cancelled' ? 'text-red-600' : 'text-amber-600'}>
                          {res.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {res.status === 'pending' && (
                            <>
                              <button onClick={() => updateReservationStatus(res, 'confirmed')} className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title="Confirmer"><CheckCircle2 size={18}/></button>
                              <button onClick={() => updateReservationStatus(res, 'cancelled')} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Annuler"><Trash2 size={18}/></button>
                            </>
                          )}
                          <button onClick={() => sendWA(res.phone, `Bonjour ${res.customerName}, je reviens vers vous concernant votre réservation du ${res.date}.`)} className="p-2 text-gray-400 hover:text-green-500" title="Contacter"><MessageSquare size={18}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'livreurs' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-serif font-bold text-[#4A3728]">Équipe de Livraison</h3>
              <button onClick={() => { setEditingLivreur(null); setLivreurFormData({name:'',phone:'',status:'available', daysOff: []}); setIsLivreurModalOpen(true); }} className="bg-[#4A3728] text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg hover:bg-[#5D4636] transition-all"><Plus size={18}/> Nouveau Livreur</button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {livreurs.map(l => (
                <div key={l.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between hover:border-amber-100 transition-colors">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 bg-amber-50 text-[#C4A484] rounded-full flex items-center justify-center"><Bike size={20}/></div>
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${l.status === 'available' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>{l.status === 'available' ? 'Libre' : 'Occupé'}</span>
                    </div>
                    <h4 className="font-bold text-gray-800">{l.name}</h4>
                    <p className="text-xs text-gray-500 mb-4">{l.phone}</p>
                    
                    <div className="mt-2 flex items-center gap-2 text-amber-800 bg-amber-50/50 p-3 rounded-xl border border-amber-50">
                      <CalendarDays size={16} className="shrink-0" />
                      <div>
                        <p className="text-[10px] font-bold text-amber-900/40 uppercase tracking-widest">Jours de repos</p>
                        <p className="text-xs font-bold leading-tight">
                          {l.daysOff && l.daysOff.length > 0 ? l.daysOff.join(', ') : 'Aucun jour défini'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex gap-2">
                    <button onClick={() => { setEditingLivreur(l); setLivreurFormData(l); setIsLivreurModalOpen(true); }} className="flex-grow py-2.5 text-xs font-bold text-[#C4A484] border border-amber-100 rounded-xl hover:bg-amber-50 transition-colors flex items-center justify-center gap-2">
                      <Edit2 size={12}/> Modifier
                    </button>
                    <button onClick={() => { if(confirm("Supprimer ce livreur ?")) setLivreurs(livreurs.filter(liv => liv.id !== l.id)) }} className="p-2 text-red-300 hover:text-red-500 transition-colors">
                      <Trash2 size={16}/>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- Autres onglets inchangés (Menu, Clients) --- */}
        {activeTab === 'menu' && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
             <div className="flex justify-between items-center mb-6"><h3 className="font-bold text-lg text-[#4A3728]">Gestion du Menu</h3><button onClick={() => { setEditingMenuItem(null); setMenuFormData({name:'',price:0,image:'', description: '', category: 'salée'}); setIsMenuModalOpen(true); }} className="bg-[#4A3728] text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2"><Plus size={18}/> Ajouter un plat</button></div>
             <div className="grid gap-3">
               {menu.map(item => (
                 <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                   <div className="flex gap-4 items-center">
                     <div className="w-14 h-14 rounded-xl overflow-hidden bg-white shadow-sm shrink-0">
                       <img src={item.image || 'https://via.placeholder.com/150'} className="w-full h-full object-cover" alt="" />
                     </div>
                     <div>
                       <p className="font-bold text-gray-800 text-sm">{item.name}</p>
                       <p className="text-xs text-amber-600 font-bold">{item.price} DA</p>
                       <p className="text-[10px] text-gray-400 capitalize">{item.category}</p>
                     </div>
                   </div>
                   <div className="flex gap-1">
                     <button onClick={() => { setEditingMenuItem(item); setMenuFormData(item); setIsMenuModalOpen(true); }} className="p-2 text-gray-400 hover:text-amber-600"><Edit2 size={16}/></button>
                     <button onClick={() => { if(confirm("Supprimer du menu ?")) setMenu(menu.filter(m => m.id !== item.id)) }} className="p-2 text-gray-400 hover:text-red-600"><Trash2 size={16}/></button>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        )}

        {activeTab === 'clients' && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center"><h3 className="font-bold text-lg text-[#4A3728]">Base de Données Clients</h3><div className="relative w-64"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4"/><input type="text" placeholder="Rechercher un client..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-xs focus:ring-1 focus:ring-[#C4A484]"/></div></div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase">
                  <tr><th className="px-6 py-4">Nom / Téléphone</th><th className="px-6 py-4">Adresse</th><th className="px-6 py-4">Actions</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {clients.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.phone.includes(searchQuery)).map(c => (
                    <tr key={c.phone} className="text-sm hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-bold">{c.name}<br/><span className="text-xs text-gray-400 font-normal">{c.phone}</span></td>
                      <td className="px-6 py-4 text-xs text-gray-500 max-w-xs truncate">{c.address}</td>
                      <td className="px-6 py-4">
                        <button onClick={() => sendWA(c.phone, `Bonjour ${c.name}, toute l'équipe de l'Alouette vous souhaite une excellente journée.`)} className="text-green-500 p-2 hover:bg-green-50 rounded-lg transition-colors" title="Message personnalisé"><MessageSquare size={18}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-8">
            <h3 className="text-xl font-serif font-bold text-[#4A3728] flex items-center gap-2"><MessageSquare /> Paramètres WhatsApp Automatiques</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 font-bold text-amber-800 text-sm border-b pb-2"><Calendar size={16}/> Notifications Réservations</div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase mb-2 block">Message de Confirmation</label>
                  <textarea className="w-full p-4 bg-gray-50 rounded-2xl text-xs h-28 focus:ring-1 focus:ring-amber-500 outline-none" value={waTemplates.res_confirmation} onChange={e => setWaTemplates({...waTemplates, res_confirmation: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase mb-2 block">Message d'Annulation</label>
                  <textarea className="w-full p-4 bg-gray-50 rounded-2xl text-xs h-28 focus:ring-1 focus:ring-amber-500 outline-none" value={waTemplates.res_cancellation} onChange={e => setWaTemplates({...waTemplates, res_cancellation: e.target.value})} />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2 font-bold text-blue-800 text-sm border-b pb-2"><ShoppingBag size={16}/> Cycle de vie Commande</div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase mb-2 block">1. Mise en préparation 👨‍🍳</label>
                  <textarea className="w-full p-4 bg-gray-50 rounded-2xl text-xs h-20 focus:ring-1 focus:ring-blue-500 outline-none" value={waTemplates.ord_preparing} onChange={e => setWaTemplates({...waTemplates, ord_preparing: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase mb-2 block">2. Affectation Livreur & Départ 🛵</label>
                  <textarea className="w-full p-4 bg-gray-50 rounded-2xl text-xs h-20 focus:ring-1 focus:ring-blue-500 outline-none" value={waTemplates.ord_delivering} onChange={e => setWaTemplates({...waTemplates, ord_delivering: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase mb-2 block">3. Fin de Livraison (Succès) ✅</label>
                  <textarea className="w-full p-4 bg-gray-50 rounded-2xl text-xs h-20 focus:ring-1 focus:ring-blue-500 outline-none" value={waTemplates.ord_completed} onChange={e => setWaTemplates({...waTemplates, ord_completed: e.target.value})} />
                </div>
              </div>
            </div>
            <div className="bg-amber-50 p-5 rounded-2xl text-[10px] text-amber-700 leading-relaxed border border-amber-100">
              <strong>Variables disponibles :</strong><br/>
              {"{{nom}}"} : Nom du client<br/>
              {"{{id}}"} : N° de commande<br/>
              {"{{total}}"} : Montant Total<br/>
              {"{{livreur}}"} : Nom du livreur<br/>
              {"{{date}}"} : Date de réservation<br/>
              {"{{heure}}"} : Heure de début<br/>
              {"{{fin_info}}"} : Heure de fin (si applicable)
            </div>
          </div>
        )}
      </main>

      {/* MODAL LIVREUR */}
      {isLivreurModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsLivreurModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl">
            <h3 className="text-xl font-bold mb-6 text-[#4A3728] flex items-center gap-2"><Bike size={24}/> {editingLivreur ? 'Modifier Profil' : 'Nouveau Livreur'}</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (editingLivreur) setLivreurs(livreurs.map(l => l.id === editingLivreur.id ? { ...l, ...livreurFormData } as Livreur : l));
              else setLivreurs([...livreurs, { ...livreurFormData, id: Math.random().toString(36).substr(2, 9), status: 'available', stats: { totalDeliveries: 0, rating: 5 } } as Livreur]);
              setIsLivreurModalOpen(false);
            }} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">Nom et Prénom</label>
                <input placeholder="Ex: Ahmed Benali" className="w-full px-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#C4A484]" value={livreurFormData.name} onChange={e => setLivreurFormData({...livreurFormData, name: e.target.value})} required />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">Numéro WhatsApp</label>
                <input placeholder="05 55 55 55 55" className="w-full px-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#C4A484]" value={livreurFormData.phone} onChange={e => setLivreurFormData({...livreurFormData, phone: e.target.value})} required />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest flex items-center gap-2">
                  <CalendarDays size={14} className="text-amber-500" /> Jours de repos
                </label>
                <input 
                  placeholder="Lundi, Mardi (Séparez par des virgules)" 
                  className="w-full px-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#C4A484]" 
                  value={livreurFormData.daysOff?.join(', ')} 
                  onChange={e => setLivreurFormData({...livreurFormData, daysOff: e.target.value.split(',').map(s => s.trim()).filter(s => s !== '')})} 
                />
              </div>
              <button type="submit" className="w-full bg-[#4A3728] text-white py-5 rounded-2xl font-bold text-lg shadow-xl hover:bg-[#5D4636] transition-all transform active:scale-[0.98] mt-4">
                {editingLivreur ? 'Enregistrer les modifications' : 'Ajouter à l\'équipe'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL MENU */}
      {isMenuModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMenuModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl">
            <h3 className="text-xl font-bold mb-6 text-[#4A3728] flex items-center gap-2"><BookOpen size={24}/> {editingMenuItem ? 'Éditer l\'article' : 'Nouveau plat'}</h3>
            <form onSubmit={(e) => { 
              e.preventDefault(); 
              if (editingMenuItem) setMenu(menu.map(m => m.id === editingMenuItem.id ? { ...m, ...menuFormData } as MenuItem : m)); 
              else setMenu([...menu, { ...menuFormData, id: Math.random().toString(36).substr(2, 9) } as MenuItem]); 
              setIsMenuModalOpen(false); 
            }} className="space-y-4">
              <input placeholder="Nom du plat" className="w-full px-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#C4A484]" value={menuFormData.name} onChange={e => setMenuFormData({...menuFormData, name: e.target.value})} required />
              <input type="number" placeholder="Prix (en DA)" className="w-full px-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#C4A484]" value={menuFormData.price} onChange={e => setMenuFormData({...menuFormData, price: Number(e.target.value)})} required />
              <textarea placeholder="Description courte..." className="w-full px-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#C4A484] h-24" value={menuFormData.description} onChange={e => setMenuFormData({...menuFormData, description: e.target.value})} />
              <input placeholder="URL de l'image" className="w-full px-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#C4A484]" value={menuFormData.image} onChange={e => setMenuFormData({...menuFormData, image: e.target.value})} />
              <button type="submit" className="w-full bg-[#4A3728] text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-[#5D4636] transition-all">Valider l'article</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
