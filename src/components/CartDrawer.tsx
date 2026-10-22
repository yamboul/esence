import { Link } from 'react-router-dom';
import { ShoppingBag, Trash2, X, Plus, Minus } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatCOP, VERSION_LABELS, getVersionPrice } from '@/types';

export default function CartDrawer() {
  const { items, isOpen, setOpen, setQty, remove, subtotal, count } = useCart();

  return (
    <>
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-50 bg-ink-900/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-ivory-50 shadow-2xl transition-transform duration-500 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-ink-100 px-6 py-5">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-ink-700" />
            <h2 className="font-serif text-xl font-medium text-ink-900">
              Tu carrito {count > 0 && <span className="text-sm text-ink-400">({count})</span>}
            </h2>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Cerrar carrito"
            className="rounded-full p-2 text-ink-500 transition-colors hover:bg-ink-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-ink-100">
              <ShoppingBag className="h-8 w-8 text-ink-400" />
            </div>
            <p className="mt-6 font-serif text-xl text-ink-900">Tu carrito está vacío</p>
            <p className="mt-2 text-sm text-ink-500">Descubre fragancias que enamoran.</p>
            <button onClick={() => setOpen(false)} className="btn-primary mt-6">
              Explorar perfumes
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <ul className="space-y-4">
                {items.map((item) => {
                  const price = getVersionPrice(item.product, item.version);
                  return (
                    <li
                      key={`${item.product.id}__${item.version}`}
                      className="flex gap-4 border-b border-ink-100 pb-4 last:border-0"
                    >
                      <Link to={`/producto/${item.product.id}`} onClick={() => setOpen(false)} className="shrink-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="h-24 w-20 rounded-lg object-cover"
                        />
                      </Link>
                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between gap-2">
                          <div>
                            <p className="text-xs uppercase tracking-wider text-gold-600">
                              {item.product.brand}
                            </p>
                            <Link
                              to={`/producto/${item.product.id}`}
                              onClick={() => setOpen(false)}
                              className="font-serif text-base font-medium text-ink-900 hover:text-ink-700"
                            >
                              {item.product.name}
                            </Link>
                            <span className="mt-0.5 inline-block rounded-full bg-ink-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-ink-600">
                              {VERSION_LABELS[item.version]}
                            </span>
                            <p className="mt-0.5 text-xs text-ink-400">
                              {item.product.sizeMl ? `${item.product.sizeMl} ml` : 'Presentación por confirmar'}
                            </p>
                          </div>
                          <button
                            onClick={() => remove(item.product.id, item.version)}
                            aria-label="Eliminar"
                            className="text-ink-400 transition-colors hover:text-rust-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="mt-auto flex items-center justify-between pt-2">
                          <div className="flex items-center rounded-full border border-ink-200">
                            <button
                              onClick={() => setQty(item.product.id, item.version, item.quantity - 1)}
                              className="px-2.5 py-1.5 text-ink-600 hover:text-ink-900"
                              aria-label="Restar"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="min-w-8 text-center text-sm font-medium">{item.quantity}</span>
                            <button
                              onClick={() => setQty(item.product.id, item.version, item.quantity + 1)}
                              className="px-2.5 py-1.5 text-ink-600 hover:text-ink-900"
                              aria-label="Sumar"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <span className="font-serif text-base font-semibold text-ink-900">
                            {formatCOP(price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="border-t border-ink-100 px-6 py-5">
              <div className="flex items-center justify-between text-sm text-ink-600">
                <span>Subtotal</span>
                <span className="font-serif text-lg font-semibold text-ink-900">{formatCOP(subtotal)}</span>
              </div>
              <p className="mt-1 text-xs text-ink-400">
                Envío calculado en el proceso de compra.
              </p>
              <Link
                to="/checkout"
                onClick={() => setOpen(false)}
                className="btn-primary mt-4 w-full"
              >
                Finalizar compra
              </Link>
              <button
                onClick={() => setOpen(false)}
                className="btn-ghost mt-2 w-full"
              >
                Seguir comprando
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
