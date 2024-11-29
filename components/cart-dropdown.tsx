"use client";

import { ShoppingCart, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCart } from '@/components/cart-provider';
import Link from 'next/link';

export function CartDropdown() {
  const { state, dispatch } = useCart();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-4 w-4" />
          {state.items.length > 0 && (
            <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
              {state.items.reduce((sum, item) => sum + item.ticketCount, 0)}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        {state.items.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            Your cart is empty
          </div>
        ) : (
          <>
            <div className="p-4 space-y-4">
              {state.items.map((item) => (
                <div key={item.raffleId} className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="font-medium">{item.raffleName}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.ticketCount} tickets × ${item.pricePerTicket}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      dispatch({
                        type: 'REMOVE_TICKETS',
                        payload: { raffleId: item.raffleId },
                      })
                    }
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="border-t p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="font-medium">Total</span>
                <span className="font-bold">${state.total.toFixed(2)}</span>
              </div>
              <Button asChild className="w-full">
                <Link href="/cart">View Cart</Link>
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}