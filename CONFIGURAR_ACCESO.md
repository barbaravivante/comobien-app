# Cómo entran los compradores a ComoBien

## Esquema actual: cuenta individual (usuario y contraseña)

Cada comprador recibe automáticamente su propia cuenta (email + contraseña)
apenas se aprueba su pago en Mercado Pago. Esto lo maneja
`api/mp-webhook.js`, que vive en el repo del **sitio principal**
(barbaravivante-web), no en este repo — ahí está toda la configuración
(crear el proyecto de Supabase, variables de entorno, etc.), en su README,
sección "Cuentas individuales por comprador y panel de ventas".

Acá, en el repo de ComoBien, lo único que hay que configurar en Vercel
(Settings → Environment Variables) es:

- `VITE_SUPABASE_URL` → la URL de tu proyecto Supabase (la misma que usás en huellasapp)
- `VITE_SUPABASE_ANON_KEY` → la clave pública ("anon public") de Supabase (la misma también)

Con eso, la pantalla de "Iniciá sesión" de la app ya funciona. Es el mismo
proyecto de Supabase que ya usás para Huellas — no hace falta crear uno
nuevo ni una tabla nueva.

## Código de acceso manual (opcional, como respaldo)

Además del login, la app sigue aceptando un código de acceso manual (hay un
link "¿Tenés un código de acceso?" en la pantalla de login), útil para vos
si en algún momento querés dar acceso a alguien sin pasar por Mercado Pago
(por ejemplo, para probar la app vos misma, o dársela gratis a alguien
puntual).

Ese código se configura con la variable:

`VITE_ACCESS_CODES=COMOBIEN-2026` (los que quieras, separados por coma)

Si no configurás nada, la app usa `COMOBIEN-DEMO` como código de ejemplo
para que la demo funcione igual.

**No hace falta usar códigos para los compradores normales**: todos los
compradores que paguen a través del sitio reciben su cuenta automáticamente.
