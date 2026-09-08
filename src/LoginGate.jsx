import { useEffect, useState } from "react";
import { KeyRound, Mail, Lock } from "lucide-react";
import { supabase } from "./lib/supabaseClient";
import { COLORS, FONT_IMPORT_URL, FONT_TITULOS, FONT_TEXTO } from "./theme";

// Reemplaza a LicenseGate: ahora cada comprador tiene su propia cuenta
// (email + contraseña), creada automáticamente por api/mp-webhook.js
// (en el repo del sitio principal, barbaravivante-web) cuando se aprueba
// el pago en Mercado Pago.
//
// Se mantiene, como alternativa, el ingreso con un código de acceso
// (VITE_ACCESS_CODES) para cuando quieras dar un acceso manual sin pasar
// por Mercado Pago (por ejemplo, para probar la app vos misma).
//
// Configuración necesaria en Vercel (Settings > Environment Variables):
//   VITE_SUPABASE_URL      -> URL de tu proyecto Supabase
//   VITE_SUPABASE_ANON_KEY -> "anon public" key de Supabase (es pública, no es secreta)
//   VITE_ACCESS_CODES      -> (opcional) códigos manuales

const FONT_IMPORT = `@import url('${FONT_IMPORT_URL}');`;

const SISTEMA_ID = "comobien"; // id de ComoBien en lib/products.js del sitio principal

function getValidCodes() {
  const raw = import.meta.env.VITE_ACCESS_CODES || "COMOBIEN-DEMO";
  return raw
    .split(",")
    .map((c) => c.trim().toUpperCase())
    .filter(Boolean);
}

export default function LoginGate({ children }) {
  const [checking, setChecking] = useState(true);
  const [unlocked, setUnlocked] = useState(false);
  const [modo, setModo] = useState("login"); // "login" | "codigo"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    async function inicializar() {
      if (localStorage.getItem("comobien:license_ok") === "true") {
        setUnlocked(true);
        setChecking(false);
        return;
      }
      if (supabase) {
        const { data } = await supabase.auth.getSession();
        if (data?.session) {
          const tieneAcceso = await chequearAcceso();
          if (tieneAcceso) {
            setUnlocked(true);
            setChecking(false);
            return;
          }
        }
      }
      setChecking(false);
    }
    inicializar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function chequearAcceso() {
    if (!supabase) return false;
    const { data, error: queryError } = await supabase
      .from("compras")
      .select("id")
      .eq("sistema", SISTEMA_ID)
      .limit(1);
    return !queryError && data && data.length > 0;
  }

  const handleLogin = async () => {
    setError("");
    if (!email.trim() || !password.trim()) return;
    if (!supabase) {
      setError("El inicio de sesión no está disponible todavía. Probá con tu código de acceso.");
      return;
    }
    setCargando(true);
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim(),
    });
    if (loginError) {
      setError("Email o contraseña incorrectos.");
      setCargando(false);
      return;
    }
    const tieneAcceso = await chequearAcceso();
    if (!tieneAcceso) {
      setError("Esta cuenta no tiene una compra de ComoBien registrada. Si creés que es un error, escribinos.");
      await supabase.auth.signOut();
      setCargando(false);
      return;
    }
    setUnlocked(true);
    setCargando(false);
  };

  const handleCodigo = () => {
    setError("");
    if (!codigo.trim()) return;
    const validCodes = getValidCodes();
    if (validCodes.includes(codigo.trim().toUpperCase())) {
      localStorage.setItem("comobien:license_ok", "true");
      setUnlocked(true);
    } else {
      setError("Código inválido. Revisá que esté bien escrito.");
    }
  };

  if (checking) return null;
  if (unlocked) return children;

  return (
    <div
      className="flex min-h-screen w-full flex-col items-center justify-center gap-5 px-6 text-center"
      style={{ backgroundColor: COLORS.fondo, fontFamily: FONT_TEXTO }}
    >
      <style>{FONT_IMPORT}</style>
      <div className="flex h-16 w-16 items-center justify-center rounded-full" style={{ backgroundColor: COLORS.primario }}>
        <KeyRound size={26} color="#fff" />
      </div>
      <div>
        <h1 className="text-[22px]" style={{ fontFamily: FONT_TITULOS, fontWeight: 600, color: COLORS.textoPrincipal }}>
          {modo === "login" ? "Iniciá sesión" : "Ingresá tu código de acceso"}
        </h1>
        <p className="mt-1 text-[13px]" style={{ color: COLORS.textoSecundario }}>
          {modo === "login"
            ? "Usá el email y la contraseña que recibiste al comprar ComoBien."
            : "Código de acceso manual (para pruebas o casos especiales)."}
        </p>
      </div>

      {modo === "login" ? (
        <div className="flex w-full max-w-xs flex-col gap-2.5">
          <div className="relative">
            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: COLORS.textoTerciario }} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Tu email"
              className="w-full rounded-xl border py-3 pl-10 pr-4 text-[14px] outline-none"
              style={{ backgroundColor: COLORS.fondoTarjeta, borderColor: COLORS.borde, color: COLORS.textoPrincipal }}
            />
          </div>
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: COLORS.textoTerciario }} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="Tu contraseña"
              className="w-full rounded-xl border py-3 pl-10 pr-4 text-[14px] outline-none"
              style={{ backgroundColor: COLORS.fondoTarjeta, borderColor: COLORS.borde, color: COLORS.textoPrincipal }}
            />
          </div>
          <button
            onClick={handleLogin}
            disabled={cargando}
            className="rounded-2xl py-3 text-[13.5px] font-bold text-white disabled:opacity-60"
            style={{ backgroundColor: COLORS.primario }}
          >
            {cargando ? "Entrando…" : "Entrar"}
          </button>
          {error && <p className="text-[12px] font-semibold" style={{ color: COLORS.error }}>{error}</p>}
          <button
            onClick={() => {
              setModo("codigo");
              setError("");
            }}
            className="mt-1 text-[12px] font-semibold underline"
            style={{ color: COLORS.textoTerciario }}
          >
            ¿Tenés un código de acceso en vez de usuario y contraseña?
          </button>
        </div>
      ) : (
        <div className="flex w-full max-w-xs flex-col gap-2.5">
          <input
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCodigo()}
            placeholder="Ej: COMOBIEN-0001"
            className="rounded-xl border px-4 py-3 text-center text-[15px] font-bold uppercase tracking-wide outline-none"
            style={{ backgroundColor: COLORS.fondoTarjeta, borderColor: COLORS.borde, color: COLORS.textoPrincipal }}
          />
          <button
            onClick={handleCodigo}
            className="rounded-2xl py-3 text-[13.5px] font-bold text-white"
            style={{ backgroundColor: COLORS.primario }}
          >
            Activar
          </button>
          {error && <p className="text-[12px] font-semibold" style={{ color: COLORS.error }}>{error}</p>}
          <button
            onClick={() => {
              setModo("login");
              setError("");
            }}
            className="mt-1 text-[12px] font-semibold underline"
            style={{ color: COLORS.textoTerciario }}
          >
            Ya tengo usuario y contraseña
          </button>
        </div>
      )}
    </div>
  );
}
