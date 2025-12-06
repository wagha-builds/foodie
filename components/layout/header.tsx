"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  MapPin,
  ChevronDown,
  Search,
  ShoppingCart,
  User,
  Menu,
  Sun,
  Moon,
  LogOut,
  Package,
  Heart,
  HelpCircle,
  Store,
  Truck,
} from "lucide-react";
import { useAuth, useLocation, useCart, useTheme } from "@/lib/store";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { AuthDialog } from "@/components/auth/auth-dialog";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();
  const { location: userLocation, requestLocation, isLoading: locationLoading } = useLocation();
  const { itemCount } = useCart();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isHomePage = pathname === "/";

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
          isHomePage && "border-transparent"
        )}
        data-testid="header"
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo & Location */}
            <div className="flex items-center gap-4 flex-wrap">
              <Link href="/">
                <span
                  className="text-xl font-bold text-primary cursor-pointer"
                  data-testid="link-logo"
                >
                  Foodie
                </span>
              </Link>

              <button
                onClick={requestLocation}
                disabled={locationLoading}
                className="flex items-center gap-1 text-sm hover-elevate active-elevate-2 px-2 py-1 rounded-md"
                data-testid="button-location"
              >
                <MapPin className="h-4 w-4 text-primary" />
                <div className="text-left hidden sm:block">
                  <span className="font-medium">{userLocation.area}</span>
                  <ChevronDown className="h-3 w-3 inline ml-1 text-muted-foreground" />
                </div>
              </button>
            </div>

            {/* Search - Desktop */}
            <div className="hidden md:flex flex-1 max-w-xl">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search for restaurants, cuisines or dishes"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 bg-muted/50"
                  data-testid="input-search"
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                data-testid="button-theme-toggle"
              >
                {theme === "light" ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </Button>

              {/* Cart Button */}
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => setIsCartOpen(true)}
                data-testid="button-cart"
              >
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    data-testid="badge-cart-count"
                  >
                    {itemCount}
                  </Badge>
                )}
              </Button>

              {/* User Menu - Desktop */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="hidden sm:flex items-center gap-2"
                      data-testid="button-user-menu"
                    >
                      <User className="h-5 w-5" />
                      <span className="max-w-24 truncate">{user?.name}</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link href="/orders" className="flex items-center gap-2 cursor-pointer w-full">
                        <Package className="h-4 w-4" />
                        My Orders
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center gap-2 cursor-pointer w-full">
                        <User className="h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/favorites" className="flex items-center gap-2 cursor-pointer w-full">
                        <Heart className="h-4 w-4" />
                        Favorites
                      </Link>
                    </DropdownMenuItem>
                    {user?.role === "restaurant" && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/restaurant/dashboard" className="flex items-center gap-2 cursor-pointer w-full">
                            <Store className="h-4 w-4" />
                            Restaurant Dashboard
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    {user?.role === "delivery_partner" && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/delivery/dashboard" className="flex items-center gap-2 cursor-pointer w-full">
                            <Truck className="h-4 w-4" />
                            Delivery Dashboard
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/help" className="flex items-center gap-2 cursor-pointer w-full">
                        <HelpCircle className="h-4 w-4" />
                        Help
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      data-testid="button-logout"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  onClick={() => setIsAuthOpen(true)}
                  className="hidden sm:flex"
                  data-testid="button-login"
                >
                  Login
                </Button>
              )}

              {/* Mobile Menu */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="sm:hidden"
                    data-testid="button-mobile-menu"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <div className="flex flex-col gap-4 mt-8">
                    {/* Mobile Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search restaurants"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                        data-testid="input-mobile-search"
                      />
                    </div>

                    {isAuthenticated ? (
                      <>
                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{user?.name}</p>
                            <p className="text-sm text-muted-foreground">{user?.email}</p>
                          </div>
                        </div>

                        <nav className="flex flex-col gap-1">
                          <Link
                            href="/orders"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-3 p-3 rounded-lg hover-elevate"
                          >
                            <Package className="h-5 w-5" />
                            My Orders
                          </Link>
                          <Link
                            href="/profile"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-3 p-3 rounded-lg hover-elevate"
                          >
                            <User className="h-5 w-5" />
                            Profile
                          </Link>
                          <Link
                            href="/favorites"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-3 p-3 rounded-lg hover-elevate"
                          >
                            <Heart className="h-5 w-5" />
                            Favorites
                          </Link>
                          <Link
                            href="/help"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-3 p-3 rounded-lg hover-elevate"
                          >
                            <HelpCircle className="h-5 w-5" />
                            Help
                          </Link>
                        </nav>

                        <Button
                          variant="destructive"
                          className="mt-4"
                          data-testid="button-mobile-logout"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setIsAuthOpen(true);
                        }}
                        className="w-full"
                        data-testid="button-mobile-login"
                      >
                        Login / Sign Up
                      </Button>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Cart Drawer */}
      <CartDrawer open={isCartOpen} onOpenChange={setIsCartOpen} />

      {/* Auth Dialog */}
      <AuthDialog open={isAuthOpen} onOpenChange={setIsAuthOpen} />
    </>
  );
}