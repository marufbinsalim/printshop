// components/ticket-selector.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { Ticket, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

interface TicketSelectorProps {
  raffleId: string;
  raffleName: string;
  pricePerTicket: number;
  maxTickets?: number;
}

export function TicketSelector({
  raffleId,
  raffleName,
  pricePerTicket,
  maxTickets = 50,
}: TicketSelectorProps) {
  const [selectedCount, setSelectedCount] = useState(1);
  const [isOpen, setIsOpen] = useState(false);

  const handleQuickSelect = (count: number) => {
    setSelectedCount(count);
  };

  const handleAddToCart = () => {
    // Burada sepete ekleme işlemi yapılacak
    toast.success(`${selectedCount} bilet sepete eklendi`);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Ticket className="mr-2 h-4 w-4" />
          Bilet Al
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{raffleName}</span>
            <Badge variant="secondary">${pricePerTicket}/bilet</Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Hızlı Seçim */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Hızlı Seçim</label>
            <div className="flex gap-2 flex-wrap">
              {[1, 5, 10, 20].map((num) => (
                <Button
                  key={num}
                  variant={selectedCount === num ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleQuickSelect(num)}
                >
                  {num} Bilet
                </Button>
              ))}
            </div>
          </div>

          {/* Manuel Seçim */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Manuel Seçim
              <span className="text-muted-foreground ml-2">
                (Maks. {maxTickets} bilet)
              </span>
            </label>
            <div className="flex gap-2 items-center">
              <Input
                type="number"
                min={1}
                max={maxTickets}
                value={selectedCount}
                onChange={(e) => setSelectedCount(Number(e.target.value))}
                className="w-24"
              />
              <span className="text-muted-foreground">
                × ${pricePerTicket} = ${selectedCount * pricePerTicket}
              </span>
            </div>
          </div>

          {/* Bilgi */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Seçtiğiniz biletler otomatik olarak atanacaktır. 
              Her bilet benzersiz bir numara alır.
            </AlertDescription>
          </Alert>

          {/* Toplam ve Onay */}
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-t">
              <span className="font-medium">Toplam Tutar:</span>
              <span className="text-lg font-bold">
                ${selectedCount * pricePerTicket}
              </span>
            </div>
            <Button 
              className="w-full" 
              onClick={handleAddToCart}
              disabled={selectedCount < 1 || selectedCount > maxTickets}
            >
              Sepete Ekle
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}