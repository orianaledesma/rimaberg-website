# Rimaberg · Administrador — progreso y pendientes

Rama: `feature/rimaberg/admin` (NO mergeada a prod todavía).
Última actualización: 2026-06-16.

## ✅ Hecho (LIVE en prod)
- **Columna "Información" en el footer** con los datos legales reales
  (Šviesos mylia, MB · įmonės kodas 305571454 · dirección registrada · teléfono).
  Mergeado a `main` (PR #1) → ya está en rimaberg.com.

## ✅ Hecho (en la rama del admin, funcionando en LOCAL)
- **Panel `/admin`** protegido por contraseña única (cookie firmada, middleware
  + `requireAdmin()` en cada acción). Validado: sin login no se ve nada.
- **Productos**: listar / crear / editar / borrar, subir imágenes (Supabase
  Storage), reordenar imágenes (←/→, ★ portada, ✕), reordenar productos (↑/↓).
- **Site texts**: editar cualquier texto del sitio (EN/LT); se guarda como
  override sobre los JSON; vaciar un campo restaura el original.
- **Supabase** conectado: 56 productos migrados (54 Live, 2 Draft). RLS activo
  (público lee solo publicados, no escribe).
- Quitado el campo **Status** del formulario y la categoría fantasma **"Kita"**.
- **Confirmación al guardar** (bilingüe EN/LT) con instrucciones de refrescar
  (Ctrl/Cmd+Shift+R) o probar en incógnito.

## ▶️ Cómo retomar las pruebas mañana
1. `cd _Repositories/rimaberg && git checkout feature/rimaberg/admin`
2. `npm run dev`
3. Entrar a http://localhost:3000/admin · contraseña temporal: **`rimaberg2026`**
   (está en `.env.local`, gitignored).
4. Probar: editar texto (Site texts → Save), editar/crear producto, subir y
   reordenar imágenes, reordenar productos, borrar la pieza de prueba.
   Tras guardar, refrescar el sitio (Cmd/Shift/R) o incógnito para verificar.

## ⏳ Pendiente
- [ ] Seguir las pruebas de Ori en local.
- [ ] (Opcional) ¿Borrar la columna `status` de la tabla en la DB? Hoy quedó
      sin usar con default inofensivo. Si se quiere limpiar: `alter table
      public.products drop column status;`
- [ ] (Opcional) ¿Admin en lituano para Rima? Hoy la UI del panel está en inglés.
- [ ] **Pasar a prod** cuando esté aprobado:
  1. Cargar en Vercel (Settings → Environment Variables, marcar *Sensitive*):
     `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
     `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD` (¡uno fuerte, no el temporal!),
     `ADMIN_SESSION_SECRET`.
  2. Abrir PR de `feature/rimaberg/admin` → `main` y mergear.
  3. **Deployar a prod** (ver sección Deploy — no es automático).

## 🚀 Deploy / Vercel (IMPORTANTE)
- **El auto-deploy Git → Vercel NO está activo** en `rimaberg-website`. Mergear
  a `main` **no** dispara deploy solo (lo descubrimos el 2026-06-16: el footer
  estaba en `main` pero prod servía un build de 11 días atrás).
- **Mientras el auto-deploy siga apagado**, cada release a prod es manual:
  ```
  git checkout main
  mv .env.local /tmp/rb-env.bak     # sacar secretos del upload, por las dudas
  vercel --prod --yes               # CLI ya logueado como orianaledesma
  mv /tmp/rb-env.bak .env.local
  git checkout feature/rimaberg/admin
  ```
- **Recomendado**: reconectar el repo en **Vercel → Project Settings → Git**
  para que los merges a `main` deployen automáticamente y no haya que hacer esto.
- Para el **admin**: antes de deployar su merge, cargar las env vars de Supabase
  en Vercel (ver "Pendiente"), si no el build/los reads fallan en prod.

## 🔐 Seguridad
- Secretos solo en `.env.local` (local) y Vercel env (prod). Nada en git.
- La `service_role` nunca pasó por el chat (la cargó Ori).
- Antes de prod: cambiar `ADMIN_PASSWORD` por uno fuerte.
