// Cálculos nutricionales estándar (fórmula de Mifflin-St Jeor, la más usada
// y recomendada actualmente para estimar el gasto calórico). Son estimaciones
// orientativas, no reemplazan la consulta con un/a nutricionista o médico/a,
// especialmente ante condiciones de salud particulares (embarazo, diabetes,
// patologías renales o cardíacas, trastornos alimentarios, etc.).

export const ACTIVIDAD_FACTORES = {
  sedentario: { label: "Sedentario (poco o nada de ejercicio)", factor: 1.2 },
  ligera: { label: "Actividad ligera (1 a 3 días por semana)", factor: 1.375 },
  moderada: { label: "Actividad moderada (3 a 5 días por semana)", factor: 1.55 },
  intensa: { label: "Actividad intensa (6 a 7 días por semana)", factor: 1.725 },
};

export const OBJETIVOS = {
  bajar: { label: "Bajar de peso" },
  mantener: { label: "Mantener mi peso" },
  subir: { label: "Subir de peso" },
};

// Tasa Metabólica Basal (Mifflin-St Jeor)
export function calcularTMB({ sexo, pesoKg, alturaCm, edad }) {
  const base = 10 * pesoKg + 6.25 * alturaCm - 5 * edad;
  return sexo === "M" ? base + 5 : base - 161;
}

export function calcularCaloriasMantenimiento(perfil) {
  const tmb = calcularTMB(perfil);
  const factor = ACTIVIDAD_FACTORES[perfil.actividad]?.factor || 1.2;
  return tmb * factor;
}

// Calorías objetivo diarias según el objetivo (bajar / mantener / subir),
// con un piso de seguridad para no sugerir déficits extremos.
export function calcularCaloriasObjetivo(perfil) {
  const mantenimiento = calcularCaloriasMantenimiento(perfil);
  const pisoSeguridad = perfil.sexo === "M" ? 1500 : 1200;

  let objetivo = mantenimiento;
  if (perfil.objetivo === "bajar") objetivo = mantenimiento - 500;
  if (perfil.objetivo === "subir") objetivo = mantenimiento + 400;

  return Math.round(Math.max(objetivo, pisoSeguridad));
}

// Reparto de macronutrientes: proteína en función del peso corporal (buena
// práctica para preservar masa muscular tanto bajando como subiendo de
// peso), grasas como 25% de las calorías totales, y el resto en carbohidratos.
export function calcularMacros(perfil) {
  const kcalObjetivo = calcularCaloriasObjetivo(perfil);
  const protGr = Math.round(perfil.pesoKg * 1.8);
  const protKcal = protGr * 4;
  const grasaKcal = kcalObjetivo * 0.25;
  const grasaGr = Math.round(grasaKcal / 9);
  const carbKcal = Math.max(kcalObjetivo - protKcal - grasaKcal, 0);
  const carbGr = Math.round(carbKcal / 4);

  return { kcalObjetivo, protGr, grasaGr, carbGr };
}

export function calcularIMC({ pesoKg, alturaCm }) {
  const alturaM = alturaCm / 100;
  return +(pesoKg / (alturaM * alturaM)).toFixed(1);
}

export function clasificarIMC(imc) {
  if (imc < 18.5) return "Bajo peso";
  if (imc < 25) return "Peso normal";
  if (imc < 30) return "Sobrepeso";
  return "Obesidad";
}

// Rangos razonables para validar los datos que carga la persona. Sirven,
// sobre todo, para agarrar el error más común: escribir la altura en metros
// (ej: "1,70") en vez de en centímetros (ej: "170"), lo que rompe todos los
// cálculos posteriores (IMC absurdo, calorías mal estimadas).
export function validarDatosCuerpo({ edad, alturaCm, pesoKg }) {
  const errores = [];
  if (!edad || edad < 12 || edad > 100) {
    errores.push("Revisá la edad: tiene que ser un número entre 12 y 100 años.");
  }
  if (!alturaCm || alturaCm < 100 || alturaCm > 230) {
    errores.push("Revisá la altura: tiene que ir en centímetros (ej: 165), no en metros.");
  }
  if (!pesoKg || pesoKg < 30 || pesoKg > 300) {
    errores.push("Revisá el peso: tiene que ir en kilogramos (ej: 70).");
  }
  return errores;
}
