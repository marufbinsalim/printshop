'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import { CartDropdown } from '@/components/cart-dropdown';
import {
  Ticket,
  Home,
  Trophy,
  User,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { AuthDialog } from '@/components/auth/auth-dialog';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Scroll handler için effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success('Başarıyla çıkış yapıldı');
      router.push('/');
    } catch (error) {
      toast.error('Çıkış yapılırken hata oluştu');
    }
  };

  const NavItems = () => (
    <>
      <Link
        href="/"
        className={cn(
          "flex items-center space-x-2 text-sm font-medium transition-all hover:text-primary",
          pathname === "/" && "text-primary",
          "hover:scale-105"
        )}
      >
        <Home className="h-4 w-4" />
        <span>Ana Sayfa</span>
      </Link>
      <Link
        href="/raffles"
        className={cn(
          "flex items-center space-x-2 text-sm font-medium transition-all text-blue-600",
          pathname === "/raffles" ? "text-blue-600 scale-105" : "hover:text-primary",
          "hover:scale-105",
          "relative group animate-pulse"
        )}
      >
        <Ticket className="h-4 w-4" />
        <span>Çekilişler</span>
        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform" />
      </Link>
      <Link
        href="/winners"
        className={cn(
          "flex items-center space-x-2 text-sm font-medium transition-all hover:text-primary",
          pathname === "/winners" && "text-primary",
          "hover:scale-105"
        )}
      >
        <Trophy className="h-4 w-4" />
        <span>Kazananlar</span>
      </Link>
      <Link
        href="/affiliate"
        className={cn(
          "flex items-center space-x-2 text-sm font-medium transition-all hover:text-primary",
          pathname === "/affiliate" && "text-primary",
          "hover:scale-105"
        )}
      >
        <Trophy className="h-4 w-4" />
        <span>Affiliate</span>
      </Link>
      {user && (
        <Link
          href="/dashboard"
          className={cn(
            "flex items-center space-x-2 text-sm font-medium transition-all hover:text-primary",
            pathname === "/dashboard" && "text-primary",
            "hover:scale-105"
          )}
        >
          <LayoutDashboard className="h-4 w-4" />
          <span>Panel</span>
        </Link>
      )}
    </>
  );

  return (
    <nav className={cn(
      "sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      isScrolled && "shadow-sm"
    )}>
      <div className="flex h-16 items-center px-4 container mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <Ticket className="h-6 w-6" />
          <span className="text-xl font-bold">RaffleWin</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6 ml-6">
          <NavItems />
        </div>

        {/* Mobile Menu Button */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild className="md:hidden ml-2">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <div className="flex flex-col space-y-4 mt-6">
              <NavItems />
            </div>
          </SheetContent>
        </Sheet>

        {/* Right Side Items */}
        <div className="ml-auto flex items-center space-x-4">
          <CartDropdown />
          <ModeToggle />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">{user.displayName || 'Hesap'}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="flex items-center">
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Panel
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-red-600 focus:text-red-600 focus:bg-red-50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Çıkış Yap
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <AuthDialog>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Giriş Yap</span>
              </Button>
            </AuthDialog>
          )}
        </div>
      </div>
    </nav>
  );
}