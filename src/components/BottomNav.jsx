import { Home, UtensilsCrossed, Scale, Camera, MapPin, Wrench, User } from "lucide-react";
import { COLORS } from "../theme";

const TABS = [
  { key: "inicio", label: "Inicio", icon: Home },
  { key: "comida", label: "Comida", icon: UtensilsCrossed },
  { key: "tiquet", label: "Tiquet", icon: Camera },
  { key: "peso", label: "Peso", icon: Scale },
  { key: "cerca", label: "Cerca", icon: MapPin },
  { key: "herramientas", label: "Herram.", icon: Wrench },
  { key: "perfil", label: "Perfil", icon: User },
];

export default function BottomNav({ active, onChange }) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 flex justify-around border-t px-1 pb-[max(8px,env(safe-area-inset-bottom))] pt-2"
      style={{ borderColor: COLORS.borde, backgroundColor: COLORS.fondoTarjeta }}
    >
      {TABS.map(({ key, label, icon: Icon }) => {
        const isActive = active === key;
        const color = isActive ? COLORS.primario : COLORS.navInactivo;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className="flex flex-col items-center gap-1 px-0.5 py-1"
          >
            <Icon size={18} color={color} strokeWidth={isActive ? 2.4 : 2} />
            <span className="whitespace-nowrap text-[9px] font-semibold" style={{ color }}>
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
