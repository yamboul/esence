export type Category = 'hombre' | 'mujer' | 'unisex';

export type Concentration = 'Eau de Parfum' | 'Eau de Toilette' | 'Parfum' | 'Eau de Cologne';

export type VersionKey = 'classic' | 'premium';

export interface OlfactoryNotes {
  salida: string[];
  corazon: string[];
  fondo: string[];
}

export interface ProductVersion {
  key: VersionKey;
  label: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: Category;
  concentration: Concentration;
  sizeMl?: number;
  image: string;
  gallery: string[];
  description: string;
  family?: string;
  occasions?: string[];
  notes?: OlfactoryNotes;
  versions: ProductVersion[];
  featured: boolean;
  bestseller: boolean;
  novelty: boolean;
  onSale: boolean;
  inStock: boolean;
  demo: boolean;
}

export const VERSION_LABELS: Record<VersionKey, string> = {
  classic: 'Classic',
  premium: 'Premium',
};

export function getPremiumPrice(product: Product): number {
  const premium = product.versions.find((v) => v.key === 'premium');
  return premium ? premium.price : product.versions[0].price;
}

export function getClassicPrice(product: Product): number | null {
  const classic = product.versions.find((v) => v.key === 'classic');
  return classic ? classic.price : null;
}

export function hasTwoVersions(product: Product): boolean {
  return product.versions.length >= 2;
}

export function getVersionPrice(product: Product, version: VersionKey): number {
  const v = product.versions.find((ver) => ver.key === version);
  return v ? v.price : getPremiumPrice(product);
}

export interface CartItem {
  product: Product;
  version: VersionKey;
  quantity: number;
}

export interface CheckoutForm {
  fullName: string;
  phone: string;
  email: string;
  department: string;
  city: string;
  address: string;
  notes: string;
  paymentMethod: 'tarjeta' | 'pse' | 'transferencia' | 'contraentrega';
}

export const formatCOP = (value: number): string =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
