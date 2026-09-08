import { useState } from "react";
import { Download, Upload, MessageCircle, Mail } from "lucide-react";
import { ACTIVIDAD_FACTORES, OBJETIVOS, calcularMacros, calcularIMC, clasificarIMC, validarDatosCuerpo } from "../lib/calculations";
import { exportAllData, restoreAllData } from "../lib/storage";
import { COLORS, FONT_TITULOS } from "../theme";

const inputStyle = { backgroundColor: COLORS.fondoTarjeta, borderColor: COLORS.borde, color: COLORS.textoPrincipal };
const inputClass = "w-full rounded-xl border px-4 py-3 text-[15px] outline-none";
const labelStyle = { color: COLORS.textoSecundario };
const labelClass = "text-[12.5px] font-semibold mb-1.5 block";

// Datos de contacto de Barbara — si en algún momento cambia el WhatsApp o el
// email, alcanza con editar estos dos valores.
const CONTACT = {
  email: "barbaravivante@gmail.com",
  // Formato: 549 + código de área + número, sin espacios ni "+".
  whatsappNumber: "5492604355320",
};

export default function Profile({ profile, onSave, onRestoreAll }) {
  const [form, setForm] = useState(profile);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [backupStatus, setBackupStatus] = useState(null); // {type: 'ok'|'error', text}
  const [confirmingRestore, setConfirmingRestore] = useState(false);
  const [pendingData, setPendingData] = useState(null);

  const update = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setSaved(false);
    setError("");
  };

  const handleSave = () => {
    const datos = {
      edad: Number(form.edad),
      alturaCm: Number(form.alturaCm),
      pesoKg: Number(form.pesoKg),
    };
    const errores = validarDatosCuerpo(datos);
    if (errores.length > 0) {
      setError(errores[0]);
      return;
    }
    onSave({ ...form, ...datos });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const datosValidos =
    validarDatosCuerpo({
      edad: Number(form.edad),
      alturaCm: Number(form.alturaCm),
      pesoKg: Number(form.pesoKg),
    }).length === 0;

  const macros = datosValidos
    ? calcularMacros({ ...form, edad: Number(form.edad), alturaCm: Number(form.alturaCm), pesoKg: Number(form.pesoKg) })
    : null;
  const imc = datosValidos ? calcularIMC({ pesoKg: Number(form.pesoKg), alturaCm: Number(form.alturaCm) }) : null;

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
    setForm(restored.profile || form);
    setConfirmingRestore(false);
    setPendingData(null);
    setBackupStatus({ type: "ok", text: "Datos restaurados correctamente." });
  };

  return (
    <div className="flex flex-col gap-5 px-5 pb-28 pt-6">
      <h2 className="text-[19px]" style={{ fontFamily: FONT_TITULOS, fontWeight: 600, color: COLORS.textoPrincipal }}>
        Tu perfil
      </h2>

      <div className="rounded-2xl p-4" style={{ backgroundColor: COLORS.fondoTarjeta, border: `1px solid ${COLORS.borde}` }}>
        <p className="mb-2 text-[12.5px] font-semibold" style={{ color: COLORS.textoSecundario }}>Tus metas calculadas</p>
        <div className="grid grid-cols-2 gap-3 text-center">
          <div>
            <p className="text-[18px] font-bold" style={{ color: COLORS.textoPrincipal }}>{datosValidos ? macros.kcalObjetivo : "—"}</p>
            <p className="text-[10.5px]" style={{ color: COLORS.textoTerciario }}>kcal / día</p>
          </div>
          <div>
            <p className="text-[18px] font-bold" style={{ color: COLORS.textoPrincipal }}>{datosValidos ? imc : "—"}</p>
            <p className="text-[10.5px]" style={{ color: COLORS.textoTerciario }}>IMC{datosValidos ? ` · ${clasificarIMC(imc)}` : ""}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <label className={labelClass} style={labelStyle}>Nombre</label>
          <input className={inputClass} style={inputStyle} value={form.nombre} onChange={(e) => update("nombre", e.target.value)} />
        </div>
        <div>
          <label className={labelClass} style={labelStyle}>Sexo</label>
          <div className="flex gap-2">
            {[{ v: "F", l: "Femenino" }, { v: "M", l: "Masculino" }].map((op) => (
              <button
                key={op.v}
                onClick={() => update("sexo", op.v)}
                className="flex-1 rounded-xl py-3 text-[13.5px] font-semibold"
                style={{
                  backgroundColor: form.sexo === op.v ? COLORS.primario : COLORS.fondoTarjeta,
                  color: form.sexo === op.v ? "#fff" : COLORS.textoPrincipal,
                  border: `1px solid ${COLORS.borde}`,
                }}
              >
                {op.l}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-3">
          <div className="flex-1">
            <label className={labelClass} style={labelStyle}>Edad</label>
            <input type="number" className={inputClass} style={inputStyle} value={form.edad} onChange={(e) => update("edad", e.target.value)} />
          </div>
          <div className="flex-1">
            <label className={labelClass} style={labelStyle}>Altura en cm</label>
            <input type="number" className={inputClass} style={inputStyle} value={form.alturaCm} onChange={(e) => update("alturaCm", e.target.value)} placeholder="Ej: 165 (no 1,65)" />
          </div>
        </div>
        <div>
          <label className={labelClass} style={labelStyle}>Peso (kg)</label>
          <input type="number" className={inputClass} style={inputStyle} value={form.pesoKg} onChange={(e) => update("pesoKg", e.target.value)} />
        </div>
        <div>
          <label className={labelClass} style={labelStyle}>Actividad física</label>
          <div className="flex flex-col gap-2">
            {Object.entries(ACTIVIDAD_FACTORES).map(([key, v]) => (
              <button
                key={key}
                onClick={() => update("actividad", key)}
                className="rounded-xl px-4 py-3 text-left text-[13px] font-medium"
                style={{
                  backgroundColor: form.actividad === key ? COLORS.primario : COLORS.fondoTarjeta,
                  color: form.actividad === key ? "#fff" : COLORS.textoPrincipal,
                  border: `1px solid ${COLORS.borde}`,
                }}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className={labelClass} style={labelStyle}>Objetivo</label>
          <div className="flex flex-col gap-2">
            {Object.entries(OBJETIVOS).map(([key, v]) => (
              <button
                key={key}
                onClick={() => update("objetivo", key)}
                className="rounded-xl px-4 py-3 text-left text-[13px] font-medium"
                style={{
                  backgroundColor: form.objetivo === key ? COLORS.primario : COLORS.fondoTarjeta,
                  color: form.objetivo === key ? "#fff" : COLORS.textoPrincipal,
                  border: `1px solid ${COLORS.borde}`,
                }}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-[12px] font-semibold" style={{ color: COLORS.error }}>{error}</p>}

        <button
          onClick={handleSave}
          className="rounded-2xl py-3.5 text-[14px] font-bold text-white active:scale-[0.98] transition-transform"
          style={{ backgroundColor: saved ? COLORS.exito : COLORS.primario }}
        >
          {saved ? "✓ Guardado" : "Guardar cambios"}
        </button>
      </div>

      <div>
        <h2 className="mb-3 text-[16px]" style={{ fontFamily: FONT_TITULOS, fontWeight: 600, color: COLORS.textoPrincipal }}>
          Herramientas
        </h2>

        <div className="flex flex-col gap-3">
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
      </div>

      <p className="text-center text-[11px] leading-relaxed" style={{ color: COLORS.textoTerciario }}>
        ComoBien no reemplaza el consejo de un/a profesional de la nutrición o la medicina.
      </p>
    </div>
  );
}
