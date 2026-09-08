import { createClient } from "@supabase/supabase-js";

// VITE_SUPABASE_ANON_KEY es una clave PÚBLICA a propósito: está diseñada
// para vivir en el código del navegador. Lo que protege los datos no es
// mantenerla en secreto, sino las reglas de seguridad (Row Level Security)
// configuradas en Supabase (ver supabase-setup.sql en el repo del sitio
// principal), que hacen que cada persona solo pueda ver sus propias compras.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Si VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY están mal cargadas en Vercel
// (por ejemplo, con un espacio de más, comillas, o sin el "https://"),
// createClient() tira una excepción. Sin este try/catch, ese error rompía
// TODA la app apenas arrancaba (pantalla en blanco, sin ningún aviso) — por
// eso lo atajamos acá: si falla, la app sigue funcionando igual, solo que
// sin el login por usuario/contraseña (LoginGate ya sabe mostrar un mensaje
// claro y ofrecer el código de acceso como alternativa cuando `supabase` es
// `null`).
let supabaseClient = null;
if (supabaseUrl && supabaseAnonKey) {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  } catch (e) {
    console.error(
      "No se pudo inicializar Supabase: revisá que VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY estén bien cargadas en Vercel.",
      e
    );
  }
}

export const supabase = supabaseClient;
