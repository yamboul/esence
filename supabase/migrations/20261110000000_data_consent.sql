-- Constancia de la autorización de tratamiento de datos (Ley 1581 de 2012).
-- La función create-order la guarda con cada pedido. Ejecutar una vez en SQL Editor.
alter table public.orders
  add column if not exists data_consent_at timestamptz,
  add column if not exists data_policy_version text;
