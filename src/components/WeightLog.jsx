import { useState } from "react";
import { calcularIMC, clasificarIMC } from "../lib/calculations";
import { COLORS, FONT_TITULOS } from "../theme";

export default function WeightLog({ profile, weightLog, onAdd }) {
  const [peso, setPeso] = useState("");

  const handleAdd = () => {
    const kg = Number(peso);
    if (!kg || kg <= 0) return;
    onAdd(kg);
    setPeso("");
  };

  const ordenado = weightLog.slice().reverse();
  const min = weightLog.length ? Math.min(...weightLog.map((e) => e.kg)) : profile.pesoKg;
  const max = weightLog.length ? Math.max(...weightLog.map((e) => e.kg)) : profile.pesoKg;
  const rango = Math.max(max - min, 1);

  return (
    <div className="flex flex-col gap-5 px-5 pb-28 pt-6">
      <h2 className="text-[19px]" style={{ fontFamily: FONT_TITULOS, fontWeight: 600, color: COLORS.textoPrincipal }}>
        Seguimiento de peso
      </h2>

      <div className="rounded-2xl p-4" style={{ backgroundColor: COLORS.fondoTarjeta, border: `1px solid ${COLORS.borde}` }}>
        <label className="mb-1.5 block text-[12.5px] font-semibold" style={{ color: COLORS.textoSecundario }}>Registrar peso de hoy</label>
        <div className="flex gap-2">
          <input
            type="number"
            value={peso}
            onChange={(e) => setPeso(e.target.value)}
            placeholder={`Ej: ${profile.pesoKg}`}
            className="flex-1 rounded-xl border px-4 py-3 text-[16px] font-bold outline-none"
            style={{ borderColor: COLORS.borde, color: COLORS.textoPrincipal }}
          />
          <button
            onClick={handleAdd}
            className="rounded-xl px-5 py-3 text-[13.5px] font-bold text-white"
            style={{ backgroundColor: COLORS.primario }}
          >
            Guardar
          </button>
        </div>
      </div>

      {weightLog.length > 1 && (
        <div className="rounded-2xl p-4" style={{ backgroundColor: COLORS.fondoTarjeta, border: `1px solid ${COLORS.borde}` }}>
          <p className="mb-3 text-[12.5px] font-semibold" style={{ color: COLORS.textoSecundario }}>Evolución</p>
          <div className="flex h-28 items-stretch gap-1.5">
            {weightLog.slice(-14).map((e, i) => {
              const alturaPct = ((e.kg - min) / rango) * 80 + 15;
              return (
                <div key={i} className="flex h-full flex-1 flex-col items-center justify-end">
                  <div
                    className="w-full rounded-t-sm"
                    style={{ height: `${alturaPct}%`, backgroundColor: COLORS.primarioClaro }}
                    title={`${e.kg}kg — ${e.fecha}`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div>
        <p className="mb-2 text-[12.5px] font-semibold" style={{ color: COLORS.textoSecundario }}>Historial</p>
        {ordenado.length === 0 && <p className="text-[13px]" style={{ color: COLORS.textoTerciario }}>Todavía no registraste tu peso.</p>}
        <div className="flex flex-col gap-1.5">
          {ordenado.map((e) => {
            const imc = calcularIMC({ pesoKg: e.kg, alturaCm: profile.alturaCm });
            return (
              <div key={e.fecha} className="flex items-center justify-between rounded-xl px-4 py-3" style={{ backgroundColor: COLORS.fondoTarjeta, border: `1px solid ${COLORS.borde}` }}>
                <div>
                  <p className="text-[13.5px] font-semibold" style={{ color: COLORS.textoPrincipal }}>{e.kg} kg</p>
                  <p className="text-[11.5px]" style={{ color: COLORS.textoTerciario }}>{e.fecha}</p>
                </div>
                <p className="text-[11.5px]" style={{ color: COLORS.textoTerciario }}>
                  IMC {imc} · {clasificarIMC(imc)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
