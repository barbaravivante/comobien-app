// Todo se guarda en localStorage: los datos de peso y comidas de la persona
// quedan únicamente en su propio celular, nunca en un servidor.

const KEYS = {
  profile: "comobien:profile",
  weightLog: "comobien:weightLog",
  foodLog: "comobien:foodLog",
  ticketHistory: "comobien:ticketHistory",
};

export function todayStr(d = new Date()) {
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

export function loadProfile() {
  try {
    const raw = localStorage.getItem(KEYS.profile);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveProfile(profile) {
  localStorage.setItem(KEYS.profile, JSON.stringify(profile));
}

export function loadWeightLog() {
  try {
    const raw = localStorage.getItem(KEYS.weightLog);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addWeightEntry(kg, fecha = todayStr()) {
  const log = loadWeightLog();
  const filtered = log.filter((e) => e.fecha !== fecha);
  filtered.push({ fecha, kg });
  filtered.sort((a, b) => a.fecha.localeCompare(b.fecha));
  localStorage.setItem(KEYS.weightLog, JSON.stringify(filtered));
  return filtered;
}

export function loadFoodLog() {
  try {
    const raw = localStorage.getItem(KEYS.foodLog);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function addFoodEntry(entry, fecha = todayStr()) {
  const log = loadFoodLog();
  const dia = log[fecha] || [];
  dia.push({ ...entry, id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, hora: new Date().toISOString() });
  log[fecha] = dia;
  localStorage.setItem(KEYS.foodLog, JSON.stringify(log));
  return log;
}

export function removeFoodEntry(entryId, fecha = todayStr()) {
  const log = loadFoodLog();
  const dia = (log[fecha] || []).filter((e) => e.id !== entryId);
  log[fecha] = dia;
  localStorage.setItem(KEYS.foodLog, JSON.stringify(log));
  return log;
}

export function loadTicketHistory() {
  try {
    const raw = localStorage.getItem(KEYS.ticketHistory);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addTicketResult(result) {
  const hist = loadTicketHistory();
  hist.unshift({ ...result, id: `${Date.now()}`, fecha: new Date().toISOString() });
  const trimmed = hist.slice(0, 20);
  localStorage.setItem(KEYS.ticketHistory, JSON.stringify(trimmed));
  return trimmed;
}

// Copia de seguridad: junta todo lo que vive en este celular (perfil, peso,
// comidas y el historial de tiquets) en un solo archivo descargable, para
// que la persona no pierda nada si cambia de celular o desinstala la app.
export function exportAllData() {
  return {
    exportedAt: new Date().toISOString(),
    app: "comobien",
    profile: loadProfile(),
    weightLog: loadWeightLog(),
    foodLog: loadFoodLog(),
    ticketHistory: loadTicketHistory(),
  };
}

// Reemplaza todos los datos locales por los de una copia de seguridad
// previamente exportada. Devuelve lo restaurado para que la app pueda
// actualizar su estado en memoria sin necesidad de recargar la página.
export function restoreAllData(data) {
  const profile = data?.profile ?? null;
  const weightLog = Array.isArray(data?.weightLog) ? data.weightLog : [];
  const foodLog = data?.foodLog && typeof data.foodLog === "object" ? data.foodLog : {};
  const ticketHistory = Array.isArray(data?.ticketHistory) ? data.ticketHistory : [];

  if (profile) localStorage.setItem(KEYS.profile, JSON.stringify(profile));
  localStorage.setItem(KEYS.weightLog, JSON.stringify(weightLog));
  localStorage.setItem(KEYS.foodLog, JSON.stringify(foodLog));
  localStorage.setItem(KEYS.ticketHistory, JSON.stringify(ticketHistory));

  return { profile, weightLog, foodLog, ticketHistory };
}
