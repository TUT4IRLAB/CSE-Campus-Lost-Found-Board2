import React from 'react';
import {
  Laptop,
  CreditCard,
  BookOpen,
  Briefcase,
  Key,
  Shirt,
  Wallet,
  Package,
} from 'lucide-react';
import { ItemCategory } from '@/types';

export const CategoryIcon: React.FC<{
  category: ItemCategory;
  className?: string;
}> = ({ category, className = 'w-5 h-5' }) => {
  switch (category) {
    case 'Electronics':
      return <Laptop className={className} />;
    case 'Student Cards & IDs':
      return <CreditCard className={className} />;
    case 'Books & Study Material':
      return <BookOpen className={className} />;
    case 'Bags & Backpacks':
      return <Briefcase className={className} />;
    case 'Keys':
      return <Key className={className} />;
    case 'Clothing & Accessories':
      return <Shirt className={className} />;
    case 'Wallets & Purses':
      return <Wallet className={className} />;
    default:
      return <Package className={className} />;
  }
};
