import { Link } from 'react-router-dom';
import type { Product } from '@/types';
import { formatCOP, getPremiumPrice, getClassicPrice, hasTwoVersions } from '@/types';
import { ShoppingBag } from 'lucide-react';

interface Props {
  product: Product;
  onAdd: (product: Product) => void;
}

export default function ProductCard({ product, onAdd }: Props) {
  const premiumPrice = getPremiumPrice(product);
  const classicPrice = getClassicPrice(product);
  const twoVersions = hasTwoVersions(product);

  return (
    <article className="card-product group">
      <Link to={`/producto/${product.id}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-ivory-100">
          <img
            src={product.image}
            alt={`${product.brand} ${product.name}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {product.onSale && (
              <span className="rounded-full bg-ink-900 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-ivory-50">
                Oferta
              </span>
            )}
            {product.novelty && (
              <span className="rounded-full bg-gold-400 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-ink-900">
                Nuevo
              </span>
            )}
            {product.demo && (
              <span className="rounded-full bg-ivory-50/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-ink-600 backdrop-blur">
                Demo
              </span>
            )}
          </div>
          {twoVersions && (
            <div className="absolute bottom-3 right-3 rounded-full bg-ivory-50/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-ink-700 backdrop-blur">
              2 versiones
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
        <p className="text-xs font-medium uppercase tracking-wider text-gold-600">{product.brand}</p>
        <Link to={`/producto/${product.id}`}>
          <h3 className="mt-1 font-serif text-xl font-medium text-ink-900 transition-colors hover:text-ink-700">
            {product.name}
          </h3>
        </Link>
        <p className="mt-0.5 text-xs text-ink-400">
          {product.concentration}{product.sizeMl ? ` · ${product.sizeMl} ml` : ''}
        </p>

        <div className="mt-3 flex flex-col gap-0.5">
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-lg font-semibold text-ink-900">{formatCOP(premiumPrice)}</span>
            {twoVersions && (
              <span className="text-[10px] font-medium uppercase tracking-wider text-gold-600">Premium</span>
            )}
          </div>
          {twoVersions && classicPrice !== null && (
            <span className="text-xs text-ink-400">
              Classic desde {formatCOP(classicPrice)}
            </span>
          )}
        </div>

        <div className="mt-4 flex gap-2">
          <Link
            to={`/producto/${product.id}`}
            className="flex-1 rounded-full border border-ink-300 py-2.5 text-center text-xs font-medium uppercase tracking-wider text-ink-900 transition-all hover:border-ink-900 hover:bg-ink-900 hover:text-ivory-50"
          >
            Ver perfume
          </Link>
          <button
            onClick={() => onAdd(product)}
            aria-label={`Agregar ${product.name} al carrito`}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-ink-900 text-ivory-50 transition-all hover:bg-ink-800 active:scale-95"
          >
            <ShoppingBag className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
