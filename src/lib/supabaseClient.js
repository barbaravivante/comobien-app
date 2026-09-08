import { createClient } from "@supabase/supabase-js";

// VITE_SUPABASE_ANON_KEY es una clave PÚBLICA a propósito: está diseñada
// para vivir en el código del navegador. Lo que protege los datos no es
// mantenerla en secreto, sino las reglas de seguridad (Row Level Security)
// configuradas en Supabase (ver supabase-setup.sql en el repo del sitio
// principal), que hacen que cada persona solo pueda ver sus propias compras.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;
