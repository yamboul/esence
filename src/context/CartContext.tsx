import { createContext, useContext, useEffect, useMemo, useReducer, useState, type ReactNode } from 'react';
import type { CartItem, Product, VersionKey } from '@/types';
import { productById } from '@/data/products';

const STORAGE_KEY = 'essence-cart-v3';
const LEGACY_STORAGE_KEY = 'essence-cart-v2';

interface StoredItem {
  id: string;
  version: VersionKey;
  quantity: number;
}

// Reconstruye el carrito desde el catálogo actual. Descarta productos que ya no existen,
// versiones que ya no se ofrecen y productos agotados.
function loadStoredItems(): CartItem[] {
  try {
    let raw = localStorage.getItem(STORAGE_KEY);
    let legacy = false;
    if (!raw) {
      raw = localStorage.getItem(LEGACY_STORAGE_KEY);
      legacy = raw !== null;
    }
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    const items: CartItem[] = [];
    for (const entry of parsed) {
      // Formato v2 guardaba el producto completo: { product: { id }, version, quantity }.
      const id: unknown = legacy ? entry?.product?.id : entry?.id;
      const version: unknown = entry?.version;
      const quantity: unknown = entry?.quantity;
      if (typeof id !== 'string' || (version !== 'classic' && version !== 'premium')) continue;
      if (typeof quantity !== 'number' || !Number.isInteger(quantity) || quantity <= 0) continue;
      const product = productById(id);
      if (!product || !product.inStock) continue;
      if (!product.versions.some((v) => v.key === version)) continue;
      items.push({ product, version, quantity });
    }
    if (legacy) localStorage.removeItem(LEGACY_STORAGE_KEY);
    return items;
  } catch {
    return [];
  }
}

interface CartState {
  items: CartItem[];
}

type Action =
  | { type: 'ADD'; product: Product; version: VersionKey; quantity?: number }
  | { type: 'REMOVE'; productId: string; version: VersionKey }
  | { type: 'SET_QTY'; productId: string; version: VersionKey; quantity: number }
  | { type: 'CLEAR' }
  | { type: 'INIT'; items: CartItem[] };

function itemKey(productId: string, version: VersionKey): string {
  return `${productId}__${version}`;
}

function reducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case 'INIT':
      return { items: action.items };
    case 'ADD': {
      const qty = action.quantity ?? 1;
      const existing = state.items.find(
        (i) => itemKey(i.product.id, i.version) === itemKey(action.product.id, action.version)
      );
      if (existing) {
        return {
          items: state.items.map((i) =>
            itemKey(i.product.id, i.version) === itemKey(action.product.id, action.version)
              ? { ...i, quantity: i.quantity + qty }
              : i
          ),
        };
      }
      return {
        items: [...state.items, { product: action.product, version: action.version, quantity: qty }],
      };
    }
    case 'REMOVE':
      return {
        items: state.items.filter(
          (i) => itemKey(i.product.id, i.version) !== itemKey(action.productId, action.version)
        ),
      };
    case 'SET_QTY':
      if (action.quantity <= 0) {
        return {
          items: state.items.filter(
            (i) => itemKey(i.product.id, i.version) !== itemKey(action.productId, action.version)
          ),
        };
      }
      return {
        items: state.items.map((i) =>
          itemKey(i.product.id, i.version) === itemKey(action.productId, action.version)
            ? { ...i, quantity: action.quantity }
            : i
        ),
      };
    case 'CLEAR':
      return { items: [] };
    default:
      return state;
  }
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (product: Product, version: VersionKey, quantity?: number) => void;
  remove: (productId: string, version: VersionKey) => void;
  setQty: (productId: string, version: VersionKey, quantity: number) => void;
  clear: () => void;
  isOpen: boolean;
  setOpen: (v: boolean) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  // Carga síncrona: evita que el efecto de guardado sobrescriba el carrito con [] al montar.
  const [state, dispatch] = useReducer(reducer, undefined, () => ({ items: loadStoredItems() }));
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    // Solo se guardan referencias; precio y datos se leen siempre del catálogo actual.
    const stored: StoredItem[] = state.items.map((i) => ({
      id: i.product.id,
      version: i.version,
      quantity: i.quantity,
    }));
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    } catch {
      // ignore
    }
  }, [state.items]);

  const value = useMemo<CartContextValue>(() => {
    const count = state.items.reduce((s, i) => s + i.quantity, 0);
    const subtotal = state.items.reduce((s, i) => {
      const v = i.product.versions.find((ver) => ver.key === i.version);
      return s + (v ? v.price : 0) * i.quantity;
    }, 0);
    return {
      items: state.items,
      count,
      subtotal,
      add: (product, version, quantity) => {
        if (!product.inStock) return;
        dispatch({ type: 'ADD', product, version, quantity });
        setOpen(true);
      },
      remove: (productId, version) => dispatch({ type: 'REMOVE', productId, version }),
      setQty: (productId, version, quantity) =>
        dispatch({ type: 'SET_QTY', productId, version, quantity }),
      clear: () => dispatch({ type: 'CLEAR' }),
      isOpen,
      setOpen,
    };
  }, [state.items, isOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
