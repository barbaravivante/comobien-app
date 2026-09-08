import { useState } from "react";
import { Leaf } from "lucide-react";
import { ACTIVIDAD_FACTORES, OBJETIVOS, validarDatosCuerpo } from "../lib/calculations";
import { COLORS, FONT_TITULOS } from "../theme";

const inputStyle = { backgroundColor: COLORS.fondoTarjeta, borderColor: COLORS.borde, color: COLORS.textoPrincipal };
const inputClass = "w-full rounded-xl border px-4 py-3 text-[15px] outline-none";
const labelStyle = { color: COLORS.textoSecundario };
const labelClass = "text-[12.5px] font-semibold mb-1.5 block";

function OpcionBoton({ activo, children, ...props }) {
  return (
    <button
      {...props}
      className="flex-1 rounded-xl py-3 text-[13.5px] font-semibold"
      style={{
        backgroundColor: activo ? COLORS.primario : COLORS.fondoTarjeta,
        color: activo ? "#fff" : COLORS.textoPrincipal,
        border: `1px solid ${COLORS.borde}`,
      }}
    >
      {children}
    </button>
  );
}

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    nombre: "",
    sexo: "F",
    edad: "",
    alturaCm: "",
    pesoKg: "",
    actividad: "sedentario",
    objetivo: "mantener",
  });
  const [error, setError] = useState("");

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const steps = ["Datos básicos", "Actividad y objetivo"];

  const validateStep0 = () => {
    if (!form.edad || !form.alturaCm || !form.pesoKg) {
      setError("Completá edad, altura y peso para continuar.");
      return false;
    }
    const errores = validarDatosCuerpo({
      edad: Number(form.edad),
      alturaCm: Number(form.alturaCm),
      pesoKg: Number(form.pesoKg),
    });
    if (errores.length > 0) {
      setError(errores[0]);
      return false;
    }
    setError("");
    return true;
  };

  const handleNext = () => {
    if (step === 0 && !validateStep0()) return;
    setStep(1);
  };

  const handleFinish = () => {
    onComplete({
      ...form,
      edad: Number(form.edad),
      alturaCm: Number(form.alturaCm),
      pesoKg: Number(form.pesoKg),
    });
  };

  return (
    <div className="min-h-screen w-full px-6 py-10" style={{ backgroundColor: COLORS.fondo }}>
      <div className="mx-auto max-w-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full" style={{ backgroundColor: COLORS.primario }}>
            <Leaf size={22} color="#fff" />
          </div>
          <h1 className="text-[22px]" style={{ fontFamily: FONT_TITULOS, fontWeight: 600, color: COLORS.textoPrincipal }}>
            Contanos un poco de vos
          </h1>
          <p className="mt-1 text-[13px]" style={{ color: COLORS.textoSecundario }}>
            Con estos datos calculamos tus calorías y metas diarias. Podés cambiarlos cuando quieras.
          </p>
        </div>

        <div className="mb-5 flex gap-1.5">
          {steps.map((_, i) => (
            <div
              key={i}
              className="h-1.5 flex-1 rounded-full"
              style={{ backgroundColor: i <= step ? COLORS.primario : COLORS.borde }}
            />
          ))}
        </div>

        {step === 0 && (
          <div className="flex flex-col gap-4">
            <div>
              <label className={labelClass} style={labelStyle}>¿Cómo te llamás? (opcional)</label>
              <input className={inputClass} style={inputStyle} value={form.nombre} onChange={(e) => update("nombre", e.target.value)} placeholder="Tu nombre" />
            </div>
            <div>
              <label className={labelClass} style={labelStyle}>Sexo</label>
              <div className="flex gap-2">
                {[{ v: "F", l: "Femenino" }, { v: "M", l: "Masculino" }].map((op) => (
                  <OpcionBoton key={op.v} activo={form.sexo === op.v} onClick={() => update("sexo", op.v)}>
                    {op.l}
                  </OpcionBoton>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className={labelClass} style={labelStyle}>Edad</label>
                <input type="number" className={inputClass} style={inputStyle} value={form.edad} onChange={(e) => update("edad", e.target.value)} placeholder="Años" />
              </div>
              <div className="flex-1">
                <label className={labelClass} style={labelStyle}>Altura en cm</label>
                <input type="number" className={inputClass} style={inputStyle} value={form.alturaCm} onChange={(e) => update("alturaCm", e.target.value)} placeholder="Ej: 165 (no 1,65)" />
              </div>
            </div>
            <div>
              <label className={labelClass} style={labelStyle}>Peso actual (kg)</label>
              <input type="number" className={inputClass} style={inputStyle} value={form.pesoKg} onChange={(e) => update("pesoKg", e.target.value)} placeholder="Ej: 70" />
            </div>
            {error && <p className="text-[12px] font-semibold" style={{ color: COLORS.error }}>{error}</p>}
            <button
              onClick={handleNext}
              className="mt-2 rounded-2xl py-3.5 text-[14px] font-bold text-white active:scale-[0.98] transition-transform"
              style={{ backgroundColor: COLORS.primario }}
            >
              Continuar
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-4">
            <div>
              <label className={labelClass} style={labelStyle}>Nivel de actividad física</label>
              <div className="flex flex-col gap-2">
                {Object.entries(ACTIVIDAD_FACTORES).map(([key, v]) => (
                  <button
                    key={key}
                    onClick={() => update("actividad", key)}
                    className="rounded-xl px-4 py-3 text-left text-[13.5px] font-medium"
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
              <label className={labelClass} style={labelStyle}>Tu objetivo principal</label>
              <div className="flex flex-col gap-2">
                {Object.entries(OBJETIVOS).map(([key, v]) => (
                  <button
                    key={key}
                    onClick={() => update("objetivo", key)}
                    className="rounded-xl px-4 py-3 text-left text-[13.5px] font-medium"
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
            <div className="flex gap-2">
              <button
                onClick={() => setStep(0)}
                className="flex-1 rounded-2xl py-3.5 text-[14px] font-bold"
                style={{ backgroundColor: COLORS.fondoTarjeta, color: COLORS.textoPrincipal, border: `1px solid ${COLORS.borde}` }}
              >
                Atrás
              </button>
              <button
                onClick={handleFinish}
                className="flex-[2] rounded-2xl py-3.5 text-[14px] font-bold text-white active:scale-[0.98] transition-transform"
                style={{ backgroundColor: COLORS.primario }}
              >
                Empezar
              </button>
            </div>
          </div>
        )}

        <p className="mt-6 text-center text-[11px] leading-relaxed" style={{ color: COLORS.textoTerciario }}>
          ComoBien no reemplaza el consejo de un/a profesional de la nutrición o la medicina. Ante
          cualquier condición de salud particular, consultá siempre con un especialista.
        </p>
      </div>
    </div>
  );
}
