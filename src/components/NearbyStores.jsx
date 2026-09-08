import { useState } from "react";
import { MapPin, Loader2, AlertTriangle, ExternalLink } from "lucide-react";
import { COLORS, FONT_TITULOS } from "../theme";

// Abre Google Maps buscando "dietética" centrado en unas coordenadas.
// No hace falta ninguna clave de API: es simplemente la forma en que
// Google Maps arma sus URLs de búsqueda.
function armarUrlConCoordenadas(lat, lng) {
  return `https://www.google.com/maps/search/dietetica/@${lat},${lng},15z`;
}

// Si no tenemos la ubicación (el usuario no dio permiso, o el navegador no
// la soporta), abrimos una búsqueda general: Google Maps le va a pedir la
// ubicación a la persona directamente, o va a buscar en la zona por defecto.
const URL_SIN_COORDENADAS = "https://www.google.com/maps/search/dietetica+cerca+de+mi";

export default function NearbyStores() {
  const [loading, setLoading] = useState(false);
  const [avisoUbicacion, setAvisoUbicacion] = useState("");

  const buscarDieteticas = () => {
    setAvisoUbicacion("");

    if (!("geolocation" in navigator)) {
      setAvisoUbicacion(
        "Este navegador no puede compartir tu ubicación automáticamente, así que te abrimos una búsqueda general en Google Maps."
      );
      window.open(URL_SIN_COORDENADAS, "_blank", "noopener,noreferrer");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (posicion) => {
        setLoading(false);
        const { latitude, longitude } = posicion.coords;
        window.open(armarUrlConCoordenadas(latitude, longitude), "_blank", "noopener,noreferrer");
      },
      () => {
        setLoading(false);
        setAvisoUbicacion(
          "No pudimos usar tu ubicación (puede que hayas rechazado el permiso). Te abrimos una búsqueda general en Google Maps: una vez ahí podés activar tu ubicación o buscar tu zona a mano."
        );
        window.open(URL_SIN_COORDENADAS, "_blank", "noopener,noreferrer");
      },
      { enableHighAccuracy: false, timeout: 8000 }
    );
  };

  return (
    <div className="flex flex-col gap-5 px-5 pb-28 pt-6">
      <h2 className="text-[19px]" style={{ fontFamily: FONT_TITULOS, fontWeight: 600, color: COLORS.textoPrincipal }}>
        Dietéticas cerca tuyo
      </h2>
      <p className="text-[13px]" style={{ color: COLORS.textoSecundario }}>
        Te ayudamos a encontrar dietéticas y almacenes naturistas cerca de donde estás, para que sea más fácil
        conseguir los productos que te recomendamos.
      </p>

      <div
        className="flex flex-col items-center gap-3 rounded-2xl p-6 text-center"
        style={{ backgroundColor: COLORS.fondoTarjeta, border: `1px solid ${COLORS.borde}` }}
      >
        <div
          className="flex h-14 w-14 items-center justify-center rounded-full"
          style={{ backgroundColor: COLORS.fondo }}
        >
          <MapPin size={26} color={COLORS.primario} />
        </div>
        <p className="text-[13px]" style={{ color: COLORS.textoPrincipal }}>
          Tocá el botón y te vamos a mostrar las dietéticas más cercanas en Google Maps.
        </p>

        <button
          onClick={buscarDieteticas}
          disabled={loading}
          className="mt-1 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-[14px] font-bold text-white active:scale-[0.98] transition-transform disabled:opacity-70"
          style={{ backgroundColor: COLORS.primario }}
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" /> Buscando tu ubicación…
            </>
          ) : (
            <>
              <MapPin size={18} /> Ver dietéticas cerca mío
            </>
          )}
        </button>

        <a
          href={URL_SIN_COORDENADAS}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 flex items-center gap-1 text-[12px] font-semibold"
          style={{ color: COLORS.textoSecundario }}
        >
          <ExternalLink size={13} /> O buscar directamente en Google Maps
        </a>
      </div>

      {avisoUbicacion && (
        <div className="flex items-start gap-2 rounded-xl p-3" style={{ backgroundColor: COLORS.errorFondo }}>
          <AlertTriangle size={16} color={COLORS.error} className="mt-0.5 shrink-0" />
          <p className="text-[12.5px]" style={{ color: COLORS.error }}>{avisoUbicacion}</p>
        </div>
      )}

      <p className="text-center text-[11px]" style={{ color: COLORS.textoTerciario }}>
        Vas a ver un permiso del navegador pidiendo tu ubicación — si lo aceptás, la búsqueda te va a quedar
        centrada justo donde estás.
      </p>
    </div>
  );
}
