'use client';

import React, { useState } from 'react';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Filter, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface MonthlyTicketNumberSelectorProps {
  raffleId: string;
  month: string; // Format: YYYY-MM
  soldNumbers: number[];
  onNumberSelect: (number: number) => void;
  maxNumber?: number;
  price: number;
}

export function MonthlyTicketNumberSelector({
  raffleId,
  month,
  soldNumbers,
  onNumberSelect,
  maxNumber = 999,
  price
}: MonthlyTicketNumberSelectorProps) {
  const [searchValue, setSearchValue] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'special'>('grid');
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Özel numaralar kategorileri
  const specialNumbers = {
    'Şanslı Numaralar': [7, 77, 777],
    'Tekrarlı Numaralar': [11, 22, 33, 44, 55, 66, 77, 88, 99],
    'Sıralı Numaralar': [123, 234, 345, 456, 567, 678, 789]
  };

  // Numara müsait mi kontrolü
  const isNumberAvailable = (num: number) => {
    return !soldNumbers.includes(num);
  };

  // Numara seçim işleyicisi
  const handleNumberSelect = (num: number) => {
    if (isNumberAvailable(num)) {
      setSelectedNumber(num);
    }
  };

  // Seçimi onayla
  const handleConfirm = () => {
    if (selectedNumber) {
      onNumberSelect(selectedNumber);
      setIsOpen(false);
    }
  };

  // Grid görünümünü render et
  const renderNumberGrid = () => {
    const numbers = Array.from({ length: maxNumber }, (_, i) => i + 1);
    const filteredNumbers = numbers.filter(num => 
      num.toString().includes(searchValue)
    );

    return (
      <div className="grid grid-cols-8 gap-1 p-2">
        {filteredNumbers.map(num => (
          <Button
            key={num}
            variant={selectedNumber === num ? "default" : "outline"}
            className={`h-8 w-8 p-0 ${
              !isNumberAvailable(num) ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!isNumberAvailable(num)}
            onClick={() => handleNumberSelect(num)}
          >
            {num}
          </Button>
        ))}
      </div>
    );
  };

  // Özel numaraları render et
  const renderSpecialNumbers = () => {
    return (
      <div className="space-y-4 p-4">
        {Object.entries(specialNumbers).map(([category, numbers]) => (
          <div key={category} className="space-y-2">
            <h3 className="text-sm font-medium">{category}</h3>
            <div className="flex flex-wrap gap-2">
              {numbers.map(num => (
                <Badge
                  key={num}
                  variant={selectedNumber === num ? "default" : "secondary"}
                  className={`cursor-pointer ${
                    !isNumberAvailable(num) ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={() => isNumberAvailable(num) && handleNumberSelect(num)}
                >
                  {num}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">Numara Seç</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{month} Çekilişi</span>
            <Badge variant="secondary">${price}</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Arama ve Görünüm Değiştirme */}
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Numara ara..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setViewMode(mode => mode === 'grid' ? 'special' : 'grid')}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {/* Numaralar */}
          <ScrollArea className="h-[400px] rounded-md border">
            {viewMode === 'grid' ? renderNumberGrid() : renderSpecialNumbers()}
          </ScrollArea>

          {/* Bilgi */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Seçtiğiniz numara ay sonuna kadar sizin adınıza rezerve edilecektir.
            </AlertDescription>
          </Alert>

          {/* Seçim ve Onay */}
          <div className="space-y-4 pt-4 border-t">
            {selectedNumber && (
              <div className="text-center">
                <span className="text-muted-foreground">Seçilen Numara: </span>
                <span className="text-2xl font-bold ml-2">{selectedNumber}</span>
              </div>
            )}
            <Button 
              className="w-full" 
              onClick={handleConfirm}
              disabled={!selectedNumber}
            >
              Numarayı Onayla ve Satın Al
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}