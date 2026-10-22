import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, ShoppingBag, Check, Truck, ShieldCheck, ChevronRight } from 'lucide-react';
import { products } from '@/data/products';
import { useCart } from '@/context/CartContext';
import {
  formatCOP,
  getPremiumPrice,
  getVersionPrice,
  hasTwoVersions,
  VERSION_LABELS,
  type VersionKey,
} from '@/types';
import ProductCard from '@/components/ProductCard';

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { add } = useCart();
  const product = products.find((p) => p.id === id);

  const [version, setVersion] = useState<VersionKey>('premium');
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="container-luxe py-20 text-center">
        <h1 className="font-serif text-3xl text-ink-900">Perfume no encontrado</h1>
        <p className="mt-2 text-ink-500">El producto que buscas no existe o fue removido.</p>
        <Link to="/catalogo" className="btn-primary mt-6">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  const twoVersions = hasTwoVersions(product);
  const currentPrice = getVersionPrice(product, version);

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAdd = () => {
    add(product, version, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="container-luxe py-8 lg:py-12">
      <nav className="mb-6 flex items-center gap-1.5 text-xs text-ink-500">
        <Link to="/" className="hover:text-ink-900">Inicio</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to={`/catalogo?cat=${product.category}`} className="capitalize hover:text-ink-900">
          {product.category}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-ink-900">{product.name}</span>
      </nav>

      <button
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-ink-600 hover:text-ink-900"
      >
        <ArrowLeft className="h-4 w-4" /> Volver
      </button>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <div className="relative overflow-hidden rounded-2xl bg-ivory-100">
            <img
              src={product.gallery[activeImage]}
              alt={`${product.brand} ${product.name}`}
              className="aspect-[4/5] w-full object-cover"
            />
            {product.demo && (
              <span className="absolute right-4 top-4 rounded-full bg-ivory-50/90 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-ink-600 backdrop-blur">
                Producto demo
              </span>
            )}
          </div>
          {product.gallery.length > 1 && (
            <div className="mt-4 flex gap-3">
              {product.gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`overflow-hidden rounded-lg border-2 transition-all ${
                    activeImage === i ? 'border-ink-900' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Vista ${i + 1}`} className="h-24 w-20 object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-gold-600">{product.brand}</p>
          <h1 className="mt-2 font-serif text-4xl font-medium text-ink-900 lg:text-5xl">{product.name}</h1>
          <p className="mt-2 text-sm text-ink-500">
            {product.concentration}{product.sizeMl ? ` · ${product.sizeMl} ml` : ''}
          </p>

          {product.family && (
            <p className="mt-1 text-sm text-ink-600">
              Familia olfativa: <span className="font-medium text-ink-800">{product.family}</span>
            </p>
          )}

          <div className="mt-6">
            <p className="label-luxe">Versión</p>
            {twoVersions ? (
              <div className="grid grid-cols-2 gap-3">
                {product.versions.map((v) => (
                  <button
                    key={v.key}
                    onClick={() => setVersion(v.key)}
                    className={`rounded-2xl border p-4 text-left transition-all ${
                      version === v.key
                        ? 'border-ink-900 bg-ink-50'
                        : 'border-ink-200 hover:border-ink-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-ink-900">{v.label}</span>
                      {version === v.key && <Check className="h-4 w-4 text-ink-900" />}
                    </div>
                    <p className="mt-1 font-serif text-lg font-semibold text-ink-900">
                      {formatCOP(v.price)}
                    </p>
                    <p className="text-[10px] uppercase tracking-wider text-ink-400">
                      {v.key === 'classic' ? 'Calidad AA' : 'Calidad AAA'}
                    </p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-ink-200 bg-ink-50 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-ink-900">{product.versions[0].label}</span>
                  <span className="font-serif text-lg font-semibold text-ink-900">
                    {formatCOP(product.versions[0].price)}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="font-serif text-3xl font-semibold text-ink-900">{formatCOP(currentPrice)}</span>
            {version === 'premium' && twoVersions && (
              <span className="text-xs font-medium uppercase tracking-wider text-gold-600">Versión Premium</span>
            )}
          </div>
          <p className="mt-1 text-xs text-ink-400">Precio en pesos colombianos (COP)</p>

          <p className="mt-6 leading-relaxed text-ink-700">{product.description}</p>

          {product.occasions && product.occasions.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {product.occasions.map((occ) => (
                <span
                  key={occ}
                  className="rounded-full border border-ink-200 px-3 py-1 text-xs text-ink-600"
                >
                  {occ}
                </span>
              ))}
            </div>
          )}

          {product.notes && (
            <div className="mt-8 space-y-4 rounded-2xl border border-ink-100 bg-ivory-100 p-6">
              <h3 className="font-serif text-lg font-medium text-ink-900">Notas olfativas</h3>
              <div className="grid gap-4 sm:grid-cols-3">
                {(['salida', 'corazon', 'fondo'] as const).map((key) => {
                  const labels: Record<string, string> = {
                    salida: 'Notas de salida',
                    corazon: 'Notas de corazón',
                    fondo: 'Notas de fondo',
                  };
                  return (
                    <div key={key}>
                      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-gold-600">
                        {labels[key]}
                      </p>
                      <p className="text-sm text-ink-700">{product.notes![key].join(', ')}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-full border border-ink-200">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="px-4 py-3 text-ink-600 hover:text-ink-900"
                aria-label="Restar"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="min-w-10 text-center font-medium">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="px-4 py-3 text-ink-600 hover:text-ink-900"
                aria-label="Sumar"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button onClick={handleAdd} className="btn-primary flex-1 sm:flex-none">
              {added ? (
                <>
                  <Check className="h-4 w-4" /> Agregado ({VERSION_LABELS[version]})
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4" /> Agregar {formatCOP(currentPrice)}
                </>
              )}
            </button>
          </div>

          <div className="mt-3 text-sm">
            {product.inStock ? (
              <span className="inline-flex items-center gap-1.5 text-sage-600">
                <Check className="h-4 w-4" /> Disponible
              </span>
            ) : (
              <span className="text-rust-500">Agotado</span>
            )}
            {product.demo && (
              <p className="mt-1 text-xs text-ink-400">
                Producto de demostración. Precios y existencias son ilustrativos.
              </p>
            )}
          </div>

            <div className="mt-8 grid grid-cols-2 gap-4 border-t border-ink-100 pt-6">
            <div className="flex items-center gap-2 text-sm text-ink-600">
              <ShieldCheck className="h-5 w-5 text-gold-600" /> Información transparente
            </div>
            <div className="flex items-center gap-2 text-sm text-ink-600">
              <Truck className="h-5 w-5 text-gold-600" /> Envío a toda Colombia
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="mb-8 font-serif text-2xl font-medium text-ink-900 sm:text-3xl">
            También te puede gustar
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} onAdd={(prod) => add(prod, 'premium')} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
