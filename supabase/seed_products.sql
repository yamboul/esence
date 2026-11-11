-- Generado por scripts/generate-products-sql.mjs — no editar a mano.
insert into public.products (id, name, brand, price_classic, price_premium, in_stock)
values
  ('yara-lattafa', 'Yara', 'Lattafa', null, 155000, true),
  ('212-vip-rose-carolina-herrera', '212 VIP Rosé', 'Carolina Herrera', 100000, 125000, true),
  ('sauvage-dior', 'Sauvage Dior', 'Dior', null, 125000, true),
  ('asad-bourbon-lattafa', 'Asad Bourbon de Lattafa', 'Lattafa', null, 155000, true),
  ('valentino', 'Valentino', 'Valentino', null, 125000, true),
  ('hugo-xx', 'Hugo XX', 'Hugo Boss', 100000, 125000, true),
  ('tyrant-odyssey', 'Tyrant', 'Odyssey', null, 130000, true),
  ('versace-eros-energy', 'Versace Eros Energy', 'Versace', null, 130000, true),
  ('212-men-sexy', '212 Men Sexy', 'Carolina Herrera', 100000, 130000, true),
  ('212-vip', '212 VIP', 'Carolina Herrera', 100000, 130000, true),
  ('212-vip-black', '212 VIP Black', 'Carolina Herrera', 100000, 130000, true),
  ('versace-eros-flame', 'Versace Eros Flame', 'Versace', 115000, 135000, true),
  ('one-million', 'One Million', 'Paco Rabanne', 115000, 135000, true),
  ('one-million-lucky', 'One Million Lucky', 'Paco Rabanne', null, 125000, true),
  ('one-million-royal', 'One Million Royal', 'Paco Rabanne', null, 125000, true),
  ('ultra-male', 'Ultra Male', 'Jean Paul Gaultier', null, 150000, true),
  ('y-elixir', 'Y Elixir', 'Jean Paul Gaultier', null, 150000, true)
on conflict (id) do update set
  name = excluded.name,
  brand = excluded.brand,
  price_classic = excluded.price_classic,
  price_premium = excluded.price_premium,
  in_stock = excluded.in_stock,
  updated_at = now();

-- Productos que ya no están en el catálogo quedan agotados (no se borran: pedidos antiguos los referencian).
update public.products set in_stock = false, updated_at = now()
where id not in ('yara-lattafa', '212-vip-rose-carolina-herrera', 'sauvage-dior', 'asad-bourbon-lattafa', 'valentino', 'hugo-xx', 'tyrant-odyssey', 'versace-eros-energy', '212-men-sexy', '212-vip', '212-vip-black', 'versace-eros-flame', 'one-million', 'one-million-lucky', 'one-million-royal', 'ultra-male', 'y-elixir');
