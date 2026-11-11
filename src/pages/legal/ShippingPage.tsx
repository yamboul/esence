import { ContactBlock, LegalLayout, List, Section, Strong, TextLink } from './LegalLayout';
import { BUSINESS, LEGAL_ROUTES } from '@/data/business';

export default function ShippingPage() {
  const { shipping, returns } = BUSINESS;

  return (
    <LegalLayout
      title="Envíos y entregas"
      intro={`El envío es gratis a ${shipping.coverage}. Aquí te explicamos cómo funcionan los despachos, los tiempos y qué hacer cuando recibas tu pedido.`}
    >
      <Section title="1. Cobertura y costo">
        <p>
          Enviamos a {shipping.coverage}, a cualquier ciudad o municipio. <Strong>El envío es gratis</Strong>: el total
          que ves antes de confirmar tu pedido es el valor final, sin cobros adicionales.
        </p>
        <p>
          Si eliges pago contraentrega, pagas a la transportadora el mismo total al recibir el paquete. Algunas zonas
          rurales o de difícil acceso pueden no tener contraentrega disponible; en ese caso te contactamos antes de
          despachar para ofrecerte otro medio de pago.
        </p>
        {shipping.localDelivery && <p>{shipping.localDelivery}</p>}
      </Section>

      <Section title="2. Tiempos de despacho y entrega">
        <List
          items={[
            <>
              <Strong>Despacho:</Strong> {shipping.dispatchTime}. Con pago en línea, el pedido queda confirmado cuando
              Wompi aprueba el pago; con transferencia, cuando verificamos el pago; con contraentrega, cuando confirmamos
              tus datos.
            </>,
            <>
              <Strong>Entrega:</Strong> {shipping.deliveryTime}, contados desde el despacho.
            </>,
          ]}
        />
        <p>
          Los tiempos son estimados y pueden variar por temporadas de alta demanda, orden público, clima o novedades de
          la transportadora. Te avisaremos si tu pedido se demora más de lo previsto.
        </p>
      </Section>

      <Section title="3. Cómo enviamos">
        <p>
          Despachamos con {shipping.carriers}. Cuando tu pedido salga, te compartimos por WhatsApp o correo el número de
          guía para que puedas hacerle seguimiento. También puedes ver el estado de tu pedido en “Mi cuenta”.
        </p>
      </Section>

      <Section title="4. Datos de entrega">
        <p>
          Revisa que tu dirección, barrio, ciudad y número de celular estén correctos antes de confirmar, porque la
          transportadora te contactará a ese número. Si la dirección es incorrecta o no hay quien reciba, la
          transportadora puede intentar la entrega de nuevo, y los costos de reenvío por datos errados pueden quedar a
          cargo del comprador.
        </p>
      </Section>

      <Section title="5. Cuando recibas tu pedido">
        <List
          items={[
            'Revisa que el empaque y los sellos estén en buen estado antes de aceptar el paquete.',
            'Si notas daños evidentes, anótalo en la guía de entrega o rechaza el paquete y avísanos de inmediato.',
            `Si el producto llega dañado o es diferente al que pediste, escríbenos dentro de las ${returns.damageReportHours} horas siguientes a la entrega con tu referencia de pedido y fotos del producto y del empaque. Un video al abrir el paquete nos ayuda a resolverlo más rápido.`,
          ]}
        />
        <p>
          En esos casos, nosotros asumimos el costo de envío del cambio o de la devolución. Conoce más en nuestra{' '}
          <TextLink to={LEGAL_ROUTES.returns}>política de cambios y devoluciones</TextLink>.
        </p>
      </Section>

      <Section title="6. ¿Dudas sobre tu envío?">
        <p>Escríbenos y con gusto te ayudamos:</p>
        <ContactBlock />
      </Section>
    </LegalLayout>
  );
}
