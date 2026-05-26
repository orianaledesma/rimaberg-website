# Rima Berg — Auditoría pre-publicación
*2026-05-26 · Launch target: 2026-06-02 (7 días)*

> Documento de revisión con la marca. ¿El sitio está listo para publicar?
> Tres bloques: **lo que ya está listo**, **lo que falta antes del launch**,
> y **decisiones que necesitamos de Rima**.

---

## 🟢 Estado general

**El sitio puede publicarse hoy mismo en un dominio temporal**, sin bloqueos
técnicos. Lo que falta son **decisiones de marca y contenido**, no código.

| Métrica | Estado |
|---|---|
| Piezas publicadas | **31** (con nombre + descripción + foto) |
| Piezas en borrador esperando nombre | **21** (placeholder, ocultas del público) |
| Categorías activas | 4 (Earrings · Rings · Engagement · Pendants) |
| Páginas | Home · Catalogue · Detail · About · Contact · Ring size · Privacy |
| Idiomas | LT / EN (toggle persistente) |
| Mobile | ✅ responsive · header simplificado · galería full-width en detalle |
| Accesibilidad | ✅ Skip-link · focus lightbox · aria-current · alt en imágenes |
| Performance | ✅ AVIF/WebP · blur placeholders · cache imágenes 1 año |
| Legal | ✅ Privacy GDPR-aligned · cookie notice · email correcto |

---

## ✅ Listo para publicar

### Estructura
- Header negro con logo blanco y nav minimal (Atelier · LOGO · Contact · LT/EN)
- Hero con carrusel de 4 fotos editoriales, copy "Žiedlapiai"
- **Un solo** carrusel de selección debajo de las categorías (curaduría de Rima)
- Sección "Atelier" con paneo y bajada
- Sección "Coming soon" para el local de Kaunas (Vilniaus g. 30)
- Footer denso (Atelier · Horarios · Contacto · Social · Privacy)

### Vitrina de producto
- Cards limpias **sin etiquetas de stock** ("piezas únicas" por defecto)
- Detalle con galería + hover-zoom + lightbox fullscreen
- Filas vacías del bloque de specs se ocultan automáticamente
- Mensaje "Each piece is one of a kind" sobre las specs
- Botón **Enquire** abre mailto a `info@rimaberg.com` con asunto autopoblado

### Contenido textual
- **About me** con el texto real escrito por la autora (LT + EN), firma cursiva, links a Instagram y Facebook reales
- **Contact** con `Rimantė Landsbergienė`, Piliakalnio g. 11A, Šėtijų kaimas, LT-71223, registro 911884, email info@rimaberg.com, link al showroom Kaunas en Google Maps
- **Ring size**: tabla de 22 filas (mm · LT · UK·Europa · USA) + cómo medir
- **Privacy + cookie notice** GDPR-aligned en LT y EN

### Tipografía y voz
- Serif editorial **Cormorant Garamond** para títulos (sensación de joyería de autor)
- Sans Hanken Grotesk para cuerpo, mono JetBrains para etiquetas
- Sin lenguaje retail: nada de "Pre-order" o "Sold out" en cards

---

## 🟡 Antes del launch — bloqueos suaves

Cosas que **no rompen** el sitio pero conviene resolver para presentar bien
el 2 de junio.

| # | Tema | Quién | Acción |
|---|---|---|---|
| 1 | **21 piezas sin nombre/descripción** | **Rima** | Completar `content/naming-for-rima.html` con LT+EN |
| 2 | **Validar packs de 31 productos** | **Rima** | Marcar checks en `content/product-review-for-rima.html` |
| 3 | **4 fotos en alta resolución** (BKIJ6345, IMG_E6484, EVMC6579, QHYS4544) | **Rima** | Mandar originales del fotógrafo |
| 4 | **15 colgantes sin foto** | **Rima** | Sesión de fotos pendiente |
| 5 | **Revisión nativa LT** | **Rima** o **traductor** | Repasar copy de Ring size, Privacy, Contact, microcopy |
| 6 | **Materiales detallados** (14k, 18k, rosé) | **Rima** | Completar columnas `material_lt/en` del CSV |
| 7 | **Horario definitivo** | **Rima** | Hoy hay Mon–Fri · 10:00–17:00 provisorio |

**Si Rima nos pasa #1, #2, #5 y #7 en los próximos 3 días → launch limpio el 2/6.**
Los pendientes #3, #4 y #6 pueden ir después (el sitio funciona sin ellos).

---

## 🔴 No bloquea pero está pendiente del lado tech

- Cuando esté el local abierto → reemplazar "Coming soon" por "Visit the studio" con foto del frente.
- Cuando llegue la sesión de colgantes → completar CSV + reimport.
- Cuando lleguen las 4 fotos en alta → reemplazar archivos + `npm run gen:blur`.
- Cuando Rima decida más `featured` → editar CSV (hoy: 7 piezas marcadas).

---

## 🎯 Decisiones que necesitamos de Rima (resumen)

1. **¿Aprueba la dirección visual?** Header negro, logo blanco, serif Cormorant, voz "pieza única" en lugar de "pre-order/sold out".
2. **¿Las 21 piezas placeholder?** Necesitamos nombres + descripciones LT/EN (worksheet listo).
3. **¿Los packs de 31 productos están correctos?** ¿Cada foto pertenece a su pieza? (HTML de review listo).
4. **Horario** — ¿es Mon–Fri 10:00–17:00, o cambia?
5. **¿Cuándo abre el local de Vilniaus g. 30?** Para preparar la sección "Visit the studio" con anticipación.
6. **¿Hay material complementario?** (fotos del taller, retrato de Rima en la sesión, fotos de proceso para enriquecer About me).
7. **¿Qué hacemos con el ESI por defecto?** (`featured` de hoy: serdis, trys-pasirinkimai, bundanti-gamta, uogos-peridotai, uogos-oniksai-ametistai-turmalinai, barokas, debesys, primityvai). ¿Le gustan o cambia algunas?

---

## 🚀 Plan sugerido de aquí al launch

| Día | Quién | Hito |
|---|---|---|
| Hoy (26/5) | Oriana | Mandar este audit + los dos HTMLs (naming + product-review) a Rima |
| 27–29/5 | Rima | Devuelve nombres/descripciones de las 21 + valida los 31 packs + revisa LT |
| 30/5 | Oriana | Integra cambios + reimport + última pasada UI/UX |
| 31/5 – 1/6 | Oriana | Deploy a staging, QA con la checklist en `tracking-list.md` |
| **2/6** | 🚀 | **Launch público** |

---

## 📎 Documentos relacionados

- `docs/tracking-list.md` — checklist QA + pendientes tech (más operativo)
- `docs/audit-2026-05-26.md` — auditoría UI/UX/Copy completa (P0/P1/P2)
- `content/naming-for-rima.html` — worksheet para nombrar las 21
- `content/product-review-for-rima.html` — validación de packs (31 piezas)

---

*Compilado con voces de UX, UI/Diseño y Copy. Para presentar a Rima Berg
y decidir go/no-go para el launch del 2 de junio.*
