
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'salée' | 'sucrée' | 'boisson' | 'autre';
  image?: string;
}

export interface Livreur {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  status: 'available' | 'busy' | 'off';
  daysOff: string[]; // ['Lundi', 'Mardi']
  stats: {
    totalDeliveries: number;
    rating: number;
  };
}

export interface Reservation {
  id: string;
  customerName: string;
  phone: string;
  isWhatsApp: boolean;
  address: string;
  date: string;
  startTime: string;
  endTime?: string;
  guests: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  type: 'table' | 'espace';
}

export interface Order {
  id: string;
  customerPhone: string;
  items: { menuItemId: string; quantity: number }[];
  total: number;
  status: 'pending' | 'preparing' | 'delivering' | 'completed';
  driverId?: string; // ID du livreur affecté
  createdAt: string;
}

export interface User {
  phone: string;
  name: string;
  isAdmin: boolean;
  isWhatsApp: boolean;
  address: string;
}
