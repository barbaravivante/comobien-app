import { useEffect, useState } from "react";
import Onboarding from "./components/Onboarding";
import Dashboard from "./components/Dashboard";
import FoodLog from "./components/FoodLog";
import WeightLog from "./components/WeightLog";
import TicketScan from "./components/TicketScan";
import Profile from "./components/Profile";
import NearbyStores from "./components/NearbyStores";
import BottomNav from "./components/BottomNav";
import { COLORS, FONT_IMPORT_URL, FONT_TEXTO } from "./theme";
import {
  loadProfile,
  saveProfile,
  loadWeightLog,
  addWeightEntry,
  loadFoodLog,
  addFoodEntry,
  removeFoodEntry,
  todayStr,
} from "./lib/storage";

export default function App() {
  const [profile, setProfile] = useState(() => loadProfile());
  const [tab, setTab] = useState("inicio");
  const [weightLog, setWeightLog] = useState(() => loadWeightLog());
  const [foodLog, setFoodLog] = useState(() => loadFoodLog());

  useEffect(() => {
    if (profile && weightLog.length === 0) {
      // Sembramos el historial con el peso inicial cargado en el onboarding.
      const seeded = addWeightEntry(profile.pesoKg);
      setWeightLog(seeded);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  if (!profile) {
    return (
      <Onboarding
        onComplete={(p) => {
          saveProfile(p);
          setProfile(p);
        }}
      />
    );
  }

  const today = todayStr();
  const foodToday = foodLog[today] || [];

  const handleAddFood = (entry) => {
    const updated = addFoodEntry(entry, today);
    setFoodLog({ ...updated });
  };

  const handleRemoveFood = (id) => {
    const updated = removeFoodEntry(id, today);
    setFoodLog({ ...updated });
  };

  const handleAddWeight = (kg) => {
    const updated = addWeightEntry(kg, today);
    setWeightLog(updated);
    if (kg !== profile.pesoKg) {
      const updatedProfile = { ...profile, pesoKg: kg };
      saveProfile(updatedProfile);
      setProfile(updatedProfile);
    }
  };

  const handleSaveProfile = (p) => {
    saveProfile(p);
    setProfile(p);
  };

  const handleRestoreAll = (restored) => {
    if (restored?.profile) setProfile(restored.profile);
    setWeightLog(restored?.weightLog || []);
    setFoodLog(restored?.foodLog || {});
  };

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: COLORS.fondo, fontFamily: FONT_TEXTO }}>
      <style>{`@import url('${FONT_IMPORT_URL}');`}</style>

      {tab === "inicio" && (
        <Dashboard profile={profile} foodToday={foodToday} weightLog={weightLog} onNavigate={setTab} />
      )}
      {tab === "comida" && <FoodLog foodToday={foodToday} onAdd={handleAddFood} onRemove={handleRemoveFood} />}
      {tab === "peso" && <WeightLog profile={profile} weightLog={weightLog} onAdd={handleAddWeight} />}
      {tab === "tiquet" && <TicketScan objetivo={profile.objetivo} />}
      {tab === "cerca" && <NearbyStores />}
      {tab === "perfil" && <Profile profile={profile} onSave={handleSaveProfile} onRestoreAll={handleRestoreAll} />}

      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}
