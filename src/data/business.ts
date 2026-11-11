// Datos del negocio usados en las páginas legales y el footer.
// Edita aquí y se actualizan todas las páginas a la vez.
// Los campos marcados con CONFIRMAR son valores razonables que debes validar con tu operación real.

export interface BusinessInfo {
  brand: string;
  legalName: string;
  owner: string;
  taxId: string; // cédula o NIT del titular; se muestra solo si lo llenas
  email: string;
  phone: string;
  whatsappNumber: string; // formato internacional, sin signos
  address: string; // dirección física; se muestra solo si la llenas
  city: string;
  country: string;
  policyVersion: string; // se guarda con cada pedido como prueba de la autorización
  policyDate: string;
  shipping: {
    coverage: string;
    dispatchTime: string;
    deliveryTime: string;
    carriers: string;
    localDelivery: string; // opcional: texto sobre domicilios locales; se muestra solo si lo llenas
  };
  returns: {
    retractoDays: number;
    damageReportHours: number;
    refundMaxDays: number;
  };
}

export const BUSINESS: BusinessInfo = {
  brand: 'ESSENCE',
  legalName: 'Essence',
  owner: 'Yostin Tomas Jaime Nuñez',
  taxId: '', // CONFIRMAR: cédula o NIT (opcional)
  email: 'tomasjaime3003@gmail.com',
  phone: '319 649 8196',
  whatsappNumber: '573196498196',
  address: '', // opcional
  city: 'Soacha, Cundinamarca',
  country: 'Colombia',
  policyVersion: '2026-11-10',
  policyDate: '10 de noviembre de 2026',
  shipping: {
    coverage: 'todo el territorio colombiano',
    dispatchTime: '1 a 2 días hábiles después de confirmado el pedido', // CONFIRMAR
    deliveryTime:
      '2 a 5 días hábiles en ciudades principales y 5 a 8 días hábiles en el resto del país', // CONFIRMAR
    carriers: 'transportadoras aliadas', // CONFIRMAR: puedes poner nombres, por ejemplo Servientrega o Coordinadora
    localDelivery: '', // opcional, por ejemplo: domicilios en Soacha y Bogotá el mismo día
  },
  returns: {
    retractoDays: 5, // plazo legal del derecho de retracto en ventas a distancia (Ley 1480, art. 47)
    damageReportHours: 48, // CONFIRMAR: plazo para reportar daños de transporte
    refundMaxDays: 30, // plazo legal máximo para reembolsar
  },
};

export const LEGAL_ROUTES = {
  privacy: '/politica-de-datos',
  shipping: '/envios',
  returns: '/cambios-y-devoluciones',
  terms: '/terminos-y-condiciones',
} as const;

export const LEGAL_LINKS = [
  { to: LEGAL_ROUTES.shipping, label: 'Envíos y entregas' },
  { to: LEGAL_ROUTES.returns, label: 'Cambios y devoluciones' },
  { to: LEGAL_ROUTES.terms, label: 'Términos y condiciones' },
  { to: LEGAL_ROUTES.privacy, label: 'Política de datos personales' },
] as const;

// Aviso de transparencia: las fragancias son de inspiración, no productos originales de las marcas.
export const BRAND_DISCLAIMER =
  'ESSENCE vende fragancias de inspiración. No son productos originales de las marcas que se mencionan, ni ESSENCE está afiliada a ellas o tiene su patrocinio. Las marcas pertenecen a sus respectivos titulares y se nombran solo como referencia del aroma.';
