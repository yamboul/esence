import { ContactBlock, LegalLayout, List, Section, TextLink } from './LegalLayout';
import { BUSINESS, LEGAL_ROUTES } from '@/data/business';

export default function ReturnsPage() {
  const { returns } = BUSINESS;

  return (
    <LegalLayout
      title="Cambios, devoluciones y garantía"
      intro="Queremos que quedes feliz con tu compra. Aquí están tus derechos como consumidor y cómo gestionamos un cambio, una devolución o un reclamo de garantía, conforme al Estatuto del Consumidor (Ley 1480 de 2011)."
    >
      <Section title="1. Derecho de retracto">
        <p>
          Como compraste a distancia, puedes retractarte de la compra dentro de los {returns.retractoDays} días hábiles
          siguientes a la entrega del producto. Para que proceda, el producto debe estar sin abrir, sin usar, con sus
          sellos y empaques originales.
        </p>
        <p>
          Por tratarse de un producto de uso personal, no podemos recibir perfumes que ya hayan sido abiertos, probados o
          usados, salvo que presenten un defecto de calidad cubierto por la garantía.
        </p>
        <p>
          En el retracto, los costos de transporte de la devolución corren por cuenta del comprador. Cuando recibamos el
          producto y confirmemos que está en las condiciones indicadas, te devolvemos el dinero en un plazo máximo de{' '}
          {returns.refundMaxDays} días calendario.
        </p>
      </Section>

      <Section title="2. Producto equivocado o dañado">
        <p>
          Si recibes un producto diferente al que pediste, incompleto o con daños, escríbenos dentro de las{' '}
          {returns.damageReportHours} horas siguientes a la entrega con:
        </p>
        <List
          items={[
            'Tu referencia de pedido (empieza por ESS-) y tu nombre.',
            'Fotos del producto, de las etiquetas y del empaque. Si tienes video de la apertura del paquete, mejor.',
          ]}
        />
        <p>
          Si el error es nuestro o el producto llegó dañado, elegimos contigo entre el cambio por el producto correcto o
          la devolución del dinero, y asumimos los costos de envío.
        </p>
      </Section>

      <Section title="3. Garantía legal">
        <p>
          Todos nuestros productos tienen la garantía legal de calidad, idoneidad y seguridad. Si un producto presenta un
          defecto de fabricación o no corresponde a lo ofrecido (por ejemplo, una versión distinta a la que compraste),
          puedes solicitar que lo cambiemos o te devolvamos el dinero. La garantía no cubre daños por mal uso,
          almacenamiento inadecuado (por ejemplo, calor extremo o luz directa) ni el uso normal del producto.
        </p>
        <p>
          La duración y la intensidad del aroma varían según la piel, el clima y la cantidad aplicada, por lo que no son
          por sí solas un defecto de calidad.
        </p>
      </Section>

      <Section title="4. Reversión del pago">
        <p>
          Si pagaste en línea con tarjeta, PSE u otro medio electrónico, puedes solicitar la reversión del pago (Ley 1480,
          artículo 51) cuando fuiste víctima de fraude, la operación no fue solicitada, el producto no se recibió, o lo
          recibido no corresponde a lo pedido o tiene defectos.
        </p>
        <p>
          Para hacerlo, avísanos y avisa a la entidad emisora de tu medio de pago dentro de los 5 días hábiles siguientes
          a la fecha en que conociste el problema o debiste recibir el producto. Si había un producto, debes devolverlo.
        </p>
      </Section>

      <Section title="5. Cómo solicitar un cambio, devolución o garantía">
        <List
          items={[
            'Escríbenos por WhatsApp o correo con tu referencia de pedido y qué necesitas.',
            'Revisamos tu caso y te respondemos con los pasos a seguir y la dirección para el envío, si aplica.',
            'Empaca el producto de forma segura, con todo lo que venía en la caja, y envíalo como te indiquemos.',
            'Cuando lo recibamos y lo revisemos, procesamos el cambio o el reembolso.',
          ]}
        />
        <ContactBlock />
      </Section>

      <Section title="6. Reembolsos">
        <p>
          Si pagaste con tarjeta, el reembolso se hace por el mismo medio de pago, y el tiempo en que se refleja depende de
          tu banco. Si pagaste con PSE, Nequi, transferencia o contraentrega, te pediremos los datos de una cuenta a tu
          nombre para devolverte el dinero.
        </p>
      </Section>

      <Section title="7. Más información">
        <p>
          Consulta también nuestros <TextLink to={LEGAL_ROUTES.terms}>términos y condiciones</TextLink> y la información
          sobre <TextLink to={LEGAL_ROUTES.shipping}>envíos y entregas</TextLink>.
        </p>
      </Section>
    </LegalLayout>
  );
}
