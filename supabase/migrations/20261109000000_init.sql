-- ESSENCE: esquema inicial
-- Ejecutar completo en Supabase → SQL Editor (una sola vez).
-- Después ejecutar supabase/seed_products.sql (precios) y crear el primer administrador (ver SUPABASE_SETUP.md).

-- ─────────────────────────────────────────────────────────────
-- Perfiles: un registro por usuario de Supabase Auth (clientes y administradores)
-- ─────────────────────────────────────────────────────────────
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'cliente' check (role in ('cliente', 'admin')),
  -- Consentimiento explícito para correos de ofertas (Ley 1581 de 2012)
  marketing_opt_in boolean not null default false,
  marketing_opt_in_at timestamptz,
  created_at timestamptz not null default now()
);

create index profiles_email_idx on public.profiles (lower(email));

-- Crea el perfil automáticamente al registrarse (Google o correo/contraseña)
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Guarda la fecha del consentimiento cuando se activa
create function public.touch_marketing_opt_in()
returns trigger
language plpgsql
as $$
begin
  if new.marketing_opt_in and not coalesce(old.marketing_opt_in, false) then
    new.marketing_opt_in_at := now();
  elsif not new.marketing_opt_in then
    new.marketing_opt_in_at := null;
  end if;
  return new;
end;
$$;

create trigger profiles_marketing_opt_in
  before update of marketing_opt_in on public.profiles
  for each row execute function public.touch_marketing_opt_in();

-- ¿El usuario actual es administrador? (security definer evita recursión en RLS)
create function public.is_admin()
returns boolean
language sql
stable
security definer set search_path = ''
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

alter table public.profiles enable row level security;

create policy "perfil propio o admin: leer" on public.profiles
  for select using (id = auth.uid() or public.is_admin());

create policy "perfil propio: actualizar" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

-- Los usuarios solo pueden cambiar su nombre y su consentimiento, nunca su rol.
revoke update on public.profiles from authenticated, anon;
grant update (full_name, marketing_opt_in) on public.profiles to authenticated;

-- ─────────────────────────────────────────────────────────────
-- Productos: fuente de verdad de los PRECIOS para cobrar.
-- El total del pedido se calcula en el servidor con esta tabla, nunca con lo que envía el navegador.
-- ─────────────────────────────────────────────────────────────
create table public.products (
  id text primary key,
  name text not null,
  brand text not null,
  price_classic integer check (price_classic > 0),
  price_premium integer not null check (price_premium > 0),
  in_stock boolean not null default true,
  updated_at timestamptz not null default now()
);

alter table public.products enable row level security;

create policy "productos: leer todos" on public.products for select using (true);
create policy "productos: admin edita" on public.products for all using (public.is_admin()) with check (public.is_admin());

-- ─────────────────────────────────────────────────────────────
-- Pedidos
-- Se crean solo desde la Edge Function create-order (service role).
-- ─────────────────────────────────────────────────────────────
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,                -- referencia enviada a Wompi, p. ej. ESS-20261109-AB12CD
  user_id uuid references auth.users (id) on delete set null,
  full_name text not null,
  phone text not null,
  email text not null,
  department text not null,
  city text not null,
  address text not null,
  notes text,
  payment_method text not null check (payment_method in ('wompi', 'transferencia', 'contraentrega')),
  items jsonb not null,                          -- [{id, name, brand, version, quantity, unit_price}]
  total integer not null check (total > 0),
  status text not null default 'pendiente_pago'
    check (status in ('pendiente_pago', 'pagado', 'pago_rechazado', 'enviado', 'entregado', 'cancelado')),
  wompi_transaction_id text,
  wompi_payment_type text,
  marketing_opt_in boolean not null default false,
  telegram_notified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index orders_created_at_idx on public.orders (created_at desc);
create index orders_user_idx on public.orders (user_id);
create index orders_email_idx on public.orders (lower(email));

create function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger orders_updated_at before update on public.orders
  for each row execute function public.touch_updated_at();

alter table public.orders enable row level security;

create policy "pedidos: cliente ve los suyos, admin ve todos" on public.orders
  for select using (user_id = auth.uid() or public.is_admin());

create policy "pedidos: solo admin actualiza" on public.orders
  for update using (public.is_admin()) with check (public.is_admin());

-- Desde el panel, el admin solo cambia el estado.
revoke insert, update, delete on public.orders from authenticated, anon;
grant update (status) on public.orders to authenticated;

-- ─────────────────────────────────────────────────────────────
-- Contactos para ofertas: solo personas que aceptaron recibirlas.
-- security_invoker = la vista respeta el RLS de quien consulta (solo admins ven todo).
-- ─────────────────────────────────────────────────────────────
create view public.marketing_contacts
with (security_invoker = true) as
select distinct on (lower(email))
  lower(email) as email,
  full_name,
  source,
  consented_at
from (
  select email, full_name, 'cuenta' as source, marketing_opt_in_at as consented_at
  from public.profiles
  where marketing_opt_in
  union all
  select email, full_name, 'pedido' as source, created_at as consented_at
  from public.orders
  where marketing_opt_in
) c
order by lower(email), consented_at desc;
