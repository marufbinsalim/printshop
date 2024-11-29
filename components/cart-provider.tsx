"use client";

import { createContext, useContext, useReducer, ReactNode } from 'react';

type CartItem = {
  raffleId: number;
  raffleName: string;
  ticketCount: number;
  pricePerTicket: number;
  ticketNumbers: number[];
};

type CartState = {
  items: CartItem[];
  total: number;
};

type CartAction =
  | { type: 'ADD_TICKETS'; payload: CartItem }
  | { type: 'REMOVE_TICKETS'; payload: { raffleId: number } }
  | { type: 'UPDATE_TICKET_COUNT'; payload: { raffleId: number; ticketCount: number; ticketNumbers: number[] } }
  | { type: 'CLEAR_CART' };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | undefined>(undefined);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_TICKETS': {
      const existingItem = state.items.find(
        (item) => item.raffleId === action.payload.raffleId
      );

      const items = existingItem
        ? state.items.map((item) =>
            item.raffleId === action.payload.raffleId
              ? {
                  ...item,
                  ticketCount: item.ticketCount + action.payload.ticketCount,
                  ticketNumbers: [...item.ticketNumbers, ...action.payload.ticketNumbers],
                }
              : item
          )
        : [...state.items, action.payload];

      return {
        items,
        total: items.reduce(
          (sum, item) => sum + item.ticketCount * item.pricePerTicket,
          0
        ),
      };
    }
    case 'REMOVE_TICKETS': {
      const items = state.items.filter(
        (item) => item.raffleId !== action.payload.raffleId
      );
      return {
        items,
        total: items.reduce(
          (sum, item) => sum + item.ticketCount * item.pricePerTicket,
          0
        ),
      };
    }
    case 'UPDATE_TICKET_COUNT': {
      const items = state.items.map((item) =>
        item.raffleId === action.payload.raffleId
          ? {
              ...item,
              ticketCount: action.payload.ticketCount,
              ticketNumbers: action.payload.ticketNumbers,
            }
          : item
      );
      return {
        items,
        total: items.reduce(
          (sum, item) => sum + item.ticketCount * item.pricePerTicket,
          0
        ),
      };
    }
    case 'CLEAR_CART':
      return { items: [], total: 0 };
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}