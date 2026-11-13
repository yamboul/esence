import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Mail, MapPin, MessageCircle } from 'lucide-react';
import { BUSINESS, LEGAL_LINKS } from '@/data/business';

interface LegalLayoutProps {
  title: string;
  intro?: ReactNode;
  children: ReactNode;
}

export function LegalLayout({ title, intro, children }: LegalLayoutProps) {
  useEffect(() => {
    const previous = document.title;
    document.title = `${title} | ${BUSINESS.brand}`;
    return () => {
      document.title = previous;
    };
  }, [title]);

  return (
    <div className="container-luxe py-12 md:py-20">
      <div className="mx-auto max-w-3xl">
        <nav aria-label="Ruta de navegación" className="mb-8 text-xs text-ink-500">
          <Link to="/" className="hover:text-ink-900">
            Inicio
          </Link>
          <span className="mx-2">/</span>
          <span className="text-ink-600">{title}</span>
        </nav>

        <p className="section-eyebrow">Información legal</p>
        <h1 className="font-serif text-3xl font-medium leading-tight text-ink-900 text-balance sm:text-4xl">{title}</h1>
        <p className="mt-3 text-sm text-ink-500">Última actualización: {BUSINESS.policyDate}</p>

        {intro && <p className="mt-8 text-base leading-relaxed text-ink-700">{intro}</p>}

        <div className="mt-12 space-y-10">{children}</div>

        <nav aria-label="Más información legal" className="mt-16 rounded-2xl border border-ink-100 bg-ivory-100 p-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink-500">Más información</p>
          <ul className="flex flex-wrap gap-2">
            {LEGAL_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `inline-block rounded-full border px-4 py-2 text-sm transition-colors ${
                      isActive
                        ? 'border-ink-900 bg-ink-900 text-ivory-50'
                        : 'border-ink-200 bg-white text-ink-700 hover:border-ink-900'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="font-serif text-xl font-medium text-ink-900 sm:text-2xl">{title}</h2>
      <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-ink-700">{children}</div>
    </section>
  );
}

export function List({ items }: { items: ReactNode[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index} className="flex gap-3">
          <span aria-hidden className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-gold-400" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function Strong({ children }: { children: ReactNode }) {
  return <strong className="font-medium text-ink-900">{children}</strong>;
}

export function TextLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} className="font-medium text-ink-900 underline decoration-gold-400 underline-offset-4 hover:decoration-ink-900">
      {children}
    </Link>
  );
}

export function ContactBlock() {
  return (
    <ul className="grid gap-3 rounded-2xl border border-ink-100 bg-white p-5 text-sm sm:grid-cols-3">
      <li className="flex items-start gap-2.5">
        <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
        <a
          className="text-ink-900 hover:underline"
          href={`https://wa.me/${BUSINESS.whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {BUSINESS.phone}
          <span className="block text-xs text-ink-500">Celular y WhatsApp</span>
        </a>
      </li>
      <li className="flex min-w-0 items-start gap-2.5">
        <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
        <a className="min-w-0 break-all text-ink-900 hover:underline" href={`mailto:${BUSINESS.email}`}>
          {BUSINESS.email}
          <span className="block text-xs text-ink-500">Correo</span>
        </a>
      </li>
      <li className="flex items-start gap-2.5">
        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
        <span className="text-ink-900">
          {BUSINESS.city}
          <span className="block text-xs text-ink-500">{BUSINESS.country}</span>
        </span>
      </li>
    </ul>
  );
}
