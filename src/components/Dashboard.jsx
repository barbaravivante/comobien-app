import { calcularMacros, calcularIMC, clasificarIMC } from "../lib/calculations";
import { agruparPeso, generarRecomendaciones } from "../lib/recommendations";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import { COLORS, FONT_TITULOS } from "../theme";

function Bar({ label, value, target, unit, color }) {
  const pct = target > 0 ? Math.min((value / target) * 100, 100) : 0;
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between">
        <span className="text-[12.5px] font-semibold" style={{ color: COLORS.textoSecundario }}>{label}</span>
        <span className="text-[12px]" style={{ color: COLORS.textoTerciario }}>
          {value}
          {unit} / {target}
          {unit}
        </span>
      </div>
      <div className="h-2 w-full rounded-full" style={{ backgroundColor: COLORS.borde }}>
        <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

export default function Dashboard({ profile, foodToday, weightLog, onNavigate }) {
  const macros = calcularMacros(profile);
  const totales = foodToday.reduce(
    (acc, e) => ({
      kcal: acc.kcal + (e.kcal || 0),
      prot: acc.prot + (e.prot || 0),
      carb: acc.carb + (e.carb || 0),
      grasa: acc.grasa + (e.grasa || 0),
    }),
    { kcal: 0, prot: 0, carb: 0, grasa: 0 }
  );

  const ultimoPeso = weightLog.length ? weightLog[weightLog.length - 1].kg : profile.pesoKg;
  const imc = calcularIMC({ pesoKg: ultimoPeso, alturaCm: profile.alturaCm });
  const claseImc = clasificarIMC(imc);

  const previoPeso = weightLog.length > 1 ? weightLog[weightLog.length - 2].kg : profile.pesoKg;
  const deltaPeso = +(ultimoPeso - previoPeso).toFixed(1);

  const items = foodToday.map((e) => ({ grupo: e.grupo, peso: e.kcal || 1 }));
  const { porGrupo, total } = agruparPeso(items);
  const rec = generarRecomendaciones({ porGrupo, total }, profile.objetivo, "diario");

  return (
    <div className="flex flex-col gap-5 px-5 pb-28 pt-6">
      <div>
        <p className="text-[13px]" style={{ color: COLORS.textoSecundario }}>Hola{profile.nombre ? `, ${profile.nombre}` : ""} 👋</p>
        <h1 className="text-[21px]" style={{ fontFamily: FONT_TITULOS, fontWeight: 600, color: COLORS.textoPrincipal }}>
          Tu resumen de hoy
        </h1>
      </div>

      <div className="rounded-2xl p-5" style={{ backgroundColor: COLORS.fondoTarjeta, border: `1px solid ${COLORS.borde}` }}>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="text-[12px] font-semibold" style={{ color: COLORS.textoTerciario }}>Calorías de hoy</p>
            <p className="text-[28px] font-bold" style={{ color: COLORS.textoPrincipal }}>
              {Math.round(totales.kcal)} <span className="text-[15px] font-normal" style={{ color: COLORS.textoTerciario }}>/ {macros.kcalObjetivo} kcal</span>
            </p>
          </div>
          <button
            onClick={() => onNavigate("comida")}
            className="rounded-xl px-3.5 py-2 text-[12.5px] font-bold text-white"
            style={{ backgroundColor: COLORS.primario }}
          >
            + Registrar
          </button>
        </div>
        <div className="flex flex-col gap-3">
          <Bar label="Proteínas" value={Math.round(totales.prot)} target={macros.protGr} unit="g" color={COLORS.colorProteinas} />
          <Bar label="Carbohidratos" value={Math.round(totales.carb)} target={macros.carbGr} unit="g" color={COLORS.colorCarbohidratos} />
          <Bar label="Grasas" value={Math.round(totales.grasa)} target={macros.grasaGr} unit="g" color={COLORS.colorGrasas} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onNavigate("peso")}
          className="rounded-2xl p-4 text-left"
          style={{ backgroundColor: COLORS.fondoTarjeta, border: `1px solid ${COLORS.borde}` }}
        >
          <p className="text-[12px] font-semibold" style={{ color: COLORS.textoTerciario }}>Peso actual</p>
          <div className="mt-1 flex items-center gap-1.5">
            <p className="text-[20px] font-bold" style={{ color: COLORS.textoPrincipal }}>{ultimoPeso} kg</p>
            {deltaPeso !== 0 && (
              <span className="flex items-center text-[12px] font-semibold" style={{ color: deltaPeso < 0 ? COLORS.exito : COLORS.colorProteinas }}>
                {deltaPeso < 0 ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
                {Math.abs(deltaPeso)}
              </span>
            )}
            {deltaPeso === 0 && <Minus size={14} color={COLORS.navInactivo} />}
          </div>
        </button>
        <div className="rounded-2xl p-4" style={{ backgroundColor: COLORS.fondoTarjeta, border: `1px solid ${COLORS.borde}` }}>
          <p className="text-[12px] font-semibold" style={{ color: COLORS.textoTerciario }}>IMC</p>
          <p className="mt-1 text-[20px] font-bold" style={{ color: COLORS.textoPrincipal }}>{imc}</p>
          <p className="text-[11.5px]" style={{ color: COLORS.textoTerciario }}>{claseImc}</p>
        </div>
      </div>

      <div className="rounded-2xl p-5" style={{ backgroundColor: COLORS.primario }}>
        <p className="mb-2 text-[13px] font-bold text-white">Recomendación de hoy</p>
        {rec.mensaje && <p className="text-[13px]" style={{ color: COLORS.textoSobreVerde }}>{rec.mensaje}</p>}
        {[...rec.destacar, ...rec.sumar].slice(0, 2).map((t, i) => (
          <p key={i} className="mb-1.5 text-[12.5px] leading-relaxed last:mb-0" style={{ color: COLORS.textoSobreVerde }}>
            • {t}
          </p>
        ))}
        {total === 0 && <p className="text-[12.5px]" style={{ color: COLORS.textoSobreVerde }}>Registrá tus comidas para recibir recomendaciones personalizadas.</p>}
      </div>

      <button
        onClick={() => onNavigate("tiquet")}
        className="rounded-2xl border-2 border-dashed p-5 text-left"
        style={{ borderColor: COLORS.navInactivo }}
      >
        <p className="text-[13.5px] font-bold" style={{ color: COLORS.textoPrincipal }}>📸 Escaneá tu tiquet del súper</p>
        <p className="mt-1 text-[12.5px]" style={{ color: COLORS.textoSecundario }}>
          Sacale una foto al tiquet y te decimos qué comprás de más y qué te conviene sumar.
        </p>
      </button>
    </div>
  );
}
