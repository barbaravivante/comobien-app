// Genera recomendaciones simples en base a las Guías Alimentarias para la
// Población Argentina (GAPA): priorizar verduras y frutas, elegir cereales
// integrales y legumbres, incluir lácteos preferentemente descremados,
// variar el tipo de carnes, usar aceite crudo con moderación y evitar el
// consumo frecuente de productos ultraprocesados (opcionales).
//
// No es un diagnóstico nutricional: son sugerencias generales, orientadas
// por el objetivo de la persona (bajar / mantener / subir de peso).

import { GRUPOS } from "../data/foods";

// items: array de { grupo, peso } donde "peso" es kcal (modo "diario") o
// simplemente 1 por producto (modo "compra", cuando no tenemos kcal exacta
// de cada ítem del tiquet).
export function agruparPeso(items) {
  const porGrupo = {};
  let total = 0;
  for (const it of items) {
    const peso = it.peso ?? 1;
    porGrupo[it.grupo] = (porGrupo[it.grupo] || 0) + peso;
    total += peso;
  }
  return { porGrupo, total };
}

export function generarRecomendaciones({ porGrupo, total }, objetivo, modo = "diario") {
  if (!total) {
    return {
      destacar: [],
      sumar: [],
      mensaje:
        modo === "compra"
          ? "No pudimos identificar productos en la imagen. Probá con una foto más clara del tiquet."
          : "Todavía no registraste comidas hoy.",
    };
  }

  const pct = (g) => ((porGrupo[g] || 0) / total) * 100;
  const destacar = [];
  const sumar = [];

  const pctOpcionales = pct("opcionales");
  const pctVerdurasFrutas = pct("verduras_frutas");
  const pctLacteos = pct("lacteos");
  const pctCarnesHuevo = pct("carnes_huevo");
  const pctCereales = pct("cereales_legumbres");

  const sustantivo = modo === "compra" ? "de tu compra" : "de lo que registraste hoy";
  const verbo = modo === "compra" ? "Comprás" : "Consumís";

  if (pctOpcionales >= 30) {
    destacar.push(
      `${verbo} bastante en productos ultraprocesados (golosinas, snacks, gaseosas, fiambres): representan cerca del ${Math.round(
        pctOpcionales
      )}% ${sustantivo}. La recomendación es que sean de consumo ocasional.`
    );
  } else if (pctOpcionales >= 15) {
    destacar.push(
      `Hay una proporción moderada de productos opcionales (ultraprocesados) ${sustantivo} (~${Math.round(
        pctOpcionales
      )}%). Está bien de vez en cuando, pero conviene no volverlo algo diario.`
    );
  }

  if (pctVerdurasFrutas < 15) {
    sumar.push("Verduras y frutas frescas: son la base recomendada de cada comida y hoy están bajas o ausentes.");
  }
  if (pctLacteos < 5) {
    sumar.push("Lácteos (preferentemente descremados): leche, yogur o queso, para calcio y proteína.");
  }
  if (pctCarnesHuevo < 5 && objetivo !== "bajar") {
    sumar.push("Una fuente de proteína (carnes, huevo, legumbres) en cada comida principal.");
  }
  if (pctCereales < 10) {
    sumar.push("Cereales o legumbres (arroz, pastas, avena, lentejas), preferentemente integrales.");
  }

  if (objetivo === "bajar" && pctOpcionales >= 15) {
    destacar.push("Para tu objetivo de bajar de peso, reducir los productos opcionales es lo que más impacto va a tener.");
  }
  if (objetivo === "subir" && pctOpcionales < 15 && total > 0) {
    sumar.push("Como tu objetivo es subir de peso, sumar más frutos secos, cereales integrales y lácteos enteros puede ayudarte sin depender de ultraprocesados.");
  }

  const mensaje =
    destacar.length === 0 && sumar.length === 0
      ? "¡Buen equilibrio! Se nota variedad entre los grupos de alimentos recomendados."
      : null;

  return { destacar, sumar, mensaje, porGrupo, total };
}

export function labelGrupo(grupo) {
  return GRUPOS[grupo]?.label || grupo;
}
