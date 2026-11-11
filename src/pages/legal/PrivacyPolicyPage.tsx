import { ContactBlock, LegalLayout, List, Section, Strong } from './LegalLayout';
import { BUSINESS } from '@/data/business';

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout
      title="Política de tratamiento de datos personales"
      intro={
        <>
          En {BUSINESS.brand} cuidamos tu información. Esta política explica qué datos personales recolectamos, para qué
          los usamos, con quién los compartimos y cómo puedes ejercer tus derechos, de acuerdo con la Ley 1581 de 2012,
          el Decreto 1377 de 2013 y demás normas colombianas sobre protección de datos personales.
        </>
      }
    >
      <Section title="1. Responsable del tratamiento">
        <ul className="space-y-1">
          <li>
            <span className="text-ink-500">Nombre comercial: </span>
            {BUSINESS.legalName} ({BUSINESS.brand})
          </li>
          <li>
            <span className="text-ink-500">Titular del negocio: </span>
            {BUSINESS.owner}
          </li>
          {BUSINESS.taxId && (
            <li>
              <span className="text-ink-500">Documento o NIT: </span>
              {BUSINESS.taxId}
            </li>
          )}
          {BUSINESS.address && (
            <li>
              <span className="text-ink-500">Dirección: </span>
              {BUSINESS.address}
            </li>
          )}
        </ul>
        <ContactBlock />
      </Section>

      <Section title="2. Qué datos recolectamos">
        <p>Recolectamos únicamente los datos necesarios para atender tu compra:</p>
        <List
          items={[
            <>
              <Strong>Identificación y contacto:</Strong> nombre, número de celular y correo electrónico.
            </>,
            <>
              <Strong>Entrega:</Strong> dirección, ciudad, departamento y las indicaciones que nos dejes.
            </>,
            <>
              <Strong>Pedido:</Strong> productos, valores, fecha, medio de pago elegido, estado del pedido y referencia y
              estado del pago.
            </>,
            <>
              <Strong>Cuenta, si decides crearla:</Strong> si inicias sesión con Google, Google nos entrega tu nombre y tu
              correo electrónico. No recibimos tu contraseña de Google ni accedemos a tus contactos, archivos ni otros
              datos de esa cuenta.
            </>,
            <>
              <Strong>Datos técnicos mínimos:</Strong> el carrito y la sesión se guardan en tu propio navegador para que
              el sitio funcione.
            </>,
          ]}
        />
        <p>
          No almacenamos números de tarjetas ni claves bancarias. Los pagos en línea se realizan directamente en la
          pasarela de pagos Wompi y esa información no pasa por nuestros servidores.
        </p>
        <p>
          No solicitamos datos sensibles (como salud, origen racial, orientación sexual o datos biométricos). Nuestras
          ventas están dirigidas a personas mayores de edad y no recolectamos de forma intencional datos de menores.
        </p>
      </Section>

      <Section title="3. Para qué usamos tus datos">
        <List
          items={[
            'Procesar, confirmar, preparar y entregar tus pedidos.',
            'Verificar el estado de tu pago y emitir reembolsos cuando corresponda.',
            'Contactarte por WhatsApp, llamada, mensaje de texto o correo para informarte sobre tu pedido, el envío o cualquier novedad.',
            'Atender consultas, peticiones, quejas, reclamos, garantías y solicitudes de retracto.',
            'Administrar tu cuenta y mostrarte tu historial de pedidos, si la creaste.',
            'Cumplir obligaciones legales, contables y tributarias, y prevenir fraudes.',
          ]}
        />
      </Section>

      <Section title="4. Ofertas y novedades (opcional)">
        <p>
          Solo te enviamos promociones o novedades si marcas la casilla “Quiero recibir ofertas” en el pago o en tu
          cuenta. Es una autorización aparte de la que necesitamos para tu pedido y no es obligatoria para comprar.
        </p>
        <p>
          Puedes retirarla cuando quieras desde “Mi cuenta”, con el enlace para darte de baja que incluye cada correo o
          escribiéndonos por los canales de contacto.
        </p>
      </Section>

      <Section title="5. Tu autorización">
        <p>
          Al marcar la casilla de aceptación antes de confirmar tu pedido, nos das tu autorización previa, expresa e
          informada para tratar tus datos personales conforme a esta política. Guardamos la fecha y la versión de la
          política que aceptaste como constancia de esa autorización. Si no estás de acuerdo, no podremos procesar el
          pedido, porque necesitamos estos datos para cobrar, preparar y entregar tu compra.
        </p>
      </Section>

      <Section title="6. Con quién compartimos tus datos">
        <p>
          No vendemos tus datos. Solo los compartimos con terceros que nos ayudan a operar la tienda, y únicamente en la
          medida necesaria:
        </p>
        <List
          items={[
            'Wompi, la pasarela de pagos, para procesar los pagos en línea.',
            'Transportadoras y servicios de mensajería, para entregar tu pedido.',
            'Supabase, el proveedor de base de datos y autenticación donde se guardan los pedidos y las cuentas.',
            'Google, cuando eliges iniciar sesión con tu cuenta de Google.',
            'Telegram, la herramienta interna con la que recibimos el aviso de cada pedido nuevo.',
            'El proveedor de alojamiento del sitio web.',
            'Autoridades competentes, cuando la ley o una orden judicial lo exija.',
          ]}
        />
        <p>
          Varios de estos proveedores tienen sus servidores fuera de Colombia, por ejemplo en Estados Unidos o Canadá.
          Con tu autorización, aceptas que tus datos sean transmitidos o transferidos a esos proveedores, que deben
          ofrecer niveles adecuados de seguridad y protección de la información.
        </p>
      </Section>

      <Section title="7. Tus derechos como titular">
        <List
          items={[
            'Conocer, actualizar y rectificar tus datos personales.',
            'Solicitar prueba de la autorización que nos diste.',
            'Ser informado sobre el uso que le hemos dado a tus datos.',
            'Revocar la autorización y solicitar la supresión de tus datos, siempre que no exista un deber legal o contractual que nos obligue a conservarlos.',
            'Acceder de forma gratuita a tus datos personales.',
            'Presentar quejas ante la Superintendencia de Industria y Comercio (SIC) por infracciones a la ley, una vez hayas agotado el trámite de consulta o reclamo ante nosotros.',
          ]}
        />
      </Section>

      <Section title="8. Cómo ejercer tus derechos">
        <p>
          Escríbenos o llámanos por los canales indicados abajo. Para atender tu solicitud necesitamos tu nombre, un dato
          que nos permita identificarte (por ejemplo, el correo o la referencia de un pedido), la descripción clara de lo
          que pides y un medio para responderte.
        </p>
        <ContactBlock />
        <List
          items={[
            'Consultas: las respondemos en máximo 10 días hábiles. Si necesitamos más tiempo, te avisaremos antes de que se cumpla el plazo y podremos tomar hasta 5 días hábiles adicionales.',
            'Reclamos (corrección, actualización o supresión): los atendemos en máximo 15 días hábiles. Si necesitamos más tiempo, te avisaremos y podremos tomar hasta 8 días hábiles adicionales.',
            'Si tu reclamo está incompleto, te pediremos que lo completes dentro de los 5 días siguientes a recibirlo.',
          ]}
        />
      </Section>

      <Section title="9. Seguridad y conservación">
        <p>
          Aplicamos medidas técnicas y organizativas razonables para proteger tus datos contra pérdida, acceso no
          autorizado o uso indebido. Solo las personas autorizadas por {BUSINESS.brand} pueden ver los pedidos.
        </p>
        <p>
          Conservamos tus datos durante el tiempo necesario para cumplir las finalidades de esta política y los plazos que
          exijan las normas comerciales, contables y tributarias. Después de ese tiempo los eliminamos o los anonimizamos.
        </p>
      </Section>

      <Section title="10. Cambios a esta política">
        <p>
          Podemos actualizar esta política cuando sea necesario. La versión vigente siempre estará publicada en esta
          página con su fecha de actualización. Si el cambio afecta de forma importante el uso de tus datos, te lo
          informaremos por un medio visible antes de aplicarlo.
        </p>
        <p className="text-sm text-ink-400">Versión vigente: {BUSINESS.policyVersion}</p>
      </Section>
    </LegalLayout>
  );
}
