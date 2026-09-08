import { useState } from "react";
import { Wrench, ChevronRight } from "lucide-react";
import { ACTIVIDAD_FACTORES, OBJETIVOS, calcularMacros, calcularIMC, clasificarIMC, validarDatosCuerpo } from "../lib/calculations";
import { COLORS, FONT_TITULOS } from "../theme";

const inputStyle = { backgroundColor: COLORS.fondoTarjeta, borderColor: COLORS.borde, color: COLORS.textoPrincipal };
const inputClass = "w-full rounded-xl border px-4 py-3 text-[15px] outline-none";
const labelStyle = { color: COLORS.textoSecundario };
const labelClass = "text-[12.5px] font-semibold mb-1.5 block";

export default function Profile({ profile, onSave, onNavigate }) {
  const [form, setForm] = useState(profile);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

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

      <button
        onClick={() => onNavigate?.("herramientas")}
        className="flex items-center gap-3 rounded-2xl p-4 active:scale-[0.98] transition-transform"
        style={{ backgroundColor: COLORS.fondoTarjeta, border: `1px solid ${COLORS.borde}` }}
      >
        <div
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: COLORS.fondo }}
        >
          <Wrench size={16} color={COLORS.primario} />
        </div>
        <div className="min-w-0 flex-1 text-left">
          <p className="text-[13px] font-bold" style={{ color: COLORS.textoPrincipal }}>Herramientas</p>
          <p className="text-[11.5px]" style={{ color: COLORS.textoSecundario }}>Guía de uso, copia de seguridad y contacto</p>
        </div>
        <ChevronRight size={16} color={COLORS.navInactivo} />
      </button>

      <p className="text-center text-[11px] leading-relaxed" style={{ color: COLORS.textoTerciario }}>
        ComoBien no reemplaza el consejo de un/a profesional de la nutrición o la medicina.
      </p>
    </div>
  );
}
