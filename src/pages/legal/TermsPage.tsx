import { ContactBlock, LegalLayout, List, Section, Strong, TextLink } from './LegalLayout';
import { BRAND_DISCLAIMER, BUSINESS, LEGAL_ROUTES } from '@/data/business';

export default function TermsPage() {
  return (
    <LegalLayout
      title="Términos y condiciones"
      intro={`Estos términos regulan el uso del sitio web de ${BUSINESS.brand} y las compras que realices en él. Al confirmar un pedido aceptas estas condiciones.`}
    >
      <Section title="1. Quiénes somos">
        <p>
          {BUSINESS.brand} es una tienda en línea de perfumería ubicada en {BUSINESS.city}, {BUSINESS.country}, a cargo
          de {BUSINESS.owner}.
        </p>
        {BUSINESS.taxId && <p>Documento o NIT: {BUSINESS.taxId}.</p>}
        <ContactBlock />
      </Section>

      <Section title="2. Qué vendemos">
        <p>
          <Strong>{BRAND_DISCLAIMER}</Strong>
        </p>
        <p>Cada fragancia se ofrece en una o dos versiones, que se describen en la página de cada producto:</p>
        <List
          items={[
            <>
              <Strong>Classic:</Strong> una versión más suave y sencilla, pensada para el uso diario.
            </>,
            <>
              <Strong>Premium:</Strong> una versión de mayor concentración, que busca reproducir de forma muy cercana el
              aroma de referencia y tiene mayor duración.
            </>,
          ]}
        />
        <p>
          La duración y la proyección del aroma dependen de la piel, el clima y la cantidad aplicada, así que los
          tiempos que mencionamos son aproximados.
        </p>
      </Section>

      <Section title="3. Uso del sitio">
        <p>
          Debes ser mayor de edad y tener capacidad legal para comprar. Te comprometes a darnos información veraz y a usar
          el sitio de forma lícita, sin intentar afectar su funcionamiento ni la seguridad de otros usuarios.
        </p>
      </Section>

      <Section title="4. Precios y disponibilidad">
        <List
          items={[
            'Los precios están en pesos colombianos (COP), incluyen los impuestos aplicables y se muestran antes de confirmar el pedido.',
            'El envío es gratis a todo Colombia. El total que ves antes de confirmar es el valor final.',
            'Las fotos son referenciales. Pueden existir pequeñas variaciones en el frasco, el empaque o la presentación.',
            'La disponibilidad depende del inventario. Si un producto se agota después de tu pedido, te contactamos para ofrecerte un cambio o el reembolso total.',
            'Si detectamos un error evidente en un precio, te contactamos antes de procesar el pedido para que decidas si lo mantienes con el valor correcto.',
          ]}
        />
      </Section>

      <Section title="5. Proceso de compra y pago">
        <p>
          Agregas productos al carrito, ingresas tus datos de contacto y entrega, aceptas la política de tratamiento de
          datos y estos términos, y eliges uno de estos medios de pago:
        </p>
        <List
          items={[
            <>
              <Strong>Pago en línea (tarjeta, PSE o Nequi):</Strong> se hace en la plataforma de Wompi. El pedido queda
              confirmado cuando el pago es aprobado; si es rechazado, el pedido no se procesa y puedes intentarlo de
              nuevo. Los datos de tu tarjeta o cuenta se ingresan directamente en Wompi y no pasan por nuestros
              servidores.
            </>,
            <>
              <Strong>Transferencia bancaria:</Strong> te enviamos los datos para pagar. El pedido se despacha cuando
              verificamos el pago.
            </>,
            <>
              <Strong>Contraentrega:</Strong> pagas el total al recibir el paquete. Podemos contactarte para confirmar
              tus datos antes de despachar.
            </>,
          ]}
        />
        <p>
          Al confirmar, recibes una referencia de pedido (empieza por ESS-) que te sirve para cualquier consulta. Podemos
          cancelar un pedido con datos falsos o incompletos, o con señales de fraude; si ya habías pagado, te devolvemos
          el dinero.
        </p>
      </Section>

      <Section title="6. Envíos, cambios y devoluciones">
        <p>
          Las condiciones de despacho y entrega están en <TextLink to={LEGAL_ROUTES.shipping}>envíos y entregas</TextLink>,
          y el derecho de retracto, los cambios, la garantía y la reversión del pago en{' '}
          <TextLink to={LEGAL_ROUTES.returns}>cambios y devoluciones</TextLink>. Ambas páginas hacen parte de estos
          términos.
        </p>
      </Section>

      <Section title="7. Tu cuenta">
        <p>
          Puedes comprar sin cuenta. Si inicias sesión con Google, podrás ver tus pedidos y elegir si quieres recibir
          ofertas. Eres responsable de la actividad que ocurra con tu cuenta; avísanos si sospechas un uso no autorizado.
        </p>
      </Section>

      <Section title="8. Datos personales">
        <p>
          Tratamos tus datos conforme a nuestra{' '}
          <TextLink to={LEGAL_ROUTES.privacy}>política de tratamiento de datos personales</TextLink>.
        </p>
      </Section>

      <Section title="9. Propiedad intelectual">
        <p>
          El diseño del sitio, el logo y los textos propios de {BUSINESS.brand} están protegidos y no pueden copiarse ni
          usarse sin nuestra autorización. Los nombres de perfumes y marcas de terceros pertenecen a sus respectivos
          titulares.
        </p>
      </Section>

      <Section title="10. Responsabilidad">
        <p>
          Hacemos lo posible para que el sitio funcione de forma continua y sin errores, pero no garantizamos que esté
          libre de interrupciones. Nada en estos términos limita los derechos que la ley te reconoce como consumidor.
        </p>
      </Section>

      <Section title="11. Peticiones, quejas y reclamos">
        <p>
          Si tienes una petición, queja o reclamo, escríbenos por los canales de contacto con tu referencia de pedido, si
          la tienes. Te respondemos en máximo 15 días hábiles. También puedes acudir a la Superintendencia de Industria y
          Comercio (SIC), la autoridad de protección al consumidor en Colombia.
        </p>
      </Section>

      <Section title="12. Ley aplicable y cambios">
        <p>
          Estos términos se rigen por las leyes de la República de Colombia. Podemos actualizarlos cuando sea necesario;
          la versión vigente es la publicada en esta página, con su fecha de actualización. Los cambios no afectan los
          pedidos ya confirmados.
        </p>
      </Section>
    </LegalLayout>
  );
}
