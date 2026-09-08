// Lectura GRATUITA de tiquets: en vez de mandar la foto a un servicio de IA
// pago (como se hacía antes con la API de Anthropic, ver api/scan-ticket.js),
// esta versión "lee" el texto directamente en el celular de la persona que
// compra, usando Tesseract.js (una librería de OCR gratis y de código
// abierto). Después busca, renglón por renglón, palabras clave conocidas
// (definidas en src/data/ticketKeywords.js) para adivinar qué productos son
// y a qué grupo de alimentos pertenecen.
//
// Ventaja: cero costo, para siempre, sin límite de escaneos.
// Contra: es menos "inteligente" que la IA — con tiquets muy borrosos,
// desteñidos o con nombres de productos raros puede no reconocer algunos
// ítems. Si en algún momento se prefiere volver a la versión con IA (más
// precisa pero con un costo chico por escaneo), esa lógica sigue existiendo
// en api/scan-ticket.js: solo hay que volver a apuntar TicketScan.jsx ahí.

import { createWorker } from "tesseract.js";
import { KEYWORDS, normalizarTexto } from "../data/ticketKeywords";

// Palabras que indican que el renglón NO es un producto (totales, medios de
// pago, datos fiscales, etc.), para no confundirlos con alimentos.
const PALABRAS_RUIDO = [
  "total",
  "subtotal",
  "iva",
  "cuit",
  "gracias",
  "vuelto",
  "efectivo",
  "tarjeta",
  "cae",
  "caja",
  "fecha",
  "hora",
  "ticket",
  "comprobante",
  "responsable",
  "domicilio",
  "razon social",
  "cliente",
  "descuento",
  "bonificacion",
  "puntos",
  "socio",
  "cambio",
  "medio de pago",
  "cuenta",
  "dni",
  "cond iva",
  "pto vta",
  "consumidor final",
  "factura x",
  "articulos",
  "items",
  "cant",
  "importe",
  "www",
  "gracias por su compra",
];

export function pareceRuido(lineaNormalizada) {
  if (lineaNormalizada.length < 3) return true;
  if (PALABRAS_RUIDO.some((w) => lineaNormalizada.includes(w))) return true;
  const letras = (lineaNormalizada.match(/[a-z]/g) || []).length;
  const digitos = (lineaNormalizada.match(/[0-9]/g) || []).length;
  if (letras < 3) return true;
  // Más números que letras: probablemente un precio, código de barras o fecha.
  if (digitos > letras) return true;
  return false;
}

// KEYWORDS ya viene ordenada por prioridad (nombre de producto antes que
// marca, y dentro de cada tipo, la palabra más específica primero), así que
// alcanza con devolver la primera coincidencia.
export function buscarCoincidencia(lineaNormalizada) {
  for (const entrada of KEYWORDS) {
    if (lineaNormalizada.includes(entrada.keyword)) return entrada;
  }
  return null;
}

// Redimensiona la foto a un tamaño razonable para que el OCR no tarde
// demasiado en celulares con cámaras de muchos megapixeles, sin perder la
// nitidez necesaria para leer bien el texto (a diferencia del escaneo con
// IA, acá conviene una resolución más alta).
export function prepararImagenParaOcr(file, maxDim = 2000, quality = 0.92) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();
    reader.onload = (e) => {
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("No se pudo procesar la imagen"))), "image/jpeg", quality);
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Lee el tiquet y devuelve la lista de productos identificados, con la
// misma forma que antes usaba la versión con IA: [{ nombre, grupo }].
// `onProgress` (opcional) recibe un número de 0 a 100 mientras se lee.
export async function leerTiquetLocal(imagenBlob, onProgress) {
  const worker = await createWorker("spa", 1, {
    logger: (m) => {
      if (m.status === "recognizing text" && typeof m.progress === "number") {
        onProgress?.(Math.round(m.progress * 100));
      }
    },
  });

  try {
    const { data } = await worker.recognize(imagenBlob);
    const lineas = (data.text || "").split("\n");
    const encontrados = [];
    const yaAgregados = new Set();

    for (const lineaOriginal of lineas) {
      const normalizada = normalizarTexto(lineaOriginal);
      if (pareceRuido(normalizada)) continue;
      const match = buscarCoincidencia(normalizada);
      if (match && !yaAgregados.has(match.nombre)) {
        yaAgregados.add(match.nombre);
        encontrados.push({ nombre: match.nombre, grupo: match.grupo });
      }
    }

    return encontrados;
  } finally {
    await worker.terminate();
  }
}
