import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const navLinks = [
  { label: 'Inicio', to: '/' },
  { label: 'Hombre', to: '/catalogo?cat=hombre' },
  { label: 'Mujer', to: '/catalogo?cat=mujer' },
  { label: 'Unisex', to: '/catalogo?cat=unisex' },
  { label: 'Ofertas', to: '/catalogo?ofertas=1' },
];

export default function Header() {
  const { count, setOpen } = useCart();
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
            className="lg:hidden text-ink-900"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Abrir menú"
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

          <div className="flex items-center gap-1.5 sm:gap-3">
            <button
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Buscar"
              className="rounded-full p-2 text-ink-700 transition-colors hover:bg-ink-100"
            >
              <Search className="h-5 w-5" />
            </button>
            <button
              aria-label="Cuenta"
              className="hidden sm:block rounded-full p-2 text-ink-700 transition-colors hover:bg-ink-100"
            >
              <User className="h-5 w-5" />
            </button>
            <button
              onClick={() => setOpen(true)}
              aria-label="Carrito"
              className="relative rounded-full p-2 text-ink-700 transition-colors hover:bg-ink-100"
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
            <Link to="/catalogo" className="py-3.5 text-sm font-medium text-ink-500">
              Ver todo el catálogo
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
