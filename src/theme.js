// Todos los colores y la tipografía de ComoBien están centralizados acá.
// Para cambiar el look de la app (fondo, color principal, textos, etc.)
// alcanza con editar los valores de este archivo y guardar: se actualiza
// en todas las pantallas a la vez.
//
// Nota: los colores de los "grupos de alimentos" (verduras y frutas,
// lácteos, etc.) están en src/data/foods.js, en el objeto GRUPOS, porque
// son colores de categoría más que de marca.
//
// Cada valor es un color en formato hexadecimal (#RRGGBB). Podés generar
// o elegir colores nuevos en una página como https://coolors.co o
// https://htmlcolorcodes.com y simplemente pegar el código acá.

export const COLORS = {
  // Fondo general de toda la app
  fondo: "#F5E5DE",

  // Color principal de marca: botones importantes, ícono, elementos activos
  primario: "#AAD0DA",
  // Versión clara del color principal, para fondos suaves (ej: barras llenas)
  primarioClaro: "#4C8C5B",

  // Textos
  textoPrincipal: "#1E2A22", // títulos y texto importante
  textoSecundario: "#6B7A70", // texto de apoyo, descripciones
  textoTerciario: "#8B9689", // texto más tenue (ayuda, placeholders)

  // Tarjetas y bordes
  fondoTarjeta: "#D4F1F2",
  borde: "#E4E0D3",

  // Estados
  exito: "#AAD0DA",
  error: "#C1633E",
  errorFondo: "#FBEAE3",

  // Barras de macronutrientes (Dashboard / registro de comidas)
  colorProteinas: "#B5563E",
  colorCarbohidratos: "#C79A3D",
  colorGrasas: "#8B6BFF",

  // Navegación inferior (ícono/texto cuando NO está seleccionado)
  navInactivo: "#B7BEB3",

  // Textos dentro de la caja verde de "Recomendación del día"
  textoSobreVerde: "#DCE5DE",
  destacadoSobreVerde: "#B8E0C4",
};

// Tipografía: título con "serif" (Fraunces) y el resto de la app con
// "sans-serif" (Nunito Sans). Si más adelante querés cambiar la fuente,
// se puede reemplazar acá también (hay que buscar la fuente en
// https://fonts.google.com y cambiar tanto esta URL como los nombres de
// abajo).
export const FONT_IMPORT_URL =
  "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Nunito+Sans:wght@400;600;700;800&display=swap";

export const FONT_TITULOS = "'Fraunces', serif";
export const FONT_TEXTO = "'Nunito Sans', sans-serif";
