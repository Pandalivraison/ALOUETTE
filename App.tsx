
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Menu } from './pages/Menu';
import { ReservationPage } from './pages/Reservation';
import { AdminDashboard } from './pages/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { CartDrawer } from './components/CartDrawer';
import { User, MenuItem, Reservation, Order, Livreur } from './types';
import { INITIAL_MENU } from './constants';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'menu' | 'reservation' | 'admin'>('home');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // --- PERSISTENCE HELPERS ---
  const getSaved = <T,>(key: string, defaultValue: T): T => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch {
      return defaultValue;
    }
  };

  // --- STATES ---
  const [user, setUser] = useState<User | null>(() => getSaved('alouette_session', null));
  const [menu, setMenu] = useState<MenuItem[]>(() => getSaved('alouette_menu', INITIAL_MENU));
  const [cart, setCart] = useState<Record<string, number>>(() => getSaved('alouette_cart', {}));
  const [reservations, setReservations] = useState<Reservation[]>(() => getSaved('alouette_reservations', []));
  const [orders, setOrders] = useState<Order[]>(() => getSaved('alouette_orders', []));
  const [allUsers, setAllUsers] = useState<User[]>(() => getSaved('alouette_users', []));
  const [livreurs, setLivreurs] = useState<Livreur[]>(() => getSaved('alouette_livreurs', []));
  
  const [waTemplates, setWaTemplates] = useState(() => getSaved('alouette_wa_templates', {
    // Réservations
    res_confirmation: "Bonjour {{nom}} ! Votre réservation pour le {{date}} à {{heure}}{{fin_info}} est CONFIRMÉE ✅. À bientôt !",
    res_cancellation: "Bonjour {{nom}}. Votre réservation pour le {{date}} à {{heure}} a été ANNULÉE ❌.",
    // Commandes
    ord_preparing: "Bonne nouvelle {{nom}} ! Votre commande #{{id}} est désormais en cours de préparation en cuisine 👨‍🍳.",
    ord_delivering: "Votre commande #{{id}} est en route 🛵 ! Elle vous sera livrée par {{livreur}}.",
    ord_completed: "Votre commande #{{id}} a été livrée ✅. Toute l'équipe vous souhaite un excellent appétit !"
  }));

  // --- SYNC ---
  useEffect(() => { localStorage.setItem('alouette_menu', JSON.stringify(menu)); }, [menu]);
  useEffect(() => { localStorage.setItem('alouette_users', JSON.stringify(allUsers)); }, [allUsers]);
  useEffect(() => { localStorage.setItem('alouette_reservations', JSON.stringify(reservations)); }, [reservations]);
  useEffect(() => { localStorage.setItem('alouette_orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('alouette_livreurs', JSON.stringify(livreurs)); }, [livreurs]);
  useEffect(() => { localStorage.setItem('alouette_wa_templates', JSON.stringify(waTemplates)); }, [waTemplates]);
  useEffect(() => { localStorage.setItem('alouette_cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { 
    if (user) localStorage.setItem('alouette_session', JSON.stringify(user));
    else localStorage.removeItem('alouette_session');
  }, [user]);

  // --- LOGIC ---
  const navigate = (page: 'home' | 'menu' | 'reservation' | 'admin') => {
    if (page === 'admin' && (!user || !user.isAdmin)) {
      setIsAuthModalOpen(true);
      return;
    }
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleLogin = (phone: string, name: string, isWhatsApp: boolean, address: string) => {
    const isAdmin = phone === '0556948090' || phone === '099999999' || phone === 'admin';
    const userData: User = { phone, name, isAdmin, isWhatsApp, address };
    setUser(userData);
    setIsAuthModalOpen(false);
    setAllUsers(prev => {
      const exists = prev.find(u => u.phone === phone);
      return exists ? prev.map(u => u.phone === phone ? userData : u) : [...prev, userData];
    });
    if (isAdmin) setCurrentPage('admin');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('home');
  };

  const addToCart = (item: MenuItem) => {
    setCart(prev => ({ ...prev, [item.id]: (prev[item.id] || 0) + 1 }));
    setIsCartOpen(true);
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart(prev => {
      const qty = (prev[itemId] || 0) + delta;
      if (qty <= 0) {
        const { [itemId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [itemId]: qty };
    });
  };

  const finalizeOrder = () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    const items = Object.entries(cart).map(([menuItemId, quantity]) => ({ menuItemId, quantity: quantity as number }));
    const total = items.reduce((acc, it) => acc + (menu.find(m => m.id === it.menuItemId)?.price || 0) * it.quantity, 0);

    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      customerPhone: user.phone,
      items,
      total,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setOrders(prev => [newOrder, ...prev]);
    setCart({});
    setIsCartOpen(false);
    alert("Commande reçue ! Suivez son avancement depuis votre espace.");
  };

  const cartItemCount = Object.values(cart).reduce((a, b) => (a as number) + (b as number), 0);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar 
        navigate={navigate} currentPage={currentPage} user={user} 
        onAuthClick={() => setIsAuthModalOpen(true)} onLogout={handleLogout}
        cartItemCount={cartItemCount} onCartClick={() => setIsCartOpen(true)}
      />
      <main className="flex-grow pt-16">
        {currentPage === 'home' && <Home navigate={navigate} />}
        {currentPage === 'menu' && <Menu menu={menu} onOrder={addToCart} />}
        {currentPage === 'reservation' && (
          <ReservationPage user={user} onAuthRequired={() => setIsAuthModalOpen(true)} onSubmit={(res) => setReservations(prev => [res, ...prev])} />
        )}
        {currentPage === 'admin' && (
          <AdminDashboard 
            menu={menu} setMenu={setMenu}
            reservations={reservations} setReservations={setReservations}
            orders={orders} setOrders={setOrders}
            clients={allUsers}
            livreurs={livreurs} setLivreurs={setLivreurs}
            waTemplates={waTemplates} setWaTemplates={setWaTemplates}
          />
        )}
      </main>
      <Footer />
      {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} onLogin={handleLogin} existingUsers={allUsers} />}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cart={cart} menu={menu} onUpdateQuantity={updateQuantity} onRemove={(id) => updateQuantity(id, -999)} onFinalize={finalizeOrder} user={user} />
    </div>
  );
};

export default App;
