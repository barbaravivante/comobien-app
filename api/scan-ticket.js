// Lee la foto de un tiquet de supermercado usando la API de Claude (Anthropic)
// con visión, y devuelve la lista de productos reconocidos junto con el grupo
// de alimentos al que pertenece cada uno (según las Guías Alimentarias
// Argentinas). El front-end usa esa lista para armar la comparación de "qué
// comprás de más" / "qué te conviene sumar".
//
// Configuración necesaria en Vercel (Settings > Environment Variables):
//   ANTHROPIC_API_KEY  -> tu API key de la Consola de Anthropic (console.anthropic.com)
//
// Costo: cada foto escaneada genera un uso de la API (unos pocos centavos de
// dólar por imagen con el modelo Haiku, que es el más económico). No hay forma
// de leer la imagen gratis: por eso esta es la única función del sistema con
// un costo variable por uso.

const MODEL = "claude-haiku-4-5-20251001";

const GRUPOS_VALIDOS = [
  "verduras_frutas",
  "cereales_legumbres",
  "lacteos",
  "carnes_huevo",
  "aceites_semillas",
  "opcionales",
];

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Método no permitido" });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("Falta ANTHROPIC_API_KEY");
    res.status(500).json({ error: "El servidor no está configurado para leer tiquets todavía." });
    return;
  }

  const { imageBase64, mediaType } = req.body || {};
  if (!imageBase64 || !mediaType) {
    res.status(400).json({ error: "Falta la imagen." });
    return;
  }

  // Límite de tamaño razonable (Vercel corta requests grandes igual, pero
  // avisamos antes con un mensaje más claro para la persona que usa la app).
  if (imageBase64.length > 6_000_000) {
    res.status(413).json({ error: "La imagen es muy pesada. Probá sacar la foto de nuevo con menos resolución." });
    return;
  }

  const prompt = `Esta imagen es la foto de un tiquet/factura de supermercado de Argentina.
Extraé la lista de productos comprados (ignorá totales, IVA, medios de pago, descuentos y líneas que no sean productos).
Para cada producto, asigná el grupo de alimentos MÁS ADECUADO de esta lista fija (usá exactamente uno de estos valores):
- "verduras_frutas": verduras y frutas frescas
- "cereales_legumbres": arroz, fideos, pan, harinas, legumbres, papa, avena, galletas de agua
- "lacteos": leche, yogur, quesos
- "carnes_huevo": carnes, pollo, pescado, fiambres frescos tipo jamón natural, huevo
- "aceites_semillas": aceites, manteca, frutos secos, semillas, mayonesa
- "opcionales": golosinas, snacks, galletitas dulces, gaseosas, jugos, alcohol, embutidos tipo salame, congelados tipo pizza/hamburguesa, helados, panificados dulces (facturas, pan dulce), productos ultraprocesados en general

Si un producto no es un alimento (bolsas, artículos de limpieza, higiene, etc.) NO lo incluyas.
Si no podés identificar bien un producto, hacé la mejor estimación posible igual.

Respondé ÚNICAMENTE con un JSON válido, sin texto adicional, con esta forma exacta:
{"items":[{"nombre":"string tal cual aparece o tu mejor interpretación","grupo":"uno_de_los_valores_de_arriba"}]}`;

  try {
    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1500,
        messages: [
          {
            role: "user",
            content: [
              { type: "image", source: { type: "base64", media_type: mediaType, data: imageBase64 } },
              { type: "text", text: prompt },
            ],
          },
        ],
      }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      console.error("Error de la API de Anthropic:", resp.status, text);
      res.status(502).json({ error: "No pudimos leer la imagen en este momento. Probá de nuevo en un rato." });
      return;
    }

    const data = await resp.json();
    const textOut = data?.content?.find((c) => c.type === "text")?.text || "";

    let parsed;
    try {
      // Por si el modelo agrega texto extra alrededor del JSON, buscamos el bloque {...}.
      const match = textOut.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(match ? match[0] : textOut);
    } catch (e) {
      console.error("No se pudo parsear la respuesta del modelo:", textOut);
      res.status(502).json({ error: "No pudimos interpretar el tiquet. Probá con una foto más clara." });
      return;
    }

    const items = (parsed.items || [])
      .filter((it) => it && it.nombre && GRUPOS_VALIDOS.includes(it.grupo))
      .slice(0, 60);

    res.status(200).json({ items });
  } catch (err) {
    console.error("Error procesando scan-ticket:", err);
    res.status(500).json({ error: "Ocurrió un error inesperado leyendo la imagen." });
  }
};
