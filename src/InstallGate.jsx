import { useEffect, useState } from "react";
import { Download, Share, Leaf } from "lucide-react";
import { COLORS, FONT_IMPORT_URL, FONT_TITULOS, FONT_TEXTO } from "./theme";

// Pantalla que se muestra ANTES que nada (incluso antes de pedir el código de
// acceso) cuando alguien entra al link de ComoBien desde un navegador normal
// en vez de tener la app ya instalada. El objetivo: que la persona instale
// ComoBien en su celular en vez de usarla "suelta" desde una pestaña del
// navegador, para que quede claro que sus datos personales (peso, comidas)
// se guardan en SU propio dispositivo, nunca en un servidor nuestro.

const FONT_IMPORT = `@import url('${FONT_IMPORT_URL}');`;

const BYPASS_KEY = "comobien:install_gate_bypassed";
const WAIT_FOR_PROMPT_MS = 2500;

function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  );
}

function isIOS() {
  if (typeof window === "undefined") return false;
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent) && !window.MSStream;
}

function wasBypassed() {
  return localStorage.getItem(BYPASS_KEY) === "true";
}

export default function InstallGate({ children }) {
  const [installed, setInstalled] = useState(isStandalone());
  const [bypassed, setBypassed] = useState(wasBypassed());
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [promptShown, setPromptShown] = useState(false);
  const [checking, setChecking] = useState(!isIOS() && !isStandalone());

  useEffect(() => {
    if (installed || isIOS()) return;

    const onBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setChecking(false);
    };
    const onInstalled = () => {
      setInstalled(true);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);

    const t = setTimeout(() => setChecking(false), WAIT_FOR_PROMPT_MS);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBypass = () => {
    localStorage.setItem(BYPASS_KEY, "true");
    setBypassed(true);
  };

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setPromptShown(true);
  };

  if (installed || bypassed) return children;

  return (
    <div
      className="flex min-h-screen w-full flex-col items-center justify-center gap-5 px-6 text-center"
      style={{ backgroundColor: COLORS.fondo, fontFamily: FONT_TEXTO }}
    >
      <style>{FONT_IMPORT}</style>
      <div className="flex h-16 w-16 items-center justify-center rounded-full" style={{ backgroundColor: COLORS.primario }}>
        <Leaf size={26} color="#fff" />
      </div>
      <div>
        <h1 className="text-[22px]" style={{ fontFamily: FONT_TITULOS, fontWeight: 600, color: COLORS.textoPrincipal }}>
          Instalá ComoBien en tu celular
        </h1>
        <p className="mx-auto mt-1.5 max-w-xs text-[13px]" style={{ color: COLORS.textoSecundario }}>
          Es rápido y hace que la app se abra como cualquier otra de tu celular. Tus datos de peso
          y comidas quedan guardados únicamente en este dispositivo, nunca en un servidor.
        </p>
      </div>

      <div className="flex w-full max-w-xs flex-col gap-2.5">
        {isIOS() ? (
          <div className="flex flex-col gap-3 rounded-2xl p-4 text-left" style={{ backgroundColor: COLORS.fondoTarjeta }}>
            <p className="flex items-center gap-1.5 text-[13px]" style={{ color: COLORS.textoPrincipal }}>
              1. Tocá el ícono de compartir <Share size={14} className="inline" /> abajo en Safari.
            </p>
            <p className="text-[13px]" style={{ color: COLORS.textoPrincipal }}>2. Elegí "Agregar a pantalla de inicio".</p>
            <p className="text-[13px]" style={{ color: COLORS.textoPrincipal }}>3. Abrí ComoBien desde ese nuevo ícono.</p>
          </div>
        ) : checking ? (
          <p className="text-[12.5px]" style={{ color: COLORS.textoTerciario }}>Preparando la instalación…</p>
        ) : deferredPrompt && !promptShown ? (
          <button
            onClick={handleInstallClick}
            className="flex items-center justify-center gap-2 rounded-2xl py-3.5 text-[13.5px] font-bold text-white active:scale-[0.98] transition-transform"
            style={{ backgroundColor: COLORS.primario }}
          >
            <Download size={16} /> Instalar app
          </button>
        ) : promptShown ? (
          <div className="rounded-2xl p-4 text-[13px]" style={{ backgroundColor: COLORS.fondoTarjeta, color: COLORS.textoPrincipal }}>
            Buscá el ícono de ComoBien en tu pantalla de inicio y abrila desde ahí.
          </div>
        ) : (
          <div className="rounded-2xl p-4 text-[13px]" style={{ backgroundColor: COLORS.fondoTarjeta, color: COLORS.textoPrincipal }}>
            Este navegador no permite instalar la app automáticamente. Podés seguir usándola desde
            acá: tus datos van a quedar guardados igual, solo en este dispositivo.
          </div>
        )}

        <button
          onClick={handleBypass}
          className="mt-1 py-2 text-[12px] font-semibold underline"
          style={{ color: COLORS.textoTerciario }}
        >
          {isIOS() || (!deferredPrompt && !checking)
            ? "Ya la agregué / continuar en este navegador"
            : "Continuar en este navegador"}
        </button>
      </div>
    </div>
  );
}
