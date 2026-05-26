# Rima Berg — Tracking list (pendientes & QA)
*Última actualización: 2026-05-26 · Launch target: 2026-06-02*

Tres canales: **🎨 Validación con Rima** · **🧪 QA / test funcional** · **🔧 Tech pendiente**.

---

## 🎨 Validación con Rima
Cosas que necesitan su decisión / información antes del launch.

### Producto
- [ ] **Nombrar las 21 piezas placeholder** (ring-1, earring-1, floral, pendants-1, etc.) — abrir `content/naming-for-rima.html` (una página por pieza con foto + sugerencia + casillero LT/EN).
- [ ] **Revisar pack por producto** (qué fotos pertenecen a qué pieza + descripción correcta) — abrir `content/product-review-for-rima.html` (31 piezas con sus fotos agrupadas y descripción; tildea/comenta).
- [ ] **Materiales detallados por pieza** — muchas dicen solo "Silver 925, Gold". ¿14k? ¿18k? ¿oro rosa o amarillo? Sube percepción de valor.
- [ ] **15 colgantes sin foto** — la categoría Pendants queda casi vacía. Mandar fotos.
- [ ] **4 fotos en alta resolución** — `BKIJ6345`, `IMG_E6484`, `EVMC6579`, `QHYS4544` están en 1024–1280px, pixelan al hacer zoom. *Ya las saqué del banner del home; faltan para detalle.*
- [ ] **Confirmar dirección postal** = Piliakalnio g. 11A, Šėtijų kaimas, LT-71223, Lietuva.
- [ ] **Confirmar showroom Kaunas** = Vilniaus g. 30. La sección "Coming Soon" se mantiene hasta que abra el local; cuando esté listo el frente: mandar foto para reemplazar.
- [ ] **Confirmar horario** — provisorio Mon–Fri · 10:00–17:00. Definir.
- [ ] **Confirmar email** = info@rimaberg.com (ya está en todo el sitio).
- [ ] **Logo final** — versión actual (1092×358 horizontal blanca sobre transparente). ¿OK o ajustar arte?

### Copy
- [ ] **Revisión nativa de los textos en lituano** — passé un hablante nativo:
  - About me (texto de la autora) ✓ ya viene de ella
  - Ring size: introducción y cómo medir
  - Contact, Privacy, Cookie notice
  - Hero eyebrow "Žiedlapiai"
  - Coming soon
  - Microcopy de cards/detalle

---

## 🧪 QA / test funcional
Lista que recorrer manualmente para confirmar que todo anda.

### Navegación
- [ ] Home (`/`) carga, hero alterna 4 fotos, carrusel medio (featured), grid de categorías, carrusel aleatorio inferior, Atelier, Coming Soon, footer.
- [ ] Catálogo (`/catalogue`) muestra 31 piezas. Filtros por categoría (`?category=earrings|rings|pendants|engagement`) filtran bien.
- [ ] Detalle de producto (`/catalogue/[id]`): galería con hover-zoom, click → lightbox fullscreen, miniaturas funcionan, related products al pie.
- [ ] `/about`, `/contact`, `/ring-size`, `/privacy` cargan.
- [ ] Generic placeholders (ej. `/catalogue/ring-1`) → 404.

### Internacionalización (LT/EN)
- [ ] Toggle LT/EN persiste (cookie `rb-locale`).
- [ ] Todos los textos cambian de idioma en cada página.
- [ ] El email subject del botón "Enquire" del detalle viene bien en ambos idiomas (`{name}` y `{code}` interpolados).

### Accesibilidad
- [ ] Tab keyboard navigation por toda la home.
- [ ] Skip-link (Tab al cargar) lleva al `<main>`.
- [ ] Lightbox: foco va al ✕ al abrir, Esc cierra, foco vuelve a la foto.
- [ ] LocaleSwitcher con `aria-current` en idioma activo.
- [ ] Contraste suficiente en header negro y todos los CTAs.

### Mobile (≤640px)
- [ ] Header: solo "Atelier · LOGO · LT/EN" (los extras Ring size + Contact se ocultan).
- [ ] CategoryNav scrollea horizontal si rebalsa.
- [ ] Detalle: galería full-width arriba, aside debajo (no sticky).
- [ ] Cookie notice se ve y se descarta correctamente.

### Performance
- [ ] Las fotos cargan con blur placeholder (efecto blur-up).
- [ ] No hay imágenes pixeladas en el hero (las 4 críticas ya quedaron fuera).
- [ ] Click en una foto → zoom no pixela en pantalla normal.

---

## 🔧 Tech pendiente
Cosas a hacer en código cuando vuelvan la info / cuando haya margen.

- [ ] Cuando Rima nombre las 21 piezas → actualizar `content/products.csv` (o reimportar) y se publican automáticamente.
- [ ] Cuando lleguen las 4 fotos en alta → reemplazar en `public/products/` (mismos nombres) + `npm run gen:blur`.
- [ ] Cuando estén los 15 colgantes → completar CSV + `npm run import:products`.
- [ ] Cuando esté el local abierto → reemplazar `ComingSoon` por una sección "Visit the studio" con foto del frente.
- [ ] Marcar más piezas como `featured` si Rima quiere otra curaduría (hoy son 7).
- [ ] Considerar serif tipográfica alternativa si Cormorant Garamond no convence (opciones: EB Garamond, Söhne Halbfett).
- [ ] Tipografía: revisar peso de h1/h2 en distintos breakpoints.
- [ ] Si crece el catálogo >100 piezas, considerar agregar buscador.

---

## ✅ Cerrado en sprint del 2026-05-26
- Header negro con logo blanco (Logo.tsx con aspect ratio ajustado al PNG actual).
- Tipografía: Cormorant Garamond serif para títulos (`base.css`).
- `preOrder` eliminado de toda la app.
- `bracelets` eliminado.
- Engagement cross-listado bajo Rings.
- Status pill removido de cards (no se muestra "Sold out / On request" en vitrina pública — mensaje "Each piece is one of a kind" en el detalle).
- "fig. 0X" microcopy quitado de la galería (era muy técnico).
- Detail page: filas vacías del `<dl>` se ocultan; `borderTop` tokenizado (var(--rb-line)).
- Hero swap: `BKIJ6345` (1024px, baja res) reemplazada por `MYTG1376` (1800px).
- Hairline header sobre hero negro: `rgba(255,255,255,.14)` + shadow sutil.
- LocaleSwitcher: `aria-current`, `aria-pressed`, `aria-label`.
- Sticky aside top: bajado a 96 (header ~80px).
- Mobile detail: grid colapsa a 1 columna, aside un-sticks, gallery 3:4.
- Cookie notice (microbarra dismissible, GDPR-friendly).
- Footer denso + año dinámico + link a Privacy.
- Página `/about` reescrita con el texto real de la autora (EN+LT), firma cursiva, social links.
- Páginas nuevas: `/contact`, `/ring-size`, `/privacy`.
- Email global: info@rimaberg.com.
- Horario: Mon–Fri 10:00–17:00 (provisorio, a validar).
- Hero eyebrow: solo "Žiedlapiai" (sin SS 26).
- Header: "Atelier" → "Jewellery" (EN) / "Papuošalai" (LT).
