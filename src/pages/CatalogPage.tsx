import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { products, brands } from '@/data/products';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ProductCard';
import type { Category, Product } from '@/types';
import { getPremiumPrice } from '@/types';

const categories: { value: 'all' | Category; label: string }[] = [
  { value: 'all', label: 'Todo' },
  { value: 'hombre', label: 'Hombre' },
  { value: 'mujer', label: 'Mujer' },
  { value: 'unisex', label: 'Unisex' },
];

const priceRanges = [
  { label: 'Hasta $350.000', min: 0, max: 350000 },
  { label: '$350.000 – $500.000', min: 350000, max: 500000 },
  { label: '$500.000 – $700.000', min: 500000, max: 700000 },
  { label: 'Más de $700.000', min: 700000, max: Infinity },
];

type SortKey = 'relevance' | 'price-asc' | 'price-desc' | 'name';

export default function CatalogPage() {
  const { add } = useCart();
  const [params, setParams] = useSearchParams();

  const [search, setSearch] = useState(params.get('q') ?? '');
  const [category, setCategory] = useState<'all' | Category>(
    (params.get('cat') as Category) ?? 'all'
  );
  const [onlyOffers, setOnlyOffers] = useState(params.get('ofertas') === '1');
  const [onlyNovelties, setOnlyNovelties] = useState(params.get('novedades') === '1');
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    params.get('marca') ? [params.get('marca') as string] : []
  );
  const [priceRange, setPriceRange] = useState<number | null>(null);
  const [sort, setSort] = useState<SortKey>('relevance');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setSearch(params.get('q') ?? '');
    const cat = params.get('cat');
    setCategory(cat ? (cat as Category) : 'all');
    setOnlyOffers(params.get('ofertas') === '1');
    setOnlyNovelties(params.get('novedades') === '1');
    const marca = params.get('marca');
    setSelectedBrands(marca ? [marca] : []);
  }, [params]);

  const toggleBrand = (b: string) => {
    setSelectedBrands((prev) => (prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]));
  };

  const resetFilters = () => {
    setSearch('');
    setCategory('all');
    setOnlyOffers(false);
    setOnlyNovelties(false);
    setSelectedBrands([]);
    setPriceRange(null);
    setSort('relevance');
    setParams({});
  };

  const filtered = useMemo(() => {
    let list: Product[] = [...products];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }
    if (category !== 'all') list = list.filter((p) => p.category === category);
    if (onlyOffers) list = list.filter((p) => p.onSale);
    if (onlyNovelties) list = list.filter((p) => p.novelty);
    if (selectedBrands.length) list = list.filter((p) => selectedBrands.includes(p.brand));
    if (priceRange !== null) {
      const r = priceRanges[priceRange];
      list = list.filter((p) => getPremiumPrice(p) >= r.min && getPremiumPrice(p) <= r.max);
    }

    switch (sort) {
      case 'price-asc':
        list.sort((a, b) => getPremiumPrice(a) - getPremiumPrice(b));
        break;
      case 'price-desc':
        list.sort((a, b) => getPremiumPrice(b) - getPremiumPrice(a));
        break;
      case 'name':
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        list.sort((a, b) => Number(b.featured) - Number(a.featured));
    }
    return list;
  }, [search, category, onlyOffers, onlyNovelties, selectedBrands, priceRange, sort]);

  const title = onlyOffers
    ? 'Ofertas'
    : onlyNovelties
    ? 'Novedades'
    : category === 'all'
    ? 'Catálogo completo'
    : category === 'hombre'
    ? 'Perfumes para hombre'
    : category === 'mujer'
    ? 'Perfumes para mujer'
    : 'Fragancias unisex';

  return (
    <div className="container-luxe py-10 lg:py-14">
      <div className="mb-8">
        <p className="section-eyebrow">Catálogo ESSENCE</p>
        <h1 className="font-serif text-3xl font-medium text-ink-900 sm:text-4xl">{title}</h1>
        <p className="mt-2 text-sm text-ink-500">
          {filtered.length} {filtered.length === 1 ? 'fragancia' : 'fragancias'} encontradas
        </p>
      </div>

      {/* Search + sort row */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, marca o nota…"
            className="w-full rounded-full border border-ink-200 bg-white py-3 pl-11 pr-4 text-sm text-ink-900 placeholder:text-ink-400 focus:border-ink-900 focus:outline-none"
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowFilters((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full border border-ink-200 px-5 py-3 text-sm font-medium text-ink-700 lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" /> Filtros
          </button>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-full border border-ink-200 bg-white px-5 py-3 text-sm font-medium text-ink-700 focus:border-ink-900 focus:outline-none"
          >
            <option value="relevance">Relevancia</option>
            <option value="price-asc">Precio: menor a mayor</option>
            <option value="price-desc">Precio: mayor a menor</option>
            <option value="name">Nombre A–Z</option>
          </select>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
        {/* Sidebar */}
        <aside className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
          <div className="sticky top-24 space-y-8">
            <div>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink-500">Categoría</h3>
              <div className="flex flex-col gap-1">
                {categories.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setCategory(c.value)}
                    className={`rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                      category === c.value
                        ? 'bg-ink-900 text-ivory-50'
                        : 'text-ink-700 hover:bg-ink-100'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink-500">Marca</h3>
              <div className="flex flex-col gap-1.5">
                {brands.map((b) => (
                  <label key={b} className="flex cursor-pointer items-center gap-2.5 text-sm text-ink-700">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(b)}
                      onChange={() => toggleBrand(b)}
                      className="h-4 w-4 rounded border-ink-300 text-ink-900 focus:ring-ink-900"
                    />
                    {b}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink-500">Precio</h3>
              <div className="flex flex-col gap-1.5">
                {priceRanges.map((r, i) => (
                  <label key={r.label} className="flex cursor-pointer items-center gap-2.5 text-sm text-ink-700">
                    <input
                      type="radio"
                      name="price"
                      checked={priceRange === i}
                      onChange={() => setPriceRange(i)}
                      className="h-4 w-4 border-ink-300 text-ink-900 focus:ring-ink-900"
                    />
                    {r.label}
                  </label>
                ))}
                <button
                  onClick={() => setPriceRange(null)}
                  className="mt-1 px-3 text-left text-xs text-ink-500 hover:text-ink-900"
                >
                  Sin filtro de precio
                </button>
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink-500">Destacados</h3>
              <div className="flex flex-col gap-1.5 text-sm text-ink-700">
                <label className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={onlyOffers}
                    onChange={(e) => setOnlyOffers(e.target.checked)}
                    className="h-4 w-4 rounded border-ink-300 text-ink-900 focus:ring-ink-900"
                  />
                  Solo ofertas
                </label>
                <label className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={onlyNovelties}
                    onChange={(e) => setOnlyNovelties(e.target.checked)}
                    className="h-4 w-4 rounded border-ink-300 text-ink-900 focus:ring-ink-900"
                  />
                  Solo novedades
                </label>
              </div>
            </div>

            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-900"
            >
              <X className="h-4 w-4" /> Limpiar filtros
            </button>
          </div>
        </aside>

        {/* Grid */}
        <div>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink-200 py-20 text-center">
              <Search className="h-10 w-10 text-ink-300" />
              <p className="mt-4 font-serif text-xl text-ink-900">Sin resultados</p>
              <p className="mt-1 text-sm text-ink-500">Prueba con otros filtros o términos de búsqueda.</p>
              <button onClick={resetFilters} className="btn-outline mt-6">
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} onAdd={(prod) => add(prod, 'premium')} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
