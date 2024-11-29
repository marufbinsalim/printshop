"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Minus } from 'lucide-react';
import { useCart } from '@/components/cart-provider';
import { toast } from 'sonner';
import { TicketNumberSelector } from './ticket-number-selector';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface AddToCartButtonProps {
  raffleId: number;
  raffleName: string;
  pricePerTicket: number;
}

export default function AddToCartButton({
  raffleId,
  raffleName,
  pricePerTicket,
}: AddToCartButtonProps) {
  const [ticketCount, setTicketCount] = useState(1);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { dispatch } = useCart();

  const addToCart = () => {
    if (selectedNumbers.length !== ticketCount) {
      toast.error(`Please select ${ticketCount} ticket numbers`);
      return;
    }

    dispatch({
      type: 'ADD_TICKETS',
      payload: {
        raffleId,
        raffleName,
        ticketCount,
        pricePerTicket,
        ticketNumbers: selectedNumbers,
      },
    });
    toast.success(`Added ${ticketCount} tickets to cart`);
    setIsOpen(false);
    setSelectedNumbers([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex gap-2">
        <div className="flex items-center">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Input
            type="number"
            min="1"
            value={ticketCount}
            onChange={(e) => setTicketCount(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-20 text-center mx-2"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTicketCount(ticketCount + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <DialogTrigger asChild>
          <Button className="flex-1">Select Numbers</Button>
        </DialogTrigger>
      </div>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Select Your Ticket Numbers</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <TicketNumberSelector
            raffleId={raffleId}
            onSelect={setSelectedNumbers}
            selectedCount={ticketCount}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addToCart}>
              Add to Cart (${(ticketCount * pricePerTicket).toFixed(2)})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}