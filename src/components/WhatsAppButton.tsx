import { MessageCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { whatsappLink } from '@/lib/whatsapp';

export default function WhatsAppButton() {
  const { isOpen } = useCart();

  return (
    <a
      href={whatsappLink('Hola ESSENCE, tengo una duda sobre sus perfumes.')}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="¿Dudas? Escríbenos por WhatsApp"
      className={`group fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-[#25D366] p-3.5 text-white shadow-[0_10px_30px_-8px_rgba(0,0,0,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_-8px_rgba(0,0,0,0.4)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900 sm:bottom-7 sm:right-7 sm:px-5 ${
        isOpen ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <MessageCircle className="h-6 w-6 sm:h-5 sm:w-5" />
      <span className="hidden text-sm font-medium sm:inline">¿Dudas? Escríbenos</span>
    </a>
  );
}
