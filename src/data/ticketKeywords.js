// Diccionario de palabras clave para el escaneo GRATUITO de tiquets.
//
// A diferencia de la versión anterior (que mandaba la foto a la IA de
// Anthropic y ésta "entendía" el tiquet), esta versión lee el texto del
// tiquet en el propio celular de la persona (gratis, sin límite de usos) y
// después busca, renglón por renglón, si aparece alguna de estas palabras
// clave. Por eso la calidad del reconocimiento depende de qué tan completo
// esté este diccionario.
//
// Si con el tiempo notás que se le escapan muchos productos comunes, se
// puede agregar una fila nueva acá mismo, con el mismo formato: sumás la
// palabra clave (en minúscula, sin tildes) y el grupo al que pertenece.
//
// Grupos válidos (los mismos que en src/data/foods.js):
//   verduras_frutas, cereales_legumbres, lacteos, carnes_huevo,
//   aceites_semillas, opcionales

// [palabra clave (sin tildes, minúscula), grupo, nombre para mostrar]
const ENTRADAS = [
  // Verduras y frutas
  ["manzana", "verduras_frutas", "Manzana"],
  ["banana", "verduras_frutas", "Banana"],
  ["naranja", "verduras_frutas", "Naranja"],
  ["mandarina", "verduras_frutas", "Mandarina"],
  ["pera", "verduras_frutas", "Pera"],
  ["frutilla", "verduras_frutas", "Frutillas"],
  ["uva", "verduras_frutas", "Uvas"],
  ["limon", "verduras_frutas", "Limón"],
  ["palta", "verduras_frutas", "Palta"],
  ["ananas", "verduras_frutas", "Ananá"],
  ["anana", "verduras_frutas", "Ananá"],
  ["sandia", "verduras_frutas", "Sandía"],
  ["melon", "verduras_frutas", "Melón"],
  ["durazno", "verduras_frutas", "Durazno"],
  ["ciruela", "verduras_frutas", "Ciruela"],
  ["kiwi", "verduras_frutas", "Kiwi"],
  ["tomate", "verduras_frutas", "Tomate"],
  ["lechuga", "verduras_frutas", "Lechuga"],
  ["zanahoria", "verduras_frutas", "Zanahoria"],
  ["zapallito", "verduras_frutas", "Zapallito"],
  ["zapallo", "verduras_frutas", "Zapallo"],
  ["brocoli", "verduras_frutas", "Brócoli"],
  ["cebolla", "verduras_frutas", "Cebolla"],
  ["ajo", "verduras_frutas", "Ajo"],
  ["pepino", "verduras_frutas", "Pepino"],
  ["morron", "verduras_frutas", "Morrón"],
  ["choclo", "verduras_frutas", "Choclo"],
  ["espinaca", "verduras_frutas", "Espinaca"],
  ["acelga", "verduras_frutas", "Acelga"],
  ["berenjena", "verduras_frutas", "Berenjena"],
  ["apio", "verduras_frutas", "Apio"],
  ["remolacha", "verduras_frutas", "Remolacha"],
  ["ensalada", "verduras_frutas", "Ensalada"],
  ["papa", "verduras_frutas", "Papa"],

  // Cereales, legumbres, pan y pastas
  ["arroz", "cereales_legumbres", "Arroz"],
  ["fideo", "cereales_legumbres", "Fideos"],
  ["tallarin", "cereales_legumbres", "Tallarines"],
  ["noqui", "cereales_legumbres", "Ñoquis"],
  ["ravioles", "cereales_legumbres", "Ravioles"],
  ["ravioles", "cereales_legumbres", "Sorrentinos"],
  ["sorrentino", "cereales_legumbres", "Sorrentinos"],
  ["canelone", "cereales_legumbres", "Canelones"],
  ["pan lactal", "cereales_legumbres", "Pan lactal"],
  ["pan frances", "cereales_legumbres", "Pan francés"],
  ["baguette", "cereales_legumbres", "Pan (baguette)"],
  ["lactal", "cereales_legumbres", "Pan lactal"],
  ["harina", "cereales_legumbres", "Harina"],
  ["avena", "cereales_legumbres", "Avena"],
  ["batata", "cereales_legumbres", "Batata"],
  ["lenteja", "cereales_legumbres", "Lentejas"],
  ["garbanzo", "cereales_legumbres", "Garbanzos"],
  ["poroto", "cereales_legumbres", "Porotos"],
  ["polenta", "cereales_legumbres", "Polenta"],
  ["galletita de agua", "cereales_legumbres", "Galletitas de agua"],
  ["galletitas agua", "cereales_legumbres", "Galletitas de agua"],
  ["matarazzo", "cereales_legumbres", "Fideos", "marca"],
  ["lucchetti", "cereales_legumbres", "Fideos", "marca"],
  ["blancaflor", "cereales_legumbres", "Harina", "marca"],
  ["quinoa", "cereales_legumbres", "Quinoa"],

  // Leche, yogur y quesos
  ["leche", "lacteos", "Leche"],
  ["yogur", "lacteos", "Yogur"],
  ["yoghurt", "lacteos", "Yogur"],
  ["queso cremoso", "lacteos", "Queso cremoso"],
  ["queso rallado", "lacteos", "Queso rallado"],
  ["queso untable", "lacteos", "Queso untable"],
  ["mozzarella", "lacteos", "Muzzarella"],
  ["muzzarella", "lacteos", "Muzzarella"],
  ["queso", "lacteos", "Queso"],
  ["serenisima", "lacteos", "Leche / lácteo", "marca"],
  ["sancor", "lacteos", "Leche / lácteo", "marca"],
  ["ilolay", "lacteos", "Leche / lácteo", "marca"],

  // Carnes y huevo
  ["pechuga", "carnes_huevo", "Pechuga de pollo"],
  ["pollo", "carnes_huevo", "Pollo"],
  ["carne picada", "carnes_huevo", "Carne picada"],
  ["asado", "carnes_huevo", "Asado"],
  ["matambre", "carnes_huevo", "Matambre"],
  ["bife", "carnes_huevo", "Bife"],
  ["milanesa", "carnes_huevo", "Milanesa"],
  ["huevo", "carnes_huevo", "Huevo"],
  ["merluza", "carnes_huevo", "Merluza"],
  ["pescado", "carnes_huevo", "Pescado"],
  ["atun", "carnes_huevo", "Atún"],
  ["salmon", "carnes_huevo", "Salmón"],
  ["cerdo", "carnes_huevo", "Cerdo"],
  ["pavita", "carnes_huevo", "Pavita"],
  ["tofu", "carnes_huevo", "Tofu"],
  ["carne", "carnes_huevo", "Carne"],

  // Aceites, frutas secas y semillas
  ["aceite de oliva", "aceites_semillas", "Aceite de oliva"],
  ["aceite girasol", "aceites_semillas", "Aceite de girasol"],
  ["aceite", "aceites_semillas", "Aceite"],
  ["manteca", "aceites_semillas", "Manteca"],
  ["margarina", "aceites_semillas", "Margarina"],
  ["mani", "aceites_semillas", "Maní"],
  ["nueces", "aceites_semillas", "Nueces"],
  ["almendra", "aceites_semillas", "Almendras"],
  ["semilla de chia", "aceites_semillas", "Semillas de chía"],
  ["mayonesa", "aceites_semillas", "Mayonesa"],

  // Opcionales (moderar): dulces, snacks, bebidas azucaradas, fiambres, alcohol
  ["dulce de leche", "opcionales", "Dulce de leche"],
  ["azucar", "opcionales", "Azúcar"],
  ["galletitas dulces", "opcionales", "Galletitas dulces"],
  ["oreo", "opcionales", "Galletitas dulces"],
  ["alfajor", "opcionales", "Alfajor"],
  ["gaseosa", "opcionales", "Gaseosa"],
  ["coca cola", "opcionales", "Gaseosa (Coca-Cola)"],
  ["sprite", "opcionales", "Gaseosa (Sprite)"],
  ["fanta", "opcionales", "Gaseosa (Fanta)"],
  ["pepsi", "opcionales", "Gaseosa (Pepsi)"],
  ["jugo en polvo", "opcionales", "Jugo en polvo"],
  ["jugo", "opcionales", "Jugo"],
  ["cerveza", "opcionales", "Cerveza"],
  ["quilmes", "opcionales", "Cerveza", "marca"],
  ["vino", "opcionales", "Vino"],
  ["pan dulce", "opcionales", "Pan dulce"],
  ["factura", "opcionales", "Facturas"],
  ["empanada", "opcionales", "Empanadas"],
  ["pizza", "opcionales", "Pizza"],
  ["hamburguesa", "opcionales", "Hamburguesa"],
  ["papas fritas", "opcionales", "Papas fritas (snack)"],
  ["doritos", "opcionales", "Snack de paquete"],
  ["lays", "opcionales", "Papas fritas (snack)"],
  ["palitos salados", "opcionales", "Snack de paquete"],
  ["chizitos", "opcionales", "Snack de paquete"],
  ["chocolate", "opcionales", "Chocolate"],
  ["helado", "opcionales", "Helado"],
  ["jamon cocido", "opcionales", "Jamón cocido"],
  ["jamon", "opcionales", "Jamón"],
  ["salame", "opcionales", "Salame"],
  ["mortadela", "opcionales", "Mortadela"],
  ["panceta", "opcionales", "Panceta"],
  ["chorizo", "opcionales", "Chorizo"],
  ["choripan", "opcionales", "Choripán"],
  ["cereal azucarado", "opcionales", "Cereales de desayuno azucarados"],
  ["postre", "opcionales", "Postre"],
  ["flan", "opcionales", "Flan"],
  ["gelatina", "opcionales", "Gelatina"],
  ["golosina", "opcionales", "Golosina"],
  ["caramelo", "opcionales", "Caramelos"],
];

// Cada entrada es ["palabra clave", "grupo", "nombre para mostrar"] y,
// opcionalmente, un cuarto valor "marca" cuando la palabra clave es solo el
// nombre de una marca (Serenísima, Matarazzo, Quilmes, etc.) y no describe
// qué es el producto. Esto importa para el orden de prioridad de abajo.
export const KEYWORDS = ENTRADAS.map(([keyword, grupo, nombre, tipo]) => ({
  keyword,
  grupo,
  nombre,
  tipo: tipo || "producto",
})).sort((a, b) => {
  // Preferimos siempre una palabra que describe el producto ("yogur") por
  // sobre una que es solo una marca ("serenisima"), aunque la de la marca
  // sea más larga — si no, en un renglón como "YOGUR SERENISIMA" terminaría
  // ganando la marca y se perdería que era yogur.
  if (a.tipo !== b.tipo) return a.tipo === "producto" ? -1 : 1;
  // Dentro del mismo tipo, la palabra clave más larga gana (más específica):
  // así "leche descremada" le gana a "leche" si aparecen las dos.
  return b.keyword.length - a.keyword.length;
});

// Saca tildes y pasa a minúsculas, para poder comparar texto leído por el
// OCR (que a veces pierde o cambia los acentos) contra este diccionario.
export function normalizarTexto(texto) {
  return (texto || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
