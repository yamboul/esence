import { Link } from 'react-router-dom';
import { ArrowRight, Truck, ShieldCheck, CreditCard, Headphones, Sparkles, TrendingUp, Tag } from 'lucide-react';
import { products, brandList } from '@/data/products';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ProductCard';
import type { Product } from '@/types';

const heroImage = '/images/Gemini_Generated_Image_p93ljvp93ljvp93l.jpg';
const editorialImage = 'https://images.pexels.com/photos/10945075/pexels-photo-10945075.jpeg?auto=compress&cs=tinysrgb&h=900&w=1200';
const editorialImage2 = 'https://images.pexels.com/photos/37127787/pexels-photo-37127787.jpeg?auto=compress&cs=tinysrgb&h=900&w=1200';

export default function HomePage() {
  const { add } = useCart();
  const featured = products.filter((p) => p.featured).slice(0, 4);
  const bestsellers = products.filter((p) => p.bestseller).slice(0, 4);
  const novelties = products.filter((p) => p.novelty).slice(0, 4);
  const onSale = products.filter((p) => p.onSale).slice(0, 3);

  const handleAdd = (p: Product) => add(p, 'premium');

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Perfumería de lujo" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-950/80 via-ink-900/50 to-transparent" />
        </div>
        <div className="container-luxe relative flex min-h-[80vh] items-center py-20 lg:min-h-[88vh]">
          <div className="max-w-xl animate-fade-up">
            <p className="mb-4 text-xs font-medium uppercase tracking-widest text-gold-300">
              Perfumería premium · Colombia
            </p>
            <h1 className="font-serif text-display font-medium text-ivory-50 text-balance">
              La esencia de la elegancia
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-ivory-100/80">
              Fragancias auténticas para hombre y mujer. Descubre aromas que cuentan historias y dejan huella.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/catalogo" className="btn-gold">
                Descubrir fragancias
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/catalogo?ofertas=1"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-ivory-50/30 px-7 py-3.5 text-sm font-medium tracking-wide text-ivory-50 transition-all hover:bg-ivory-50/10"
              >
                Ver ofertas
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-b border-ink-100 bg-ivory-100">
        <div className="container-luxe grid grid-cols-2 gap-4 py-6 lg:grid-cols-4">
          {[
            { icon: ShieldCheck, title: 'Información clara', text: 'Detalles del producto visibles' },
            { icon: Truck, title: 'Envío en Colombia', text: 'A todo el país' },
            { icon: CreditCard, title: 'Pago seguro', text: 'Múltiples métodos' },
            { icon: Headphones, title: 'Atención premium', text: 'Soporte dedicado' },
          ].map((f) => (
            <div key={f.title} className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink-900 text-gold-300">
                <f.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-ink-900">{f.title}</p>
                <p className="text-xs text-ink-500">{f.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Brands */}
      <section className="container-luxe py-16">
        <div className="mb-8 text-center">
          <p className="section-eyebrow justify-center">
            <Sparkles className="h-3.5 w-3.5" /> Nuestras marcas
          </p>
          <h2 className="section-title">Explora por marca</h2>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {brandList.map((brand) => (
            <Link
              key={brand.name}
              to={`/catalogo?marca=${encodeURIComponent(brand.name)}`}
              className="group flex items-center gap-2 rounded-full border border-ink-200 bg-white px-5 py-2.5 transition-all hover:border-ink-900 hover:bg-ink-900"
            >
              <span className="font-serif text-base font-medium text-ink-900 transition-colors group-hover:text-ivory-50">
                {brand.name}
              </span>
              <span className="rounded-full bg-ink-100 px-2 py-0.5 text-[10px] font-medium text-ink-500 transition-colors group-hover:bg-ivory-50/20 group-hover:text-ivory-100">
                {brand.count}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="container-luxe py-20">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="section-eyebrow">
              <Sparkles className="h-3.5 w-3.5" /> Selección curada
            </p>
            <h2 className="section-title">Fragancias destacadas</h2>
          </div>
          <Link to="/catalogo" className="hidden items-center gap-1.5 text-sm font-medium text-ink-700 hover:text-ink-900 sm:inline-flex">
            Ver todo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} onAdd={handleAdd} />
          ))}
        </div>
      </section>

      {/* Editorial split */}
      <section className="bg-ink-900 text-ivory-50">
        <div className="container-luxe grid items-center gap-12 py-20 lg:grid-cols-2">
          <div className="relative overflow-hidden rounded-2xl">
            <img src={editorialImage} alt="Fragancia premium" className="aspect-[4/5] w-full object-cover" />
          </div>
          <div className="animate-fade-up">
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-gold-300">
              El arte de la perfumería
            </p>
            <h2 className="font-serif text-3xl font-medium leading-tight sm:text-4xl">
              Cada fragancia, una obra de arte olfativa
            </h2>
            <p className="mt-5 max-w-md leading-relaxed text-ivory-100/70">
              En ESSENCE seleccionamos cada perfume como se selecciona una joya. Buscamos composiciones
              que emocionen, que acompañen y que perduren. Porque elegir una fragancia es elegir cómo
              quieres ser recordado.
            </p>
            <Link
              to="/catalogo"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold-400 px-7 py-3.5 text-sm font-medium text-ink-900 transition-colors hover:bg-gold-300"
            >
              Explorar la colección <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="container-luxe py-20">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="section-eyebrow">
              <TrendingUp className="h-3.5 w-3.5" /> Los favoritos
            </p>
            <h2 className="section-title">Más vendidos</h2>
          </div>
          <Link to="/catalogo" className="hidden items-center gap-1.5 text-sm font-medium text-ink-700 hover:text-ink-900 sm:inline-flex">
            Ver todo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {bestsellers.map((p) => (
            <ProductCard key={p.id} product={p} onAdd={handleAdd} />
          ))}
        </div>
      </section>

      {/* Novelties + Offers */}
      <section className="bg-ivory-100">
        <div className="container-luxe py-20">
          <div className="mb-10">
            <p className="section-eyebrow">
              <Tag className="h-3.5 w-3.5" /> Recién llegado y en oferta
            </p>
            <h2 className="section-title">Novedades y ofertas</h2>
          </div>
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h3 className="mb-5 font-serif text-xl text-ink-900">Novedades</h3>
              <div className="grid grid-cols-2 gap-5">
                {novelties.slice(0, 2).map((p) => (
                  <ProductCard key={p.id} product={p} onAdd={handleAdd} />
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-5 font-serif text-xl text-ink-900">Ofertas</h3>
              <div className="grid grid-cols-2 gap-5">
                {onSale.slice(0, 2).map((p) => (
                  <ProductCard key={p.id} product={p} onAdd={handleAdd} />
                ))}
              </div>
            </div>
          </div>
          <div className="mt-8 text-center">
            <Link to="/catalogo" className="btn-outline">
              Ver catálogo completo <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Editorial 2 */}
      <section className="container-luxe py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="order-2 lg:order-1 animate-fade-up">
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-gold-600">
              Confianza garantizada
            </p>
            <h2 className="font-serif text-3xl font-medium leading-tight sm:text-4xl">
              Hecho para Colombia, con estándares del mundo
            </h2>
            <ul className="mt-6 space-y-4">
              {[
                { icon: ShieldCheck, title: 'Información transparente', text: 'Describimos cada producto con los datos disponibles.' },
                { icon: Truck, title: 'Envíos a todo el país', text: 'Despachos a Bogotá, Medellín, Cali, Barranquilla y más.' },
                { icon: CreditCard, title: 'Pago flexible', text: 'Tarjeta, PSE, transferencia o contraentrega cuando esté disponible.' },
                { icon: Headphones, title: 'Atención cercana', text: 'Te acompañamos antes, durante y después de tu compra.' },
              ].map((f) => (
                <li key={f.title} className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink-900 text-gold-300">
                    <f.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-ink-900">{f.title}</p>
                    <p className="text-sm text-ink-500">{f.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="order-1 lg:order-2 relative overflow-hidden rounded-2xl">
            <img src={editorialImage2} alt="Fragancia de lujo" className="aspect-[4/5] w-full object-cover" />
          </div>
        </div>
      </section>
    </div>
  );
}
