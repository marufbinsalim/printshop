"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCart } from "@/components/cart-provider";
import { Minus, Plus, X } from "lucide-react";

export default function CartPage() {
  const { state, dispatch } = useCart();

  const updateTicketCount = (raffleId: number, newCount: number) => {
    if (newCount < 1) return;
    dispatch({
      type: "UPDATE_TICKET_COUNT",
      payload: { raffleId, ticketCount: newCount, ticketNumbers: [] },
    });
  };

  if (state.items.length === 0) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">Your cart is empty</p>
          <Button asChild>
            <a href="/raffles">Browse Raffles</a>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          {state.items.map((item) => (
            <Card key={item.raffleId} className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">{item.raffleName}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    ${item.pricePerTicket} per ticket
                  </p>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        updateTicketCount(item.raffleId, item.ticketCount - 1)
                      }
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      min="1"
                      value={item.ticketCount}
                      onChange={(e) =>
                        updateTicketCount(
                          item.raffleId,
                          parseInt(e.target.value) || 1,
                        )
                      }
                      className="w-20 text-center"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        updateTicketCount(item.raffleId, item.ticketCount + 1)
                      }
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold mb-2">
                    ${(item.ticketCount * item.pricePerTicket).toFixed(2)}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      dispatch({
                        type: "REMOVE_TICKETS",
                        payload: { raffleId: item.raffleId },
                      })
                    }
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <div>
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Order Summary</h3>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${state.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Processing Fee</span>
                <span>$0.00</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${state.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <Button className="w-full">Proceed to Checkout</Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
