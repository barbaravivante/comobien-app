import { useRef, useState } from "react";
import { Camera, Loader2, AlertTriangle, RotateCcw, ArrowLeft, History } from "lucide-react";
import { GRUPOS } from "../data/foods";
import { agruparPeso, generarRecomendaciones } from "../lib/recommendations";
import { leerTiquetLocal, prepararImagenParaOcr } from "../lib/ticketOcr";
import { loadTicketHistory, addTicketResult } from "../lib/storage";
import { COLORS, FONT_TITULOS } from "../theme";

function formatFecha(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("es-AR", { day: "numeric", month: "long" });
}

export default function TicketScan({ objetivo, onResult }) {
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  const handleFile = async (file) => {
    if (!file) return;
    setError("");
    setLoading(true);
    setProgreso(0);
    setResult(null);
    setPreviewUrl(URL.createObjectURL(file));
    try {
      const imagenLista = await prepararImagenParaOcr(file);
      const items = await leerTiquetLocal(imagenLista, setProgreso);
      const grouped = items.map((it) => ({ grupo: it.grupo, peso: 1 }));
      const { porGrupo, total } = agruparPeso(grouped);
      const rec = generarRecomendaciones({ porGrupo, total }, objetivo, "compra");
      addTicketResult({
        items: items.map((it) => ({ nombre: it.nombre, grupo: it.grupo })),
        mensaje: rec.mensaje,
        destacar: rec.destacar,
        sumar: rec.sumar,
      });
      setResult(items);
      onResult?.(items);
    } catch (e) {
      setError(
        "No pudimos leer el tiquet en este celular. Probá con más luz y que se lean bien los renglones, o revisá tu conexión a internet e intentá de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError("");
    setPreviewUrl(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 px-5 pb-28 pt-24 text-center">
        <Loader2 size={28} className="animate-spin" color={COLORS.primario} />
        <p className="text-[13.5px] font-semibold" style={{ color: COLORS.textoPrincipal }}>
          Leyendo tu tiquet{progreso > 0 ? `… ${progreso}%` : "…"}
        </p>
        <p className="max-w-xs text-[12.5px]" style={{ color: COLORS.textoTerciario }}>
          La primera vez puede tardar un poco más, mientras el celular descarga el lector de texto (después queda
          guardado y arranca más rápido).
        </p>
      </div>
    );
  }

  if (showHistory) {
    const historial = loadTicketHistory();
    return (
      <div className="flex flex-col gap-5 px-5 pb-28 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-[19px]" style={{ fontFamily: FONT_TITULOS, fontWeight: 600, color: COLORS.textoPrincipal }}>
            Tiquets anteriores
          </h2>
          <button onClick={() => setShowHistory(false)} className="flex items-center gap-1 text-[12.5px] font-semibold" style={{ color: COLORS.textoSecundario }}>
            <ArrowLeft size={14} /> Volver
          </button>
        </div>

        {historial.length === 0 && (
          <p className="text-[13px]" style={{ color: COLORS.textoTerciario }}>Todavía no escaneaste ningún tiquet.</p>
        )}

        <div className="flex flex-col gap-3">
          {historial.map((h) => (
            <div key={h.id} className="rounded-2xl p-4" style={{ backgroundColor: COLORS.fondoTarjeta, border: `1px solid ${COLORS.borde}` }}>
              <p className="mb-2 text-[13px] font-bold" style={{ color: COLORS.textoPrincipal }}>{formatFecha(h.fecha)}</p>

              {h.items?.length > 0 && (
                <div className="mb-3 flex flex-col gap-1.5">
                  {h.items.map((it, i) => (
                    <div key={i} className="flex items-center justify-between rounded-xl px-3 py-2" style={{ backgroundColor: COLORS.fondo }}>
                      <p className="text-[12.5px]" style={{ color: COLORS.textoPrincipal }}>{it.nombre}</p>
                      <span
                        className="rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
                        style={{ backgroundColor: GRUPOS[it.grupo]?.color || COLORS.navInactivo }}
                      >
                        {GRUPOS[it.grupo]?.label.split(",")[0] || it.grupo}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {(h.mensaje || h.destacar?.length > 0 || h.sumar?.length > 0) && (
                <div className="rounded-xl p-3" style={{ backgroundColor: COLORS.primario }}>
                  {h.mensaje && <p className="text-[12px]" style={{ color: COLORS.textoSobreVerde }}>{h.mensaje}</p>}
                  {h.destacar?.length > 0 && (
                    <div className="mb-1.5 mt-1.5">
                      <p className="mb-1 text-[10.5px] font-bold uppercase tracking-wide" style={{ color: COLORS.destacadoSobreVerde }}>Comprás de más</p>
                      {h.destacar.map((t, i) => (
                        <p key={i} className="mb-1 text-[11.5px] leading-relaxed last:mb-0" style={{ color: COLORS.textoSobreVerde }}>• {t}</p>
                      ))}
                    </div>
                  )}
                  {h.sumar?.length > 0 && (
                    <div className="mt-1.5">
                      <p className="mb-1 text-[10.5px] font-bold uppercase tracking-wide" style={{ color: COLORS.destacadoSobreVerde }}>Te conviene sumar</p>
                      {h.sumar.map((t, i) => (
                        <p key={i} className="mb-1 text-[11.5px] leading-relaxed last:mb-0" style={{ color: COLORS.textoSobreVerde }}>• {t}</p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (result) {
    const items = result.map((it) => ({ grupo: it.grupo, peso: 1 }));
    const { porGrupo, total } = agruparPeso(items);
    const rec = generarRecomendaciones({ porGrupo, total }, objetivo, "compra");

    return (
      <div className="flex flex-col gap-5 px-5 pb-28 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-[19px]" style={{ fontFamily: FONT_TITULOS, fontWeight: 600, color: COLORS.textoPrincipal }}>
            Resultado del tiquet
          </h2>
          <button onClick={reset} className="flex items-center gap-1 text-[12.5px] font-semibold" style={{ color: COLORS.textoSecundario }}>
            <RotateCcw size={14} /> Escanear otro
          </button>
        </div>

        {result.length === 0 && (
          <p className="text-[13px]" style={{ color: COLORS.textoTerciario }}>No pudimos identificar productos en la foto. Probá con más luz y que se lean bien los renglones.</p>
        )}

        {(rec.destacar.length > 0 || rec.sumar.length > 0 || rec.mensaje) && (
          <div className="rounded-2xl p-5" style={{ backgroundColor: COLORS.primario }}>
            {rec.mensaje && <p className="text-[13px]" style={{ color: COLORS.textoSobreVerde }}>{rec.mensaje}</p>}
            {rec.destacar.length > 0 && (
              <div className="mb-2">
                <p className="mb-1 text-[12px] font-bold uppercase tracking-wide" style={{ color: COLORS.destacadoSobreVerde }}>Comprás de más</p>
                {rec.destacar.map((t, i) => (
                  <p key={i} className="mb-1 text-[12.5px] leading-relaxed last:mb-0" style={{ color: COLORS.textoSobreVerde }}>• {t}</p>
                ))}
              </div>
            )}
            {rec.sumar.length > 0 && (
              <div>
                <p className="mb-1 text-[12px] font-bold uppercase tracking-wide" style={{ color: COLORS.destacadoSobreVerde }}>Te conviene sumar</p>
                {rec.sumar.map((t, i) => (
                  <p key={i} className="mb-1 text-[12.5px] leading-relaxed last:mb-0" style={{ color: COLORS.textoSobreVerde }}>• {t}</p>
                ))}
              </div>
            )}
          </div>
        )}

        {result.length > 0 && (
          <div>
            <p className="mb-2 text-[12.5px] font-semibold" style={{ color: COLORS.textoSecundario }}>Productos identificados ({result.length})</p>
            <div className="flex flex-col gap-1.5">
              {result.map((it, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl px-4 py-2.5" style={{ backgroundColor: COLORS.fondoTarjeta, border: `1px solid ${COLORS.borde}` }}>
                  <p className="text-[13px]" style={{ color: COLORS.textoPrincipal }}>{it.nombre}</p>
                  <span
                    className="rounded-full px-2.5 py-1 text-[10.5px] font-bold text-white"
                    style={{ backgroundColor: GRUPOS[it.grupo]?.color || COLORS.navInactivo }}
                  >
                    {GRUPOS[it.grupo]?.label.split(",")[0] || it.grupo}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 px-5 pb-28 pt-6">
      <h2 className="text-[19px]" style={{ fontFamily: FONT_TITULOS, fontWeight: 600, color: COLORS.textoPrincipal }}>
        Escanear tiquet del súper
      </h2>
      <p className="text-[13px]" style={{ color: COLORS.textoSecundario }}>
        Sacale una foto a tu tiquet de compra y te decimos, según tu objetivo, qué productos comprás de más y cuáles te
        conviene sumar.
      </p>

      {previewUrl && (
        <img src={previewUrl} alt="Tiquet" className="max-h-48 w-full rounded-xl object-contain" style={{ border: `1px solid ${COLORS.borde}` }} />
      )}

      {error && (
        <div className="flex items-start gap-2 rounded-xl p-3" style={{ backgroundColor: COLORS.errorFondo }}>
          <AlertTriangle size={16} color={COLORS.error} className="mt-0.5 shrink-0" />
          <p className="text-[12.5px]" style={{ color: COLORS.error }}>{error}</p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <button
        onClick={() => inputRef.current?.click()}
        className="flex items-center justify-center gap-2 rounded-2xl py-4 text-[14px] font-bold text-white active:scale-[0.98] transition-transform"
        style={{ backgroundColor: COLORS.primario }}
      >
        <Camera size={18} /> Sacar foto del tiquet
      </button>
      <button
        onClick={() => setShowHistory(true)}
        className="flex items-center justify-center gap-1.5 text-[12.5px] font-semibold"
        style={{ color: COLORS.textoSecundario }}
      >
        <History size={14} /> Ver tiquets anteriores
      </button>
      <p className="text-center text-[11px]" style={{ color: COLORS.textoTerciario }}>
        Tip: apoyá el tiquet en una superficie plana, con buena luz, y que se lean bien los nombres de los productos.
      </p>
    </div>
  );
}
