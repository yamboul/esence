import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Menu, Search, ShieldCheck, ShoppingBag, User, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { hasCategory, hasOffers } from '@/data/products';

// Solo se muestran enlaces que llevan a resultados.
const navLinks = [
  { label: 'Inicio', to: '/', show: true },
  { label: 'Hombre', to: '/catalogo?cat=hombre', show: hasCategory('hombre') },
  { label: 'Mujer', to: '/catalogo?cat=mujer', show: hasCategory('mujer') },
  { label: 'Unisex', to: '/catalogo?cat=unisex', show: hasCategory('unisex') },
  { label: 'Ofertas', to: '/catalogo?ofertas=1', show: hasOffers },
].filter((l) => l.show);

export default function Header() {
  const { count, setOpen } = useCart();
  const { session, isAdmin } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [location]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/catalogo?q=${encodeURIComponent(query.trim())}`);
      setQuery('');
      setSearchOpen(false);
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-ivory-50/90 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.06)]' : 'bg-ivory-50'
      }`}
    >
      <div className="container-luxe">
        <div className="flex h-16 items-center justify-between lg:h-20">
          <button
            className="-ml-2.5 p-2.5 text-ink-900 lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          <Link to="/" className="flex items-center">
            <span className="font-serif text-2xl font-semibold tracking-[0.2em] text-ink-900 lg:text-3xl">
              ESSENCE
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="link-underline text-sm font-medium tracking-wide text-ink-700 hover:text-ink-900"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="-mr-2.5 flex items-center gap-0.5 sm:gap-2">
            <button
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Buscar"
              className="rounded-full p-2.5 text-ink-700 transition-colors hover:bg-ink-100"
            >
              <Search className="h-5 w-5" />
            </button>
            <UserMenu />
            <button
              onClick={() => setOpen(true)}
              aria-label="Carrito"
              className="relative rounded-full p-2.5 text-ink-700 transition-colors hover:bg-ink-100"
            >
              <ShoppingBag className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold-400 px-1 text-[10px] font-bold text-ink-900">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-ink-100 bg-ivory-50 animate-fade-in">
          <div className="container-luxe py-4">
            <form onSubmit={submitSearch} className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar perfumes, marcas, fragancias…"
                className="w-full rounded-full border border-ink-200 bg-white py-3 pl-11 pr-4 text-sm text-ink-900 placeholder:text-ink-400 focus:border-ink-900 focus:outline-none"
              />
            </form>
          </div>
        </div>
      )}

      {mobileOpen && (
        <div className="lg:hidden border-t border-ink-100 bg-ivory-50 animate-fade-in">
          <nav className="container-luxe flex flex-col py-4">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="border-b border-ink-100 py-3.5 text-sm font-medium tracking-wide text-ink-700 last:border-0"
              >
                {l.label}
              </Link>
            ))}
            <Link to="/catalogo" className="border-b border-ink-100 py-3.5 text-sm font-medium text-ink-500">
              Ver todo el catálogo
            </Link>
            <Link to="/cuenta" className="py-3.5 text-sm font-medium text-ink-700">
              {session ? 'Mi cuenta' : 'Iniciar sesión'}
            </Link>
            {isAdmin && (
              <Link to="/admin" className="py-3.5 text-sm font-medium text-gold-700">
                Panel de administrador
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

// Icono de usuario: sin sesión lleva a /cuenta; con sesión abre un menú (y el panel si es admin).
function UserMenu() {
  const { session, profile, isAdmin, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => setOpen(false), [location]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const iconClass = 'relative hidden sm:block rounded-full p-2.5 text-ink-700 transition-colors hover:bg-ink-100';

  if (!session) {
    return (
      <Link to="/cuenta" aria-label="Iniciar sesión" className={iconClass}>
        <User className="h-5 w-5" />
      </Link>
    );
  }

  const name = profile?.full_name || session.user.email;

  return (
    <div ref={ref} className="relative hidden sm:block">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Mi cuenta"
        aria-expanded={open}
        aria-haspopup="menu"
        className="relative block rounded-full p-2.5 text-ink-700 transition-colors hover:bg-ink-100"
      >
        <User className="h-5 w-5" />
        <span className={`absolute right-1 top-1 h-2 w-2 rounded-full ${isAdmin ? 'bg-gold-400' : 'bg-sage-500'}`} />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 w-64 animate-scale-in overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-[0_20px_50px_-20px_rgba(0,0,0,0.25)]"
        >
          <div className="border-b border-ink-100 px-4 py-3">
            <p className="truncate text-sm font-medium text-ink-900">{name}</p>
            <p className="truncate text-xs text-ink-500">{isAdmin ? 'Administrador' : session.user.email}</p>
          </div>
          <Link to="/cuenta" role="menuitem" className="flex items-center gap-2.5 px-4 py-3 text-sm text-ink-700 hover:bg-ink-50">
            <User className="h-4 w-4" /> Mi cuenta y pedidos
          </Link>
          {isAdmin && (
            <Link to="/admin" role="menuitem" className="flex items-center gap-2.5 px-4 py-3 text-sm font-medium text-ink-900 hover:bg-ink-50">
              <ShieldCheck className="h-4 w-4 text-gold-600" /> Panel de administrador
            </Link>
          )}
          <button
            role="menuitem"
            onClick={async () => {
              await signOut();
              navigate('/');
            }}
            className="flex w-full items-center gap-2.5 border-t border-ink-100 px-4 py-3 text-left text-sm text-ink-500 hover:bg-ink-50 hover:text-ink-900"
          >
            <LogOut className="h-4 w-4" /> Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
