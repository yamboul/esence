# Puesta en marcha: pedidos, pagos, login y panel de administrador

Esta guía conecta la tienda con:

- **Supabase**: base de datos, login y servidor.
- **Wompi**: cobro con tarjeta, PSE o Nequi.
- **Telegram**: aviso de cada pedido en tu celular.
- **Google**: los clientes inician sesión con su cuenta de Google.

Sigue los pasos en orden. Todo lo que dice "pega" o "ejecuta" es literal.

Al terminar funciona así:

| Situación | Qué pasa |
|---|---|
| El cliente paga en línea (Wompi) y el pago se aprueba | Te llega la orden a Telegram con "✅ PAGO APROBADO" y el pedido queda **Pagado** |
| El cliente paga en línea y el pago se rechaza | El pedido queda **Pago rechazado**. No llega aviso. El cliente puede intentar de nuevo |
| El cliente elige contraentrega o transferencia | Te llega la orden a Telegram al instante, marcada "pago pendiente" |
| Un administrador cambia el estado en el panel | El pedido pasa a Pagado, Enviado, Entregado o Cancelado. El cliente lo ve en "Mi cuenta" |

---

## 1. Crear el proyecto en Supabase

1. Entra a <https://supabase.com>, crea una cuenta y luego **New project**.
   - Nombre: `essence`.
   - Región: **East US (North Virginia)**, la más cercana a Colombia.
   - Guarda la contraseña de la base de datos en un lugar seguro.
2. Cuando termine de crearse, ve a **Project Settings → API** y copia:
   - **Project URL**
   - **anon public** key
   - El **Project ref**: es la parte `xxxx` de `https://xxxx.supabase.co`.

> ⚠️ La clave **service_role** nunca va en el código, en `.env.local` ni en un chat. Da control total de la base de datos.

## 2. Crear las tablas

1. En Supabase, abre **SQL Editor → New query**.
2. Pega todo el contenido de `supabase/migrations/20261109000000_init.sql` y haz clic en **Run**.
   Luego, en otra consulta nueva, haz lo mismo con `supabase/migrations/20261110000000_data_consent.sql`.
   Y por último, en otra consulta nueva, con `supabase/migrations/20261113000000_profile_shipping.sql`: permite que cada cliente guarde su dirección, celular y método de pago en su cuenta.
3. En tu computador, dentro de la carpeta del proyecto, ejecuta:
   ```
   npm run db:products-sql
   ```
   Esto crea `supabase/seed_products.sql` con los precios actuales.
4. Pega el contenido de `supabase/seed_products.sql` en una consulta nueva y haz clic en **Run**.

> **Cada vez que cambies precios o productos** en `src/data/products.ts`, repite los pasos 3 y 4.
> El cobro usa los precios de la base de datos. Así nadie puede alterar el precio desde el navegador.

## 3. Conectar la página

1. Copia `.env.example` como `.env.local`.
2. Rellena `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
3. Reinicia `npm run dev`.

## 4. Login con Google

Google no cobra por esto. Solo hay que registrar la tienda como "aplicación".

1. Entra a <https://console.cloud.google.com> y crea un proyecto llamado `ESSENCE`.
2. Ve a **APIs y servicios → Pantalla de consentimiento de OAuth** (o **Google Auth Platform → Branding**):
   - Tipo de usuario: **Externo**.
   - Nombre de la app: `ESSENCE`. Correo de soporte: el tuyo.
   - Permisos: solo `email`, `profile` y `openid`, que vienen por defecto. Con estos permisos básicos Google **no exige revisión**.
   - Al terminar, en **Público** (Audience), haz clic en **Publicar app**. Mientras esté en modo "Prueba", solo pueden entrar los correos que agregues como testers.
3. Ve a **Credenciales → Crear credenciales → ID de cliente de OAuth**:
   - Tipo: **Aplicación web**.
   - **URI de redireccionamiento autorizados**: `https://TU-PROJECT-REF.supabase.co/auth/v1/callback`
   - Copia el **ID de cliente** y el **Secreto de cliente**.
4. En Supabase, ve a **Authentication → Sign In / Providers → Google**. Actívalo y pega el ID y el secreto.
5. En Supabase, ve a **Authentication → URL Configuration**:
   - **Site URL**: la dirección de tu página publicada. Por ahora sirve `http://localhost:5173`.
   - **Redirect URLs**: agrega `http://localhost:5173/**` y, cuando publiques, `https://TU-DOMINIO/**`.

**Correos de los clientes:** Google le entrega a Supabase el correo y el nombre de cada persona que inicia sesión. Quedan guardados en la tabla `profiles`.
Para enviarles ofertas, la ley colombiana (Ley 1581 de 2012) exige **consentimiento expreso**. Por eso la tienda tiene la casilla "Quiero recibir ofertas" en el checkout y en "Mi cuenta".
En el panel, la pestaña **Clientes** muestra solo a quienes aceptaron y permite exportar la lista a CSV para Mailchimp, Brevo u otro servicio. Cada correo que envíes debe incluir un enlace para darse de baja.

## 5. Bot de Telegram

1. En Telegram, abre **@BotFather** y envía `/newbot`. Ponle de nombre `ESSENCE Pedidos` y un usuario que termine en `bot`.
2. BotFather te da un **token**, parecido a `123456:ABC-xyz...`. Guárdalo.
3. Abre el chat con tu bot nuevo y envíale cualquier mensaje, por ejemplo "hola".
4. En el navegador, abre `https://api.telegram.org/botTU_TOKEN/getUpdates`.
   Busca `"chat":{"id":123456789` y copia ese número: es tu **chat ID**.
   - Si quieres que lleguen a un **grupo** (por ejemplo, tú y tu equipo): agrega el bot al grupo, escribe algo en el grupo y repite este paso. El ID de un grupo empieza con `-`.

## 6. Wompi (pagos)

1. Regístrate en <https://comercios.wompi.co> con tu cédula o NIT.
2. En **Desarrolladores → Llaves del API**, usa primero las llaves de **pruebas (Sandbox)**:
   - **Llave pública**: empieza con `pub_test_`.
   - **Secreto de integridad**: empieza con `test_integrity_`.
   - **Secreto de eventos**: empieza con `test_events_`.
3. En **Desarrolladores → Eventos**, en la URL de eventos pon:
   `https://TU-PROJECT-REF.supabase.co/functions/v1/wompi-webhook`

## 7. Subir las funciones del servidor

En la terminal, dentro de la carpeta del proyecto:

```bash
npx supabase login
npx supabase link --project-ref TU-PROJECT-REF

npx supabase secrets set \
  SITE_URL=http://localhost:5173 \
  TELEGRAM_BOT_TOKEN=tu_token_de_botfather \
  TELEGRAM_CHAT_ID=tu_chat_id \
  WOMPI_PUBLIC_KEY=pub_test_xxx \
  WOMPI_INTEGRITY_SECRET=test_integrity_xxx \
  WOMPI_EVENTS_SECRET=test_events_xxx

npx supabase functions deploy create-order
npx supabase functions deploy admin-users
npx supabase functions deploy wompi-webhook --no-verify-jwt
```

`wompi-webhook` va con `--no-verify-jwt` porque Wompi no tiene cuenta en Supabase. Esa función verifica la firma de Wompi por su cuenta.

En Windows (PowerShell), escribe el comando `secrets set` en una sola línea, sin las `\`.

## 8. Crear el primer administrador

Los siguientes administradores los agregas desde el panel. El primero se crea a mano:

1. En Supabase, ve a **Authentication → Users → Add user → Create new user**. Pon tu correo y una contraseña, y marca **Auto Confirm User**.
2. En **SQL Editor**, ejecuta lo siguiente con tu correo:
   ```sql
   update public.profiles set role = 'admin' where email = 'tu-correo@ejemplo.com';
   ```
3. En la tienda, haz clic en el icono de usuario, abre **Acceso administradores** e ingresa. Verás **Panel de administrador**.

## 9. Probar todo (modo pruebas)

1. Agrega un perfume al carrito, ve a **Finalizar compra** y elige **Pago en línea**.
2. En Wompi Sandbox:
   - Tarjeta **4242 4242 4242 4242** (cualquier fecha futura y cualquier CVC): pago **aprobado**. Debe llegarte el mensaje a Telegram.
   - Tarjeta **4111 1111 1111 1111**: pago **rechazado**.
   - Nequi: el número `3991111111` aprueba y `3992222222` rechaza.
3. Haz un pedido con **contraentrega**: el aviso debe llegar a Telegram al instante.
4. En el **Panel de administrador → Pedidos**, cambia el estado de un pedido.

Si algo no llega, revisa los registros en Supabase: **Edge Functions → (la función) → Logs**.

## 10. Pasar a producción (cobrar de verdad)

1. En Wompi, completa la verificación del comercio y copia las llaves de **producción**: `pub_prod_`, `prod_integrity_` y `prod_events_`.
2. Configura la URL de eventos también en el ambiente de producción de Wompi.
3. Actualiza los secretos:
   ```bash
   npx supabase secrets set SITE_URL=https://TU-DOMINIO WOMPI_PUBLIC_KEY=pub_prod_xxx WOMPI_INTEGRITY_SECRET=prod_integrity_xxx WOMPI_EVENTS_SECRET=prod_events_xxx
   ```
4. En las variables de entorno de tu hosting (Netlify, Vercel u otro), define `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` y `VITE_WOMPI_ENV=production`.
5. En Supabase, en **URL Configuration**, cambia la Site URL a tu dominio.

## Páginas legales

Ya están publicadas en `/politica-de-datos`, `/envios`, `/cambios-y-devoluciones` y `/terminos-y-condiciones`, enlazadas desde el footer.
Wompi las pide para aprobar tu comercio.

- Los datos del negocio y los tiempos de envío se editan en `src/data/business.ts`. Revisa los campos marcados con `CONFIRMAR`.
- Si cambias el texto de la política de datos, cambia también `policyVersion` y `policyDate`. Cada pedido guarda la versión que aceptó el cliente.
- Son un borrador basado en la Ley 1581 de 2012 y la Ley 1480 de 2011, no asesoría legal. Que los revise un abogado antes de vender en serio.
