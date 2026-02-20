import React, { useState, useEffect } from "react";
import { setGamePhase } from "../utils/setupHandlers";
import "../assets/css/Start.css";

const Start = () => {
  const [showHelp, setShowHelp] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [lang, setLang] = useState("fa");

  useEffect(() => {
    const settings = JSON.parse(localStorage.getItem("game_settings")) || {};
    const currentLang = settings.language || "fa";
    setLang(currentLang);
    document.documentElement.dir = currentLang === "fa" ? "rtl" : "ltr";
  }, []);

  const toggleLanguage = () => {
    const settings = JSON.parse(localStorage.getItem("game_settings")) || {};
    const newLang = settings.language === "fa" ? "en" : "fa";
    settings.language = newLang;
    localStorage.setItem("game_settings", JSON.stringify(settings));
    document.documentElement.dir = newLang === "fa" ? "rtl" : "ltr";
    setLang(newLang);
  };

  const startGame = () => {
    setGamePhase("setup");
    window.location.reload();
  };

  const text = {
    fa: {
      subtitle: "بازی گروهی، هیجان‌انگیز و خنده‌دار",
      start: "شروع بازی",
      helpTitle: "📘 آموزش بازی",
      rulesTitle: "📜 قوانین بازی",
      understood: "فهمیدم 👍",
      help: [
        "🔹 بازیکنان به تیم‌های دو نفره تقسیم می‌شوند",
        "🔹 هر بازیکن چند کارت وارد می‌کند",
        "🔹 در هر دور، تیم‌ها به نوبت بازی می‌کنند",
        "🔹 دور اول: توضیح آزاد",
        "🔹 دور دوم: فقط یک کلمه",
        "🔹 دور سوم: فقط پانتومیم"
      ],
      rules: [
        "🔹 با گفتن هر کارت، امتیاز کسب می‌کنید",
        "🔹 تیمی که بیشترین امتیاز را بگیرد برنده است",
        "🔹 زمان هر تیم محدود است",
        "🔹 کارت‌ها در دورهای بعد دوباره استفاده می‌شوند"
      ]
    },
    en: {
      subtitle: "A fun, exciting and hilarious group game",
      start: "Start Game",
      helpTitle: "📘 How To Play",
      rulesTitle: "📜 Game Rules",
      understood: "Got it 👍",
      help: [
        "🔹 Players are divided into two-person teams",
        "🔹 Each player selects several cards",
        "🔹 Teams play in turns each round",
        "🔹 Round 1: Free description",
        "🔹 Round 2: One word only",
        "🔹 Round 3: Pantomime only"
      ],
      rules: [
        "🔹 Each correct card earns a point",
        "🔹 Team with highest score wins",
        "🔹 Each team has limited time",
        "🔹 Cards are reused in next rounds"
      ]
    }
  };

  return (
    <div className="start-page">

      <div
        className="help-icon"
        onClick={() => setShowHelp(true)}
        title={lang === "fa" ? "آموزش" : "Help"}
      >
        ❓
      </div>

      <div
        className="rules-icon"
        onClick={() => setShowRules(true)}
        title={lang === "fa" ? "قوانین بازی" : "Rules"}
      >
        📜
      </div>

      <div className="lang-switch" onClick={toggleLanguage}>
        🌐 
      </div>

      <h1 className="game-title">🎉 Times Up 🎉</h1>
      <p className="game-subtitle">{text[lang].subtitle}</p>

      <button className="start-game-btn" onClick={startGame}>
        {text[lang].start}
      </button>

      {showHelp && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{text[lang].helpTitle}</h2>
            <ul>
              {text[lang].help.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <button
              className="close-btn"
              onClick={() => setShowHelp(false)}
            >
              {text[lang].understood}
            </button>
          </div>
        </div>
      )}

      {showRules && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{text[lang].rulesTitle}</h2>
            <ul>
              {text[lang].rules.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <button
              className="close-btn"
              onClick={() => setShowRules(false)}
            >
              {text[lang].understood}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Start;