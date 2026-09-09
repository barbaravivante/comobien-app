import { useMemo, useState } from "react";
import { Search, Plus, X, ArrowLeft, AlertTriangle } from "lucide-react";
import { searchFoods, calcPorcion } from "../data/foods";
import { GRUPOS } from "../data/foods";
import { calcularMacros } from "../lib/calculations";
import { COLORS, FONT_TITULOS } from "../theme";

export default function FoodLog({ foodToday, profile, onAdd, onRemove }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [gramos, setGramos] = useState("");

  const results = useMemo(() => (query ? searchFoods(query).slice(0, 20) : []), [query]);

  const kcalObjetivo = useMemo(() => calcularMacros(profile).kcalObjetivo, [profile]);
  const kcalHoy = useMemo(() => foodToday.reduce((acc, e) => acc + (e.kcal || 0), 0), [foodToday]);

  const handleSelect = (food) => {
    setSelected(food);
    setGramos(String(food.porcion));
  };

  const handleConfirm = () => {
    const g = Number(gramos);
    if (!g || g <= 0) return;
    const calc = calcPorcion(selected, g);
    onAdd({
      foodId: selected.id,
      nombre: selected.nombre,
      grupo: selected.grupo,
      gramos: g,
      ...calc,
    });
    setSelected(null);
    setQuery("");
    setGramos("");
  };

  if (selected) {
    const g = Number(gramos) || 0;
    const calc = calcPorcion(selected, g);
    return (
      <div className="flex flex-col gap-5 px-5 pb-28 pt-6">
        <button onClick={() => setSelected(null)} className="flex w-fit items-center gap-1.5 text-[13px] font-semibold" style={{ color: COLORS.textoSecundario }}>
          <ArrowLeft size={16} /> Volver a buscar
        </button>
        <div>
          <h2 className="text-[19px]" style={{ fontFamily: FONT_TITULOS, fontWeight: 600, color: COLORS.textoPrincipal }}>
            {selected.nombre}
          </h2>
          <p className="text-[12.5px]" style={{ color: COLORS.textoTerciario }}>{GRUPOS[selected.grupo]?.label}</p>
        </div>

        <div>
          <label className="mb-1.5 block text-[12.5px] font-semibold" style={{ color: COLORS.textoSecundario }}>Cantidad (gramos o ml)</label>
          <input
            type="number"
            autoFocus
            value={gramos}
            onChange={(e) => setGramos(e.target.value)}
            className="w-full rounded-xl border px-4 py-3 text-[18px] font-bold outline-none"
            style={{ backgroundColor: COLORS.fondoTarjeta, borderColor: COLORS.borde, color: COLORS.textoPrincipal }}
          />
          <p className="mt-1.5 text-[12px]" style={{ color: COLORS.textoTerciario }}>Porción habitual: {selected.porcionLabel} (~{selected.porcion}g)</p>
        </div>

        <div className="rounded-2xl p-4" style={{ backgroundColor: COLORS.fondoTarjeta, border: `1px solid ${COLORS.borde}` }}>
          <p className="mb-2 text-[12.5px] font-semibold" style={{ color: COLORS.textoSecundario }}>Aporte de esta cantidad</p>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div>
              <p className="text-[16px] font-bold" style={{ color: COLORS.textoPrincipal }}>{calc.kcal}</p>
              <p className="text-[10.5px]" style={{ color: COLORS.textoTerciario }}>kcal</p>
            </div>
            <div>
              <p className="text-[16px] font-bold" style={{ color: COLORS.textoPrincipal }}>{calc.prot}g</p>
              <p className="text-[10.5px]" style={{ color: COLORS.textoTerciario }}>Prot.</p>
            </div>
            <div>
              <p className="text-[16px] font-bold" style={{ color: COLORS.textoPrincipal }}>{calc.carb}g</p>
              <p className="text-[10.5px]" style={{ color: COLORS.textoTerciario }}>Carb.</p>
            </div>
            <div>
              <p className="text-[16px] font-bold" style={{ color: COLORS.textoPrincipal }}>{calc.grasa}g</p>
              <p className="text-[10.5px]" style={{ color: COLORS.textoTerciario }}>Grasas</p>
            </div>
          </div>
        </div>

        {kcalHoy + calc.kcal > kcalObjetivo && (
          <div className="flex items-start gap-2 rounded-xl p-3" style={{ backgroundColor: COLORS.errorFondo }}>
            <AlertTriangle size={16} color={COLORS.error} className="mt-0.5 shrink-0" />
            <p className="text-[12.5px]" style={{ color: COLORS.error }}>
              Con este alimento vas a superar tu objetivo diario ({kcalHoy + calc.kcal} / {kcalObjetivo} kcal).
            </p>
          </div>
        )}

        <button
          onClick={handleConfirm}
          disabled={!g}
          className="rounded-2xl py-3.5 text-[14px] font-bold text-white disabled:opacity-40"
          style={{ backgroundColor: COLORS.primario }}
        >
          Agregar al registro de hoy
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 px-5 pb-28 pt-6">
      <h2 className="text-[19px]" style={{ fontFamily: FONT_TITULOS, fontWeight: 600, color: COLORS.textoPrincipal }}>
        Registrar comida
      </h2>

      <div className="relative">
        <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2" color={COLORS.textoTerciario} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscá un alimento (ej: arroz, pollo, manzana)"
          className="w-full rounded-xl border py-3 pl-10 pr-4 text-[14px] outline-none"
          style={{ backgroundColor: COLORS.fondoTarjeta, borderColor: COLORS.borde, color: COLORS.textoPrincipal }}
        />
      </div>

      {query && (
        <div className="flex flex-col gap-1.5">
          {results.length === 0 && <p className="text-[13px]" style={{ color: COLORS.textoTerciario }}>No encontramos ese alimento en la base de datos.</p>}
          {results.map((f) => (
            <button
              key={f.id}
              onClick={() => handleSelect(f)}
              className="flex items-center justify-between rounded-xl px-4 py-3 text-left"
              style={{ backgroundColor: COLORS.fondoTarjeta, border: `1px solid ${COLORS.borde}` }}
            >
              <div>
                <p className="text-[13.5px] font-semibold" style={{ color: COLORS.textoPrincipal }}>{f.nombre}</p>
                <p className="text-[11.5px]" style={{ color: COLORS.textoTerciario }}>{f.kcal100} kcal / 100g · {f.porcionLabel}</p>
              </div>
              <Plus size={18} color={COLORS.primario} />
            </button>
          ))}
        </div>
      )}

      {!query && (
        <div>
          <p className="mb-2 text-[12.5px] font-semibold" style={{ color: COLORS.textoSecundario }}>Hoy registraste</p>
          {kcalHoy > kcalObjetivo && (
            <div className="mb-2 flex items-start gap-2 rounded-xl p-3" style={{ backgroundColor: COLORS.errorFondo }}>
              <AlertTriangle size={16} color={COLORS.error} className="mt-0.5 shrink-0" />
              <p className="text-[12.5px]" style={{ color: COLORS.error }}>
                Ya superaste tu objetivo diario ({kcalHoy} / {kcalObjetivo} kcal).
              </p>
            </div>
          )}
          {foodToday.length === 0 && <p className="text-[13px]" style={{ color: COLORS.textoTerciario }}>Todavía no registraste ninguna comida hoy.</p>}
          <div className="flex flex-col gap-1.5">
            {foodToday
              .slice()
              .reverse()
              .map((e) => (
                <div key={e.id} className="flex items-center justify-between rounded-xl px-4 py-3" style={{ backgroundColor: COLORS.fondoTarjeta, border: `1px solid ${COLORS.borde}` }}>
                  <div>
                    <p className="text-[13.5px] font-semibold" style={{ color: COLORS.textoPrincipal }}>{e.nombre}</p>
                    <p className="text-[11.5px]" style={{ color: COLORS.textoTerciario }}>
                      {e.gramos}g · {e.kcal} kcal
                    </p>
                  </div>
                  <button onClick={() => onRemove(e.id)} className="p-1">
                    <X size={16} color={COLORS.navInactivo} />
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
