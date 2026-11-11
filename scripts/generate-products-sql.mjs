// Genera supabase/seed_products.sql a partir de src/data/products.ts.
// Uso: npm run db:products-sql  → pegar el archivo generado en Supabase → SQL Editor.
// Ejecutarlo cada vez que cambien precios, existencias o productos en products.ts:
// el cobro usa los precios de la base de datos, no los del navegador.
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Node 24 elimina los tipos de TypeScript al importar .ts (solo hay `import type`).
const { products } = await import('../src/data/products.ts');

const q = (s) => `'${String(s).replace(/'/g, "''")}'`;
const price = (p, key) => p.versions.find((v) => v.key === key)?.price ?? null;

const rows = products.map((p) => {
  const classic = price(p, 'classic');
  const premium = price(p, 'premium') ?? classic;
  return `  (${q(p.id)}, ${q(p.name)}, ${q(p.brand)}, ${classic ?? 'null'}, ${premium}, ${p.inStock})`;
});

const sql = `-- Generado por scripts/generate-products-sql.mjs — no editar a mano.
insert into public.products (id, name, brand, price_classic, price_premium, in_stock)
values
${rows.join(',\n')}
on conflict (id) do update set
  name = excluded.name,
  brand = excluded.brand,
  price_classic = excluded.price_classic,
  price_premium = excluded.price_premium,
  in_stock = excluded.in_stock,
  updated_at = now();

-- Productos que ya no están en el catálogo quedan agotados (no se borran: pedidos antiguos los referencian).
update public.products set in_stock = false, updated_at = now()
where id not in (${products.map((p) => q(p.id)).join(', ')});
`;

const out = fileURLToPath(new URL('../supabase/seed_products.sql', import.meta.url));
writeFileSync(out, sql);
console.log(`OK: ${products.length} productos → supabase/seed_products.sql`);
