
import { MenuItem } from './types';

export const RESTAURANT_INFO = {
  name: "L'Alouette des champs",
  address: "WQM6+4HV, Rte du Cap de Garde, Annaba",
  phone: "0556 94 80 90",
  hours: "12:00 - 22:00",
  description: "Nichée sur la route du Cap de Garde à Annaba, notre crêperie vous accueille dans un cadre rustique et chaleureux. Venez savourer nos crêpes artisanales sur notre magnifique terrasse surplombant la nature.",
  images: {
    logo: "https://i.ibb.co/VMTF29j/logo.jpg", 
    terrace: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200",
    ambiance: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=1200",
    crepe: "https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&q=80&w=800"
  }
};

export const INITIAL_MENU: MenuItem[] = [
  { 
    id: '1', 
    name: 'La Complète', 
    description: 'Une base gourmande avec œuf frais, jambon de dinde fumé et emmental fondu. Le grand classique.', 
    price: 650, 
    category: 'salée',
    image: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '2', 
    name: 'L\'Annabaise', 
    description: 'Inspirée par les saveurs d\'Annaba : viande hachée saisie, poivrons marinés et un mélange d\'épices secrètes.', 
    price: 850, 
    category: 'salée',
    image: 'https://images.unsplash.com/photo-1621319081643-1bc8af58d451?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '3', 
    name: 'Nutella Banane Royale', 
    description: 'Une crêpe généreusement tartinée de Nutella, accompagnée de bananes fraîches et d\'éclats d\'amandes.', 
    price: 550, 
    category: 'sucrée',
    image: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '4', 
    name: 'Caramel Beurre Salé Maison', 
    description: 'Le vrai goût de la Bretagne. Caramel au beurre salé fait maison et nuage de chantilly.', 
    price: 500, 
    category: 'sucrée',
    image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: '5', 
    name: 'Jus d\'Orange Frais', 
    description: 'Oranges d\'Algérie pressées à la minute. Riche en vitamines.', 
    price: 300, 
    category: 'boisson',
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&q=80&w=800'
  },
];
