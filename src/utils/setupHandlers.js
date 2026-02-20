// گرفتن زبان فعلی
export const getLang = () => {
  const settings = JSON.parse(localStorage.getItem("game_settings"));
  return settings?.language || "fa";
};

// تغییر زبان
export const toggleLanguage = () => {
  const settings = JSON.parse(localStorage.getItem("game_settings")) || {};
  const newLang = settings.language === "fa" ? "en" : "fa";
  settings.language = newLang;
  localStorage.setItem("game_settings", JSON.stringify(settings));

  // تغییر جهت صفحه
  document.documentElement.dir = newLang === "fa" ? "rtl" : "ltr";

  window.location.reload();
};

// ذخیره تنظیمات
export const saveGameSettings = (settings) => {
  localStorage.setItem("game_settings", JSON.stringify(settings));
};

// ساخت تیم‌ها
export const createTeams = (teamNames) => {
  const teams = teamNames.map((name, index) => ({
    id: index + 1,
    name,
    score: 0,
  }));

  localStorage.setItem("teams", JSON.stringify(teams));
  return teams;
};

// ساخت بازیکن‌ها (دو زبانه)
export const createPlayers = (count) => {
  const lang = getLang();

  const players = Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name:
      lang === "fa"
        ? `بازیکن ${i + 1}`
        : `Player ${i + 1}`,
    givenCards: [],
    removedCards: [],
  }));

  localStorage.setItem("players", JSON.stringify(players));
  return players;
};

// تغییر فاز بازی
export const setGamePhase = (phase) => {
  const state = JSON.parse(localStorage.getItem("game_state")) || {};
  state.phase = phase;
  localStorage.setItem("game_state", JSON.stringify(state));
};