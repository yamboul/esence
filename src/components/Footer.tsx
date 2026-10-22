import { Link } from 'react-router-dom';
import { Instagram, Facebook, Mail, MapPin, Phone, MessageCircle } from 'lucide-react';

const columns = [
  {
    title: 'Tienda',
    links: [
      { label: 'Perfumes para hombre', to: '/catalogo?cat=hombre' },
      { label: 'Perfumes para mujer', to: '/catalogo?cat=mujer' },
      { label: 'Fragancias unisex', to: '/catalogo?cat=unisex' },
      { label: 'Ofertas', to: '/catalogo?ofertas=1' },
      { label: 'Novedades', to: '/catalogo?novedades=1' },
    ],
  },
  {
    title: 'Atención al cliente',
    links: [
      { label: 'Preguntas frecuentes', to: '/' },
      { label: 'Política de envíos', to: '/' },
      { label: 'Devoluciones y garantías', to: '/' },
      { label: 'Términos y condiciones', to: '/' },
      { label: 'Política de privacidad', to: '/' },
    ],
  },
  {
    title: 'ESSENCE',
    links: [
      { label: 'Nuestra historia', to: '/' },
      { label: 'Compromiso de autenticidad', to: '/' },
      { label: 'Contacto', to: '/' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-24 bg-ink-900 text-ivory-100">
      <div className="container-luxe py-16">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <span className="font-serif text-3xl font-semibold tracking-[0.2em] text-ivory-50">
              ESSENCE
            </span>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ivory-100/70">
              Perfumería premium para hombre y mujer. Fragancias auténticas con envío a toda Colombia.
            </p>
            <div className="mt-6 flex gap-3">
              <a href="#" aria-label="Instagram" className="flex h-10 w-10 items-center justify-center rounded-full border border-ivory-100/20 transition-colors hover:bg-gold-400 hover:text-ink-900">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" aria-label="Facebook" className="flex h-10 w-10 items-center justify-center rounded-full border border-ivory-100/20 transition-colors hover:bg-gold-400 hover:text-ink-900">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" aria-label="WhatsApp" className="flex h-10 w-10 items-center justify-center rounded-full border border-ivory-100/20 transition-colors hover:bg-gold-400 hover:text-ink-900">
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gold-300">
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-sm text-ivory-100/70 transition-colors hover:text-ivory-50">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-4 border-t border-ivory-100/10 pt-8 sm:grid-cols-3">
          <div className="flex items-center gap-3 text-sm text-ivory-100/70">
            <Phone className="h-4 w-4 text-gold-300" />
            <span>+57 300 000 0000</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-ivory-100/70">
            <Mail className="h-4 w-4 text-gold-300" />
            <span>atencion@essence.co</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-ivory-100/70">
            <MapPin className="h-4 w-4 text-gold-300" />
            <span>Bogotá, Colombia</span>
          </div>
        </div>

        <div className="mt-8 border-t border-ivory-100/10 pt-6 text-center text-xs text-ivory-100/50">
          © {new Date().getFullYear()} ESSENCE. Todos los derechos reservados. Proyecto de demostración.
        </div>
      </div>
    </footer>
  );
}
