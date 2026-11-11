import { lazy, Suspense, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { AuthProvider } from '@/context/AuthContext';
import AccountPage from '@/pages/AccountPage';
import PaymentResultPage from '@/pages/PaymentResultPage';

// El panel solo lo usan administradores: se carga aparte para no pesar en la tienda.
const AdminPage = lazy(() => import('@/pages/AdminPage'));
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { CartProvider } from '@/context/CartContext';
import HomePage from '@/pages/HomePage';
import CatalogPage from '@/pages/CatalogPage';
import ProductPage from '@/pages/ProductPage';
import CheckoutPage from '@/pages/CheckoutPage';
import PrivacyPolicyPage from '@/pages/legal/PrivacyPolicyPage';
import ShippingPage from '@/pages/legal/ShippingPage';
import ReturnsPage from '@/pages/legal/ReturnsPage';
import TermsPage from '@/pages/legal/TermsPage';
import { LEGAL_ROUTES } from '@/data/business';

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    // Enlaces con ancla (p. ej. /#versiones) bajan a la sección; el resto vuelve arriba.
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo({ top: 0 });
  }, [pathname, hash]);
  return null;
}

function App() {
  return (
    <AuthProvider>
    <CartProvider>
      <ScrollToTop />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/catalogo" element={<CatalogPage />} />
            <Route path="/producto/:id" element={<ProductPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/pedido/resultado" element={<PaymentResultPage />} />
            <Route path="/cuenta" element={<AccountPage />} />
            <Route
              path="/admin"
              element={
                <Suspense
                  fallback={
                    <div className="flex justify-center py-24">
                      <Loader2 className="h-6 w-6 animate-spin text-ink-400" />
                    </div>
                  }
                >
                  <AdminPage />
                </Suspense>
              }
            />
            <Route path={LEGAL_ROUTES.privacy} element={<PrivacyPolicyPage />} />
            <Route path={LEGAL_ROUTES.shipping} element={<ShippingPage />} />
            <Route path={LEGAL_ROUTES.returns} element={<ReturnsPage />} />
            <Route path={LEGAL_ROUTES.terms} element={<TermsPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </main>
        <Footer />
        <CartDrawer />
        <WhatsAppButton />
      </div>
    </CartProvider>
    </AuthProvider>
  );
}

export default App;
