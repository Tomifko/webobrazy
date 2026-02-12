'use client';

import { useCart } from '@/context/CartContext';
import { Obraz } from '@/types';
import { ShoppingCart, Check } from 'lucide-react';
import { useState } from 'react';

interface AddToCartButtonProps {
  obraz: Obraz;
}

export default function AddToCartButton({ obraz }: AddToCartButtonProps) {
  const { addToCart, items } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  
  const isInCart = items.some((item) => item.obraz.id === obraz.id);

  const handleAddToCart = () => {
    if (!isInCart) {
      addToCart(obraz);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isInCart}
      className={`
        w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all
        flex items-center justify-center space-x-2
        ${
          isInCart
            ? 'bg-green-50 text-green-700 cursor-not-allowed'
            : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg hover:shadow-xl'
        }
      `}
    >
      {isInCart ? (
        <>
          <Check className="h-6 w-6" />
          <span>V košíku</span>
        </>
      ) : (
        <>
          <ShoppingCart className="h-6 w-6" />
          <span>{justAdded ? 'Pridané!' : 'Pridať do košíka'}</span>
        </>
      )}
    </button>
  );
}