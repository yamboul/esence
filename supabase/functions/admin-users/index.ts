// Gestión de administradores. Solo la pueden usar administradores.
// Acciones:
//   { action: 'list' }                                  → lista de administradores
//   { action: 'create', email, password, fullName? }    → crea la cuenta (o promueve una existente) como admin
//   { action: 'revoke', userId }                        → quita el rol de admin (la cuenta sigue existiendo)
import { adminClient, corsHeaders, json, requestUser } from '../_shared/utils.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Método no permitido' }, 405);

  const caller = await requestUser(req);
  if (!caller) return json({ error: 'Inicia sesión' }, 401);

  const db = adminClient();
  const { data: me } = await db.from('profiles').select('role').eq('id', caller.id).single();
  if (me?.role !== 'admin') return json({ error: 'Solo administradores' }, 403);

  try {
    const body = await req.json();

    if (body.action === 'list') {
      const { data, error } = await db
        .from('profiles')
        .select('id, email, full_name, created_at')
        .eq('role', 'admin')
        .order('created_at');
      if (error) throw error;
      return json({ admins: data });
    }

    if (body.action === 'create') {
      const email = String(body.email ?? '').trim().toLowerCase();
      const password = String(body.password ?? '');
      const fullName = String(body.fullName ?? '').trim() || null;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: 'Correo inválido' }, 400);

      // ¿Ya existe una cuenta con ese correo (p. ej. un cliente que entró con Google)? Se promueve.
      // ilike sin comodines: se escapan % y _ para comparar el correo exacto sin distinguir mayúsculas.
      const { data: existing } = await db
        .from('profiles')
        .select('id')
        .ilike('email', email.replace(/[%_\\]/g, '\\$&'))
        .maybeSingle();
      if (existing) {
        await db.from('profiles').update({ role: 'admin' }).eq('id', existing.id);
        if (password) {
          if (password.length < 8) return json({ error: 'La contraseña debe tener al menos 8 caracteres' }, 400);
          await db.auth.admin.updateUserById(existing.id, { password });
        }
        return json({ ok: true, promoted: true });
      }

      if (password.length < 8) return json({ error: 'La contraseña debe tener al menos 8 caracteres' }, 400);
      const { data: created, error } = await db.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: fullName ? { full_name: fullName } : undefined,
      });
      if (error) return json({ error: error.message }, 400);
      // El trigger handle_new_user ya creó el perfil; se le asigna el rol.
      await db.from('profiles').update({ role: 'admin' }).eq('id', created.user.id);
      return json({ ok: true, created: true });
    }

    if (body.action === 'revoke') {
      const userId = String(body.userId ?? '');
      if (userId === caller.id) return json({ error: 'No puedes quitarte tu propio acceso' }, 400);
      const { count } = await db.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'admin');
      if ((count ?? 0) <= 1) return json({ error: 'Debe quedar al menos un administrador' }, 400);
      await db.from('profiles').update({ role: 'cliente' }).eq('id', userId);
      return json({ ok: true });
    }

    return json({ error: 'Acción desconocida' }, 400);
  } catch (err) {
    console.error(err);
    return json({ error: 'Error del servidor' }, 500);
  }
});
