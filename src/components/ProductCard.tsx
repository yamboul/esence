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
        <div className="product-media relative aspect-[3/4] overflow-hidden">
          <img
            src={product.image}
            alt={`${product.brand} ${product.name}`}
            loading="lazy"
            className="h-full w-full object-contain p-3 pt-9 transition-transform sm:p-6 sm:pt-12 duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute left-2 top-2 flex flex-col gap-1.5 sm:left-3 sm:top-3">
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
            {!product.inStock && (
              <span className="rounded-full bg-rust-500 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-ivory-50">
                Agotado
              </span>
            )}
            {product.demo && (
              <span className="rounded-full bg-ivory-50/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-ink-600 backdrop-blur">
                Demo
              </span>
            )}
          </div>
          {twoVersions && (
            <div className="absolute bottom-2 right-2 rounded-full bg-ivory-50/90 px-2 py-1 sm:bottom-3 sm:right-3 sm:px-2.5 text-[10px] font-semibold uppercase tracking-wider text-ink-700 backdrop-blur">
              2 versiones
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col px-3 pb-3 pt-3 sm:px-5 sm:pb-5 sm:pt-4">
        <p className="truncate text-[11px] font-medium uppercase tracking-wider text-gold-600 sm:text-xs">{product.brand}</p>
        <Link to={`/producto/${product.id}`}>
          <h3 className="mt-1 font-serif text-lg font-medium leading-snug sm:text-xl text-ink-900 transition-colors hover:text-ink-700">
            {product.name}
          </h3>
        </Link>
        <p className="mt-0.5 text-xs text-ink-500">
          {product.concentration}{product.sizeMl ? ` · ${product.sizeMl} ml` : ''}
        </p>

        <div className="mt-3 flex flex-col gap-0.5">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="price text-base">{formatCOP(premiumPrice)}</span>
            {twoVersions && (
              <span className="text-[10px] font-medium uppercase tracking-wider text-gold-600">Premium</span>
            )}
          </div>
          {twoVersions && classicPrice !== null && (
            <span className="text-xs text-ink-500">
              Classic desde {formatCOP(classicPrice)}
            </span>
          )}
        </div>

        {/* mt-auto: alinea los botones aunque una tarjeta tenga la línea "Classic desde". */}
        <div className="mt-auto flex gap-2 pt-3 sm:pt-4">
          <Link
            to={`/producto/${product.id}`}
            className="hidden flex-1 rounded-full border border-ink-300 py-2.5 text-center text-xs font-medium uppercase tracking-wider sm:block text-ink-900 transition-all hover:border-ink-900 hover:bg-ink-900 hover:text-ivory-50"
          >
            Ver perfume
          </Link>
          <button
            onClick={() => onAdd(product)}
            disabled={!product.inStock}
            aria-label={product.inStock ? `Agregar ${product.name} al carrito` : `${product.name} agotado`}
            title={product.inStock ? undefined : 'Agotado'}
            className="flex h-10 flex-1 items-center justify-center gap-2 rounded-full bg-ink-900 text-xs font-medium uppercase tracking-wider sm:w-10 sm:flex-none text-ivory-50 transition-all hover:bg-ink-800 active:scale-95 disabled:cursor-not-allowed disabled:bg-ink-300 disabled:active:scale-100"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="sm:hidden">{product.inStock ? 'Agregar' : 'Agotado'}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
