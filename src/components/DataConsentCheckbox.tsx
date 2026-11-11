import { Link } from 'react-router-dom';
import { LEGAL_ROUTES } from '@/data/business';

interface DataConsentCheckboxProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  /** true cuando el cliente intenta continuar sin marcar la casilla. */
  showError?: boolean;
  id?: string;
}

// Autorización obligatoria (Ley 1581 de 2012) para tratar los datos del pedido.
export default function DataConsentCheckbox({
  checked,
  onChange,
  showError = false,
  id = 'data-consent',
}: DataConsentCheckboxProps) {
  const hasError = showError && !checked;
  const linkClass = 'font-medium text-ink-900 underline decoration-gold-400 underline-offset-2 hover:decoration-ink-900';

  return (
    <div
      className={`rounded-2xl border p-4 transition-colors ${
        hasError ? 'border-rust-400 bg-rust-400/5' : 'border-ink-100 bg-ivory-100'
      }`}
    >
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-sm leading-snug text-ink-700">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          aria-required="true"
          aria-invalid={hasError}
          aria-describedby={hasError ? `${id}-error` : undefined}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-ink-300 text-ink-900 focus:ring-ink-900"
        />
        <span>
          He leído y acepto la{' '}
          <Link to={LEGAL_ROUTES.privacy} target="_blank" rel="noopener noreferrer" className={linkClass}>
            política de tratamiento de datos personales
          </Link>{' '}
          y autorizo el uso de mis datos para procesar y entregar mi pedido. También acepto los{' '}
          <Link to={LEGAL_ROUTES.terms} target="_blank" rel="noopener noreferrer" className={linkClass}>
            términos y condiciones
          </Link>
          .
        </span>
      </label>
      {hasError && (
        <p id={`${id}-error`} role="alert" className="mt-2 pl-7 text-xs text-rust-500">
          Debes aceptar para poder continuar.
        </p>
      )}
    </div>
  );
}
