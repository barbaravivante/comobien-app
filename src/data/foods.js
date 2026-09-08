// Base de datos de alimentos, con valores nutricionales aproximados por cada
// 100g (o 100ml en líquidos), agrupados según los 6 grupos de las Guías
// Alimentarias para la Población Argentina (GAPA, Ministerio de Salud) más
// un grupo "opcionales" (ultraprocesados / consumo ocasional, que la GAPA
// recomienda moderar: golosinas, snacks, gaseosas, fiambres, alcohol).
//
// Grupos:
//   verduras_frutas   -> Verduras y frutas
//   cereales_legumbres -> Cereales, papa, legumbres, pan y pastas
//   lacteos           -> Leche, yogur y quesos
//   carnes_huevo      -> Carnes y huevo
//   aceites_semillas  -> Aceites, frutas secas y semillas
//   opcionales        -> Dulces, snacks, bebidas azucaradas, fiambres, alcohol
//
// Los valores son aproximados (fuente: tablas de composición de alimentos de
// uso general / Argenfoods) y sirven para una estimación orientativa, no para
// un diagnóstico médico o nutricional preciso.

export const GRUPOS = {
  verduras_frutas: { label: "Verduras y frutas", color: "#4C8C5B" },
  cereales_legumbres: { label: "Cereales, legumbres, pan y pastas", color: "#C79A3D" },
  lacteos: { label: "Leche, yogur y quesos", color: "#6FA8C7" },
  carnes_huevo: { label: "Carnes y huevo", color: "#B5563E" },
  aceites_semillas: { label: "Aceites, frutas secas y semillas", color: "#8B6BFF" },
  opcionales: { label: "Opcionales (moderar)", color: "#9AA0A6" },
};

// kcal100 / prot100 / carb100 / grasa100 -> por 100g o 100ml
export const FOODS = [
  // Verduras y frutas
  { id: "manzana", nombre: "Manzana", grupo: "verduras_frutas", kcal100: 52, prot100: 0.3, carb100: 14, grasa100: 0.2, porcion: 150, porcionLabel: "1 unidad" },
  { id: "banana", nombre: "Banana", grupo: "verduras_frutas", kcal100: 89, prot100: 1.1, carb100: 23, grasa100: 0.3, porcion: 120, porcionLabel: "1 unidad" },
  { id: "naranja", nombre: "Naranja", grupo: "verduras_frutas", kcal100: 47, prot100: 0.9, carb100: 12, grasa100: 0.1, porcion: 150, porcionLabel: "1 unidad" },
  { id: "pera", nombre: "Pera", grupo: "verduras_frutas", kcal100: 57, prot100: 0.4, carb100: 15, grasa100: 0.1, porcion: 150, porcionLabel: "1 unidad" },
  { id: "frutilla", nombre: "Frutillas", grupo: "verduras_frutas", kcal100: 32, prot100: 0.7, carb100: 7.7, grasa100: 0.3, porcion: 150, porcionLabel: "1 taza" },
  { id: "ensalada_mixta", nombre: "Ensalada (lechuga y tomate)", grupo: "verduras_frutas", kcal100: 18, prot100: 0.9, carb100: 3.2, grasa100: 0.2, porcion: 150, porcionLabel: "1 plato chico" },
  { id: "tomate", nombre: "Tomate", grupo: "verduras_frutas", kcal100: 18, prot100: 0.9, carb100: 3.9, grasa100: 0.2, porcion: 120, porcionLabel: "1 unidad" },
  { id: "zanahoria", nombre: "Zanahoria", grupo: "verduras_frutas", kcal100: 41, prot100: 0.9, carb100: 10, grasa100: 0.2, porcion: 80, porcionLabel: "1 unidad" },
  { id: "zapallo", nombre: "Zapallo", grupo: "verduras_frutas", kcal100: 26, prot100: 1, carb100: 6.5, grasa100: 0.1, porcion: 150, porcionLabel: "1 taza" },
  { id: "brocoli", nombre: "Brócoli", grupo: "verduras_frutas", kcal100: 34, prot100: 2.8, carb100: 6.6, grasa100: 0.4, porcion: 100, porcionLabel: "1 taza" },
  { id: "palta", nombre: "Palta", grupo: "verduras_frutas", kcal100: 160, prot100: 2, carb100: 8.5, grasa100: 14.7, porcion: 70, porcionLabel: "1/2 unidad" },
  { id: "papa_hervida", nombre: "Papa hervida", grupo: "verduras_frutas", kcal100: 87, prot100: 1.9, carb100: 20, grasa100: 0.1, porcion: 150, porcionLabel: "1 unidad mediana" },

  // Cereales, legumbres, pan y pastas
  { id: "arroz_cocido", nombre: "Arroz blanco cocido", grupo: "cereales_legumbres", kcal100: 130, prot100: 2.4, carb100: 28, grasa100: 0.3, porcion: 150, porcionLabel: "1 plato" },
  { id: "fideos_cocidos", nombre: "Fideos / tallarines cocidos", grupo: "cereales_legumbres", kcal100: 158, prot100: 5.8, carb100: 31, grasa100: 0.9, porcion: 200, porcionLabel: "1 plato" },
  { id: "noquis", nombre: "Ñoquis de papa (cocidos)", grupo: "cereales_legumbres", kcal100: 150, prot100: 3.8, carb100: 31, grasa100: 1.2, porcion: 220, porcionLabel: "1 plato" },
  { id: "ravioles", nombre: "Ravioles (rellenos, cocidos)", grupo: "cereales_legumbres", kcal100: 160, prot100: 7, carb100: 25, grasa100: 3.5, porcion: 200, porcionLabel: "1 plato" },
  { id: "sorrentinos", nombre: "Sorrentinos (jamón y queso, cocidos)", grupo: "cereales_legumbres", kcal100: 200, prot100: 8, carb100: 24, grasa100: 7.5, porcion: 200, porcionLabel: "1 plato" },
  { id: "canelones", nombre: "Canelones (rellenos, sin salsa)", grupo: "cereales_legumbres", kcal100: 180, prot100: 9, carb100: 20, grasa100: 7, porcion: 250, porcionLabel: "4 unidades" },
  { id: "salsa_tomate", nombre: "Salsa de tomate (para pastas)", grupo: "verduras_frutas", kcal100: 45, prot100: 1.5, carb100: 8, grasa100: 1, porcion: 80, porcionLabel: "1 cucharón" },
  { id: "salsa_crema", nombre: "Salsa blanca / crema (para pastas)", grupo: "opcionales", kcal100: 195, prot100: 2.5, carb100: 6, grasa100: 18, porcion: 60, porcionLabel: "1 cucharón" },
  { id: "pan_frances", nombre: "Pan francés", grupo: "cereales_legumbres", kcal100: 270, prot100: 9, carb100: 53, grasa100: 1.5, porcion: 50, porcionLabel: "2 unidades chicas" },
  { id: "pan_lactal", nombre: "Pan lactal (blanco)", grupo: "cereales_legumbres", kcal100: 265, prot100: 9, carb100: 49, grasa100: 3.3, porcion: 60, porcionLabel: "2 rebanadas" },
  { id: "pan_lactal_integral", nombre: "Pan lactal integral", grupo: "cereales_legumbres", kcal100: 247, prot100: 10, carb100: 41, grasa100: 4, porcion: 60, porcionLabel: "2 rebanadas" },
  { id: "avena", nombre: "Avena (en hojuelas, cruda)", grupo: "cereales_legumbres", kcal100: 389, prot100: 17, carb100: 66, grasa100: 7, porcion: 40, porcionLabel: "4 cdas" },
  { id: "batata", nombre: "Batata hervida", grupo: "cereales_legumbres", kcal100: 86, prot100: 1.6, carb100: 20, grasa100: 0.1, porcion: 150, porcionLabel: "1 unidad mediana" },
  { id: "lentejas_cocidas", nombre: "Lentejas cocidas", grupo: "cereales_legumbres", kcal100: 116, prot100: 9, carb100: 20, grasa100: 0.4, porcion: 180, porcionLabel: "1 plato" },
  { id: "garbanzos_cocidos", nombre: "Garbanzos cocidos", grupo: "cereales_legumbres", kcal100: 164, prot100: 8.9, carb100: 27, grasa100: 2.6, porcion: 180, porcionLabel: "1 plato" },
  { id: "porotos_cocidos", nombre: "Porotos cocidos", grupo: "cereales_legumbres", kcal100: 127, prot100: 8.7, carb100: 23, grasa100: 0.5, porcion: 180, porcionLabel: "1 plato" },
  { id: "polenta_cocida", nombre: "Polenta cocida", grupo: "cereales_legumbres", kcal100: 85, prot100: 2, carb100: 18, grasa100: 0.5, porcion: 200, porcionLabel: "1 plato" },

  // Leche, yogur y quesos
  { id: "leche_entera", nombre: "Leche entera", grupo: "lacteos", kcal100: 61, prot100: 3.2, carb100: 4.8, grasa100: 3.3, porcion: 200, porcionLabel: "1 vaso" },
  { id: "leche_descremada", nombre: "Leche descremada", grupo: "lacteos", kcal100: 35, prot100: 3.4, carb100: 5, grasa100: 0.2, porcion: 200, porcionLabel: "1 vaso" },
  { id: "yogur_entero", nombre: "Yogur entero", grupo: "lacteos", kcal100: 61, prot100: 3.5, carb100: 4.7, grasa100: 3.3, porcion: 190, porcionLabel: "1 pote" },
  { id: "yogur_descremado", nombre: "Yogur descremado", grupo: "lacteos", kcal100: 41, prot100: 4, carb100: 5.7, grasa100: 0.2, porcion: 190, porcionLabel: "1 pote" },
  { id: "queso_cremoso", nombre: "Queso cremoso", grupo: "lacteos", kcal100: 290, prot100: 18, carb100: 2, grasa100: 24, porcion: 30, porcionLabel: "2 fetas" },
  { id: "queso_rallado", nombre: "Queso rallado", grupo: "lacteos", kcal100: 392, prot100: 35, carb100: 1.5, grasa100: 27, porcion: 15, porcionLabel: "1 cda" },
  { id: "queso_untable_descremado", nombre: "Queso untable descremado", grupo: "lacteos", kcal100: 130, prot100: 10, carb100: 4, grasa100: 8, porcion: 30, porcionLabel: "2 cdas" },

  // Carnes y huevo
  { id: "pechuga_pollo", nombre: "Pechuga de pollo (sin piel)", grupo: "carnes_huevo", kcal100: 165, prot100: 31, carb100: 0, grasa100: 3.6, porcion: 150, porcionLabel: "1 filete" },
  { id: "carne_picada", nombre: "Carne picada (magra)", grupo: "carnes_huevo", kcal100: 172, prot100: 20, carb100: 0, grasa100: 10, porcion: 150, porcionLabel: "1 porción" },
  { id: "asado", nombre: "Asado de tira", grupo: "carnes_huevo", kcal100: 280, prot100: 25, carb100: 0, grasa100: 20, porcion: 200, porcionLabel: "1 porción" },
  { id: "milanesa_horno", nombre: "Milanesa de carne al horno", grupo: "carnes_huevo", kcal100: 200, prot100: 24, carb100: 8, grasa100: 8, porcion: 150, porcionLabel: "1 unidad" },
  { id: "milanesa_frita", nombre: "Milanesa de carne frita", grupo: "carnes_huevo", kcal100: 280, prot100: 22, carb100: 10, grasa100: 17, porcion: 150, porcionLabel: "1 unidad" },
  { id: "huevo", nombre: "Huevo", grupo: "carnes_huevo", kcal100: 155, prot100: 13, carb100: 1.1, grasa100: 11, porcion: 50, porcionLabel: "1 unidad" },
  { id: "pescado_merluza", nombre: "Merluza (al horno)", grupo: "carnes_huevo", kcal100: 90, prot100: 18, carb100: 0, grasa100: 1.5, porcion: 150, porcionLabel: "1 filete" },
  { id: "atun_lata", nombre: "Atún en lata (al natural)", grupo: "carnes_huevo", kcal100: 116, prot100: 26, carb100: 0, grasa100: 1, porcion: 80, porcionLabel: "1/2 lata" },
  { id: "tofu", nombre: "Tofu", grupo: "carnes_huevo", kcal100: 76, prot100: 8, carb100: 1.9, grasa100: 4.8, porcion: 150, porcionLabel: "1 porción" },

  // Aceites, frutas secas y semillas
  { id: "aceite_oliva", nombre: "Aceite de oliva", grupo: "aceites_semillas", kcal100: 884, prot100: 0, carb100: 0, grasa100: 100, porcion: 10, porcionLabel: "1 cda" },
  { id: "manteca", nombre: "Manteca", grupo: "aceites_semillas", kcal100: 717, prot100: 0.9, carb100: 0.1, grasa100: 81, porcion: 10, porcionLabel: "1 cdita" },
  { id: "nueces", nombre: "Nueces", grupo: "aceites_semillas", kcal100: 654, prot100: 15, carb100: 14, grasa100: 65, porcion: 20, porcionLabel: "1 puñado" },
  { id: "almendras", nombre: "Almendras", grupo: "aceites_semillas", kcal100: 579, prot100: 21, carb100: 22, grasa100: 50, porcion: 20, porcionLabel: "1 puñado" },
  { id: "semillas_chia", nombre: "Semillas de chía", grupo: "aceites_semillas", kcal100: 486, prot100: 17, carb100: 42, grasa100: 31, porcion: 15, porcionLabel: "1 cda" },
  { id: "mayonesa", nombre: "Mayonesa", grupo: "aceites_semillas", kcal100: 680, prot100: 1, carb100: 2.6, grasa100: 75, porcion: 15, porcionLabel: "1 cda" },

  // Opcionales (moderar): dulces, snacks, bebidas azucaradas, fiambres, alcohol
  { id: "dulce_leche", nombre: "Dulce de leche", grupo: "opcionales", kcal100: 315, prot100: 6.5, carb100: 55, grasa100: 7, porcion: 20, porcionLabel: "1 cda" },
  { id: "azucar", nombre: "Azúcar", grupo: "opcionales", kcal100: 387, prot100: 0, carb100: 100, grasa100: 0, porcion: 10, porcionLabel: "1 cda" },
  { id: "galletitas_dulces", nombre: "Galletitas dulces", grupo: "opcionales", kcal100: 460, prot100: 6, carb100: 68, grasa100: 18, porcion: 40, porcionLabel: "4 unidades" },
  { id: "galletitas_agua", nombre: "Galletitas de agua", grupo: "cereales_legumbres", kcal100: 430, prot100: 9, carb100: 70, grasa100: 12, porcion: 30, porcionLabel: "5 unidades" },
  { id: "alfajor", nombre: "Alfajor", grupo: "opcionales", kcal100: 440, prot100: 5, carb100: 58, grasa100: 21, porcion: 50, porcionLabel: "1 unidad" },
  { id: "gaseosa_cola", nombre: "Gaseosa cola", grupo: "opcionales", kcal100: 42, prot100: 0, carb100: 10.6, grasa100: 0, porcion: 350, porcionLabel: "1 vaso/lata" },
  { id: "gaseosa_light", nombre: "Gaseosa light/zero", grupo: "opcionales", kcal100: 0.3, prot100: 0, carb100: 0, grasa100: 0, porcion: 350, porcionLabel: "1 vaso/lata" },
  { id: "jugo_polvo", nombre: "Jugo en polvo (preparado)", grupo: "opcionales", kcal100: 24, prot100: 0, carb100: 6, grasa100: 0, porcion: 250, porcionLabel: "1 vaso" },
  { id: "cerveza", nombre: "Cerveza", grupo: "opcionales", kcal100: 43, prot100: 0.5, carb100: 3.6, grasa100: 0, porcion: 355, porcionLabel: "1 lata" },
  { id: "vino", nombre: "Vino", grupo: "opcionales", kcal100: 85, prot100: 0.1, carb100: 2.6, grasa100: 0, porcion: 150, porcionLabel: "1 copa" },
  { id: "pan_dulce", nombre: "Pan dulce", grupo: "opcionales", kcal100: 370, prot100: 7, carb100: 55, grasa100: 13, porcion: 60, porcionLabel: "1 rebanada" },
  { id: "facturas", nombre: "Facturas", grupo: "opcionales", kcal100: 390, prot100: 7, carb100: 45, grasa100: 20, porcion: 60, porcionLabel: "1 unidad" },
  { id: "empanada_carne", nombre: "Empanada de carne (horno)", grupo: "opcionales", kcal100: 260, prot100: 10, carb100: 25, grasa100: 13, porcion: 90, porcionLabel: "1 unidad" },
  { id: "pizza_porcion", nombre: "Pizza (porción muzzarella)", grupo: "opcionales", kcal100: 266, prot100: 11, carb100: 33, grasa100: 10, porcion: 120, porcionLabel: "1 porción" },
  { id: "hamburguesa_completa", nombre: "Hamburguesa completa", grupo: "opcionales", kcal100: 250, prot100: 13, carb100: 22, grasa100: 13, porcion: 220, porcionLabel: "1 unidad" },
  { id: "papas_fritas_snack", nombre: "Papas fritas (snack de paquete)", grupo: "opcionales", kcal100: 536, prot100: 6.6, carb100: 53, grasa100: 34, porcion: 45, porcionLabel: "1 bolsa chica" },
  { id: "papas_fritas_caseras", nombre: "Papas fritas caseras", grupo: "opcionales", kcal100: 312, prot100: 3.4, carb100: 41, grasa100: 15, porcion: 150, porcionLabel: "1 porción" },
  { id: "chocolate", nombre: "Chocolate", grupo: "opcionales", kcal100: 545, prot100: 7.6, carb100: 59, grasa100: 31, porcion: 25, porcionLabel: "4 cuadraditos" },
  { id: "helado", nombre: "Helado", grupo: "opcionales", kcal100: 207, prot100: 3.5, carb100: 24, grasa100: 11, porcion: 100, porcionLabel: "1 bocha grande" },
  { id: "jamon_cocido", nombre: "Jamón cocido", grupo: "opcionales", kcal100: 145, prot100: 18, carb100: 1.5, grasa100: 7, porcion: 30, porcionLabel: "2 fetas" },
  { id: "salame", nombre: "Salame", grupo: "opcionales", kcal100: 407, prot100: 22, carb100: 1, grasa100: 35, porcion: 30, porcionLabel: "6 fetas" },
  { id: "choripan", nombre: "Choripán", grupo: "opcionales", kcal100: 300, prot100: 13, carb100: 22, grasa100: 18, porcion: 180, porcionLabel: "1 unidad" },
  { id: "cereales_azucarados", nombre: "Cereales de desayuno azucarados", grupo: "opcionales", kcal100: 380, prot100: 6, carb100: 84, grasa100: 3, porcion: 40, porcionLabel: "1 taza" },
  { id: "yerba_mate", nombre: "Mate (sin azúcar)", grupo: "opcionales", kcal100: 1, prot100: 0, carb100: 0.2, grasa100: 0, porcion: 500, porcionLabel: "1 termo" },
  { id: "cafe", nombre: "Café (sin azúcar)", grupo: "opcionales", kcal100: 2, prot100: 0.1, carb100: 0, grasa100: 0, porcion: 150, porcionLabel: "1 taza" },
];

export function getFood(id) {
  return FOODS.find((f) => f.id === id);
}

export function searchFoods(query) {
  const q = (query || "").trim().toLowerCase();
  if (!q) return FOODS;
  return FOODS.filter((f) => f.nombre.toLowerCase().includes(q));
}

// Calcula los valores nutricionales de una cantidad (en gramos/ml) de un alimento.
export function calcPorcion(food, gramos) {
  const factor = gramos / 100;
  return {
    kcal: Math.round(food.kcal100 * factor),
    prot: +(food.prot100 * factor).toFixed(1),
    carb: +(food.carb100 * factor).toFixed(1),
    grasa: +(food.grasa100 * factor).toFixed(1),
  };
}
