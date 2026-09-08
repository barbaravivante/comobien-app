import { useState } from "react";
import { ArrowLeft, Download, Upload, MessageCircle, Mail, HelpCircle, ChevronRight } from "lucide-react";
import { exportAllData, restoreAllData } from "../lib/storage";
import { COLORS, FONT_TITULOS } from "../theme";

// Datos de contacto de Barbara — si en algún momento cambia el WhatsApp o el
// email, alcanza con editar estos dos valores.
const CONTACT = {
  email: "barbaravivante@gmail.com",
  // Formato: 549 + código de área + número, sin espacios ni "+".
  whatsappNumber: "5492604355320",
};

export default function Tools({ onBack, onRestoreAll }) {
  const [backupStatus, setBackupStatus] = useState(null); // {type: 'ok'|'error', text}
  const [confirmingRestore, setConfirmingRestore] = useState(false);
  const [pendingData, setPendingData] = useState(null);

  const handleExport = () => {
    const payload = exportAllData();
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `comobien-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setBackupStatus({ type: "ok", text: "Copia de seguridad descargada." });
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (!parsed || typeof parsed !== "object") throw new Error("formato inválido");
      setPendingData(parsed);
      setConfirmingRestore(true);
    } catch {
      setBackupStatus({ type: "error", text: "Ese archivo no es una copia de seguridad válida." });
    }
    e.target.value = "";
  };

  const confirmRestore = () => {
    const restored = restoreAllData(pendingData);
    onRestoreAll?.(restored);
    setConfirmingRestore(false);
    setPendingData(null);
    setBackupStatus({ type: "ok", text: "Datos restaurados correctamente." });
  };

  return (
    <div className="flex flex-col gap-5 px-5 pb-28 pt-6">
      <div className="flex items-center gap-2">
        <button onClick={onBack} className="flex items-center gap-1.5 text-[13px] font-semibold" style={{ color: COLORS.textoSecundario }}>
          <ArrowLeft size={16} /> Volver
        </button>
      </div>
      <h2 className="text-[19px]" style={{ fontFamily: FONT_TITULOS, fontWeight: 600, color: COLORS.textoPrincipal }}>
        Herramientas
      </h2>

      <div className="flex flex-col gap-3">
        <a
          href="https://barbaravivante.com.ar/comobien-guia.html"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-2xl p-4 active:scale-[0.98] transition-transform"
          style={{ backgroundColor: COLORS.fondoTarjeta, border: `1px solid ${COLORS.borde}` }}
        >
          <div
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: COLORS.fondo }}
          >
            <HelpCircle size={17} color={COLORS.primario} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-bold" style={{ color: COLORS.textoPrincipal }}>Cómo usar ComoBien</p>
            <p className="text-[11.5px]" style={{ color: COLORS.textoSecundario }}>Guía paso a paso, con video</p>
          </div>
          <ChevronRight size={16} color={COLORS.navInactivo} />
        </a>

        <div className="rounded-2xl p-4" style={{ backgroundColor: COLORS.fondoTarjeta, border: `1px solid ${COLORS.borde}` }}>
          <p className="text-[13px] font-bold" style={{ color: COLORS.textoPrincipal }}>Copia de seguridad</p>
          <p className="mt-1 text-[12px]" style={{ color: COLORS.textoSecundario }}>
            Tus datos se guardan solo en este celular. Si vas a cambiar de dispositivo o desinstalar la app,
            descargá una copia antes para no perder nada.
          </p>

          <button
            onClick={handleExport}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-[13px] font-bold text-white active:scale-[0.98] transition-transform"
            style={{ backgroundColor: COLORS.primario }}
          >
            <Download size={15} /> Descargar copia de seguridad
          </button>

          <label
            className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl py-3 text-[13px] font-bold active:scale-[0.98] transition-transform"
            style={{ border: `1px solid ${COLORS.borde}`, color: COLORS.primario, backgroundColor: COLORS.fondoTarjeta }}
          >
            <Upload size={15} /> Restaurar desde un archivo
            <input type="file" accept="application/json" onChange={handleFileSelect} className="hidden" />
          </label>

          {backupStatus && (
            <p
              className="mt-2 text-[11.5px] font-semibold"
              style={{ color: backupStatus.type === "ok" ? COLORS.exito : COLORS.error }}
            >
              {backupStatus.text}
            </p>
          )}
        </div>

        {confirmingRestore && (
          <div className="rounded-2xl p-4" style={{ backgroundColor: COLORS.errorFondo }}>
            <p className="text-[13px] font-bold" style={{ color: COLORS.error }}>¿Restaurar esta copia?</p>
            <p className="mt-1 text-[12px]" style={{ color: COLORS.textoSecundario }}>
              Esto va a reemplazar tus datos actuales (perfil, peso y comidas registradas) por los del archivo.
              Esta acción no se puede deshacer.
            </p>
            <div className="mt-3 flex gap-2">
              <button
                onClick={confirmRestore}
                className="flex-1 rounded-xl py-2.5 text-[12.5px] font-bold text-white"
                style={{ backgroundColor: COLORS.error }}
              >
                Sí, reemplazar
              </button>
              <button
                onClick={() => {
                  setConfirmingRestore(false);
                  setPendingData(null);
                }}
                className="flex-1 rounded-xl py-2.5 text-[12.5px] font-bold"
                style={{ border: `1px solid ${COLORS.borde}`, color: COLORS.textoSecundario }}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        <div className="rounded-2xl p-4" style={{ backgroundColor: COLORS.fondoTarjeta, border: `1px solid ${COLORS.borde}` }}>
          <p className="text-[13px] font-bold" style={{ color: COLORS.textoPrincipal }}>¿Tenés dudas o encontraste un problema?</p>
          <p className="mt-1 text-[12px]" style={{ color: COLORS.textoSecundario }}>Escribile directo a Barbara, quien desarrolló ComoBien.</p>
          <div className="mt-3 flex gap-2">
            <a
              href={`https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent("Hola Barbara! Tengo una consulta sobre ComoBien.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl py-2.5 text-[12.5px] font-bold text-white active:scale-[0.98] transition-transform"
              style={{ backgroundColor: "#25D366" }}
            >
              <MessageCircle size={14} /> WhatsApp
            </a>
            <a
              href={`mailto:${CONTACT.email}?subject=${encodeURIComponent("Consulta sobre ComoBien")}`}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl py-2.5 text-[12.5px] font-bold active:scale-[0.98] transition-transform"
              style={{ border: `1px solid ${COLORS.borde}`, color: COLORS.primario, backgroundColor: COLORS.fondoTarjeta }}
            >
              <Mail size={14} /> Email
            </a>
          </div>
        </div>
      </div>

      <p className="text-center text-[11px] leading-relaxed" style={{ color: COLORS.textoTerciario }}>
        ComoBien no reemplaza el consejo de un/a profesional de la nutrición o la medicina.
      </p>
    </div>
  );
}
