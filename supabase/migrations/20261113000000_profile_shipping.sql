-- Datos de envío guardados en la cuenta del cliente, para no llenarlos en cada compra.
-- Ejecutar una vez en Supabase → SQL Editor.
alter table public.profiles
  add column if not exists phone text check (char_length(phone) <= 30),
  add column if not exists department text check (char_length(department) <= 60),
  add column if not exists city text check (char_length(city) <= 80),
  add column if not exists address text check (char_length(address) <= 200),
  add column if not exists address_notes text check (char_length(address_notes) <= 300),
  add column if not exists preferred_payment text
    check (preferred_payment in ('wompi', 'transferencia', 'contraentrega')),
  -- Autorización de tratamiento de datos (Ley 1581 de 2012) dada al guardar los datos.
  add column if not exists data_consent_at timestamptz,
  add column if not exists data_policy_version text;

-- El cliente puede editar sus propios datos de envío, pero nunca su rol ni su correo.
grant update (
  phone, department, city, address, address_notes, preferred_payment,
  data_consent_at, data_policy_version
) on public.profiles to authenticated;
