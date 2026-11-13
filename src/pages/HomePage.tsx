import { Link } from 'react-router-dom';
import { ArrowRight, Truck, ShieldCheck, CreditCard, Headphones, Sparkles, TrendingUp, Tag, Banknote, MessageCircle, Check } from 'lucide-react';
import { products, brandList } from '@/data/products';
import { WHATSAPP_DISPLAY } from '@/lib/whatsapp';
import { VERSION_INFO } from '@/types';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ProductCard';
import type { Product } from '@/types';

const heroImage = '/images/Gemini_Generated_Image_p93ljvp93ljvp93l.jpg';
const editorialImage = 'https://images.pexels.com/photos/10945075/pexels-photo-10945075.jpeg?auto=compress&cs=tinysrgb&h=900&w=1200';
const editorialImage2 = 'https://images.pexels.com/photos/37127787/pexels-photo-37127787.jpeg?auto=compress&cs=tinysrgb&h=900&w=1200';

export default function HomePage() {
  const { add } = useCart();
  // Cada producto aparece en una sola sección de la Home, en este orden de prioridad.
  const shown = new Set<string>();
  const pick = (list: Product[], n: number) => {
    const out = list.filter((p) => !shown.has(p.id)).slice(0, n);
    out.forEach((p) => shown.add(p.id));
    return out;
  };
  const featured = pick(products.filter((p) => p.featured), 4);
  const bestsellers = pick(products.filter((p) => p.bestseller), 4);
  const onSale = pick(products.filter((p) => p.onSale), 2);
  const novelties = pick(products.filter((p) => p.novelty), onSale.length > 0 ? 2 : 4);

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
              Los aromas de las grandes marcas para hombre y mujer, en versión Classic y Premium. Descubre fragancias que dejan huella.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/catalogo" className="btn-gold">
                Descubrir fragancias
                <ArrowRight className="h-4 w-4" />
              </Link>
              {onSale.length > 0 && (
                <Link
                  to="/catalogo?ofertas=1"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-ivory-50/30 px-7 py-3.5 text-sm font-medium tracking-wide text-ivory-50 transition-all hover:bg-ivory-50/10"
                >
                  Ver ofertas
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-b border-ink-100 bg-ivory-100">
        <div className="container-luxe grid grid-cols-2 gap-4 py-6 lg:grid-cols-4">
          {[
            { icon: Truck, title: 'Envío gratis', text: 'A todo Colombia' },
            { icon: Banknote, title: 'Pago contraentrega', text: 'Pagas al recibir' },
            { icon: CreditCard, title: 'Tarjeta, PSE o transferencia', text: 'Elige cómo pagar' },
            { icon: MessageCircle, title: '¿Dudas? WhatsApp', text: WHATSAPP_DISPLAY },
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
        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} onAdd={handleAdd} />
          ))}
        </div>
      </section>

      {/* Classic vs Premium */}
      <section id="versiones" className="scroll-mt-24 border-t border-ink-100 bg-ivory-100">
        <div className="container-luxe py-20">
          <div className="mb-10 max-w-2xl">
            <p className="section-eyebrow">
              <Sparkles className="h-3.5 w-3.5" /> Dos versiones
            </p>
            <h2 className="section-title">Classic o Premium: elige cómo llevarlo</h2>
            <p className="mt-4 leading-relaxed text-ink-600">
              Muchas de nuestras fragancias vienen en dos versiones. Mismo aroma de referencia, distinta intensidad.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-ink-200 bg-white p-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-ink-500">Classic</p>
              <h3 className="mt-2 font-serif text-2xl font-medium text-ink-900">{VERSION_INFO.classic.short}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">{VERSION_INFO.classic.long}</p>
              <ul className="mt-6 space-y-2.5 text-sm text-ink-700">
                {['Aroma suave y discreto', 'Para el día a día', 'Precio más accesible'].map((t) => (
                  <li key={t} className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 shrink-0 text-ink-400" /> {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative rounded-2xl bg-ink-900 p-8 text-ivory-50">
              <span className="absolute right-6 top-6 rounded-full bg-gold-400 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-ink-900">
                Recomendada
              </span>
              <p className="text-xs font-semibold uppercase tracking-widest text-gold-300">Premium</p>
              <h3 className="mt-2 font-serif text-2xl font-medium">{VERSION_INFO.premium.short}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ivory-100/75">{VERSION_INFO.premium.long}</p>
              <ul className="mt-6 space-y-2.5 text-sm text-ivory-100/90">
                {['Réplica exacta del original', 'Esencia más concentrada', 'Mayor duración y proyección'].map((t) => (
                  <li key={t} className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 shrink-0 text-gold-300" /> {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
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

      {/* Bestsellers: solo si hay productos marcados con bestseller */}
      {bestsellers.length > 0 && (
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
        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
          {bestsellers.map((p) => (
            <ProductCard key={p.id} product={p} onAdd={handleAdd} />
          ))}
        </div>
      </section>
      )}

      {/* Novelties + Offers: cada columna aparece solo si tiene productos */}
      {(novelties.length > 0 || onSale.length > 0) && (
      <section className="bg-ivory-100">
        <div className="container-luxe py-20">
          <div className="mb-10">
            <p className="section-eyebrow">
              <Tag className="h-3.5 w-3.5" />{' '}
              {novelties.length > 0 && onSale.length > 0
                ? 'Recién llegado y en oferta'
                : novelties.length > 0
                ? 'Recién llegado'
                : 'Precios especiales'}
            </p>
            <h2 className="section-title">
              {novelties.length > 0 && onSale.length > 0
                ? 'Novedades y ofertas'
                : novelties.length > 0
                ? 'Novedades'
                : 'Ofertas'}
            </h2>
          </div>
          {novelties.length > 0 && onSale.length > 0 ? (
            <div className="grid gap-12 lg:grid-cols-2">
              <div>
                <h3 className="mb-5 font-serif text-xl text-ink-900">Novedades</h3>
                <div className="grid grid-cols-2 gap-3 sm:gap-5">
                  {novelties.slice(0, 2).map((p) => (
                    <ProductCard key={p.id} product={p} onAdd={handleAdd} />
                  ))}
                </div>
              </div>
              <div>
                <h3 className="mb-5 font-serif text-xl text-ink-900">Ofertas</h3>
                <div className="grid grid-cols-2 gap-3 sm:gap-5">
                  {onSale.slice(0, 2).map((p) => (
                    <ProductCard key={p.id} product={p} onAdd={handleAdd} />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
              {(novelties.length > 0 ? novelties : onSale).map((p) => (
                <ProductCard key={p.id} product={p} onAdd={handleAdd} />
              ))}
            </div>
          )}
          <div className="mt-8 text-center">
            <Link to="/catalogo" className="btn-outline">
              Ver catálogo completo <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
      )}

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
                { icon: Truck, title: 'Envío gratis a todo el país', text: 'Sin costo a Bogotá, Medellín, Cali, Barranquilla y cualquier ciudad de Colombia.' },
                { icon: CreditCard, title: 'Pago flexible', text: 'Tarjeta, PSE, transferencia o pago contraentrega.' },
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
