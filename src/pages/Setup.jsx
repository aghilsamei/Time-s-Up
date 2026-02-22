// pages/Setup.jsx
import React, { useState, useEffect } from "react";
import {
  saveGameSettings,
  createTeams,
  createPlayers,
  setGamePhase,
} from "../utils/setupHandlers";
import "../assets/css/setup.css";

const Setup = () => {
  const [lang, setLang] = useState("fa");
  const [teamsCount, setTeamsCount] = useState(2);
  const [teamNames, setTeamNames] = useState([]);
  const [cardsPerPlayer, setCardsPerPlayer] = useState(7);
  const [removePerPlayer, setRemovePerPlayer] = useState(2);
  const [categories, setCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [errors, setErrors] = useState({});

  const validate = () => {
  const newErrors = {};

  // teams
  if (teamsCount < 2 || teamsCount > 10) {
    newErrors.teamsCount =
      lang === "fa"
        ? "تعداد تیم باید بین ۲ تا ۱۰ باشد"
        : "Teams must be between 2 and 10";
  }

  // cards per player
  if (cardsPerPlayer < 3 || cardsPerPlayer > 20) {
    newErrors.cardsPerPlayer =
      lang === "fa"
        ? "تعداد کارت باید بین ۳ تا ۲۰ باشد"
        : "Cards must be between 3 and 20";
  }

  // remove per player
  if (removePerPlayer < 0 || removePerPlayer > 2) {
    newErrors.removePerPlayer =
      lang === "fa"
        ? "کارت قابل حذف باید بین ۰ تا ۲ باشد"
        : "Removable cards must be between 0 and 2";
  }

  if (removePerPlayer >= cardsPerPlayer) {
    newErrors.removePerPlayer =
      lang === "fa"
        ? "کارت قابل حذف باید کمتر از تعداد کارت باشد"
        : "Removable cards must be less than total cards";
  }

  // categories
  if (categories.length < 3) {
    newErrors.categories =
      lang === "fa"
        ? "حداقل ۳ دسته‌بندی انتخاب کنید"
        : "Select at least 3 categories";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

  // ترجمه‌ها
  const t = {
    fa: {
      title: "تنظیمات بازی",
      teamCount: "تعداد تیم‌ها",
      teamName: "اسم تیم",
      cardsPerPlayer: "تعداد کارت برای هر نفر",
      removePerPlayer: "تعداد کارت قابل حذف",
      categories: "دسته‌بندی کارت‌ها",
      start: "شروع بازی",
      end: "⛔ پایان بازی",
      minTeamsAlert: "حداقل ۲ تیم لازم است",
      minCategoriesAlert: "حداقل ۳ دسته‌بندی انتخاب شود",
      endConfirm: "آیا مطمئنی می‌خوای بازی رو کامل تموم کنی؟",
    },
    en: {
      title: "Game Setup",
      teamCount: "Number of Teams",
      teamName: "Team Name",
      cardsPerPlayer: "Cards per Player",
      removePerPlayer: "Removable Cards",
      categories: "Card Categories",
      start: "Start Game",
      end: "⛔ End Game",
      minTeamsAlert: "At least 2 teams required",
      minCategoriesAlert: "Select at least 3 categories",
      endConfirm: "Are you sure you want to end the game?",
    },
  };

  // بارگذاری تنظیمات اولیه و دسته‌بندی‌ها
  useEffect(() => {
    const settings = JSON.parse(localStorage.getItem("game_settings")) || {};
    const currentLang = settings.language || "fa";
    setLang(currentLang);
    document.documentElement.dir = currentLang === "fa" ? "rtl" : "ltr";

    // کارت‌ها از localStorage
    const cards = JSON.parse(localStorage.getItem("cards")) || [];

    // استخراج دسته‌بندی یکتا بر اساس زبان
    const uniqueCats = [...new Set(cards.map((c) => c.category[currentLang]))];
    setAllCategories(uniqueCats);
    setCategories(uniqueCats); // پیش‌فرض همه انتخاب باشند

    // اسم تیم‌ها پیش‌فرض
    setTeamNames(
      Array.from({ length: 2 }, (_, i) =>
        currentLang === "fa" ? `تیم ${i + 1}` : `Team ${i + 1}`
      )
    );
  }, []);

  // بروزرسانی اسم تیم‌ها وقتی تعداد تیم تغییر کند
  useEffect(() => {
    setTeamNames((prev) => {
      const newNames = [...prev];
      if (teamsCount > prev.length) {
        for (let i = prev.length; i < teamsCount; i++) {
          newNames.push(lang === "fa" ? `تیم ${i + 1}` : `Team ${i + 1}`);
        }
      } else {
        newNames.length = teamsCount;
      }
      return newNames;
    });
  }, [teamsCount, lang]);

  const toggleCategory = (cat) => {
    if (categories.includes(cat)) {
      setCategories(categories.filter((c) => c !== cat));
    } else {
      setCategories([...categories, cat]);
    }
  };
const startGame = () => {
  if (!validate()) return;

  const totalPlayers = teamsCount * 2;

  saveGameSettings({
    playersCount: totalPlayers,
    cardsPerPlayer,
    removePerPlayer,
    categories,
    language: lang,
  });

  createTeams(teamNames.slice(0, teamsCount));
  createPlayers(totalPlayers);
  setGamePhase("selection");

  window.location.reload();
};

  const endGame = () => {
    const confirmEnd = window.confirm(t[lang].endConfirm);
    if (!confirmEnd) return;

    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="setup-container">
      <h2>{t[lang].title}</h2>

   <div className="form-group">
  <label>{t[lang].teamCount}</label>
  <input
    type="number"
    min={2}
    max={10}
    value={teamsCount}
    onChange={(e) => {
      let value = parseInt(e.target.value);
      if (isNaN(value)) value = 2;
      if (value < 2) value = 2;
      if (value > 10) value = 10;
      setTeamsCount(value);
    }}
  />
  <small className="hint-text">
    {lang === "fa"
      ? "حداقل 2 و حداکثر 10 تیم"
      : "Minimum 2 and maximum 10 teams"}
  </small>
</div>

      {teamNames.map((name, index) => (
        <div className="form-group" key={index}>
          <label>
            {t[lang].teamName} {index + 1}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              const updated = [...teamNames];
              updated[index] = e.target.value;
              setTeamNames(updated);
            }}
          />
        </div>
      ))}

  <div className="form-group">
  <label>{t[lang].cardsPerPlayer}</label>
  <input
    type="number"
    min={3}
    max={20}
    value={cardsPerPlayer}
    onChange={(e) => {
      let value = parseInt(e.target.value);
      if (isNaN(value)) value = 3;
      if (value < 3) value = 3;
      if (value > 20) value = 20;
      setCardsPerPlayer(value);
    }}
  />
  <small className="hint-text">
    {lang === "fa"
      ? "حداقل 3 و حداکثر 20 کارت برای هر نفر"
      : "Minimum 3 and maximum 20 cards per player"}
  </small>
</div>

      <div className="form-group">
  <label>{t[lang].removePerPlayer}</label>
  <input
    type="number"
    min={0}
    max={2}
    value={removePerPlayer}
    onChange={(e) => {
      let value = parseInt(e.target.value);
      if (isNaN(value)) value = 0;
      if (value < 0) value = 0;
      if (value > 2) value = 2;
      setRemovePerPlayer(value);
    }}
  />
  <small className="hint-text">
    {lang === "fa"
      ? "می‌توان بین 0 تا 2 کارت حذف کرد"
      : "Can remove 0 to 2 cards"}
  </small>
</div>

<div className="form-group">
  <label>{t[lang].categories}</label>
  <div className="checkbox-group">
    {allCategories.map((cat) => (
      <label key={cat}>
        <input
          type="checkbox"
          checked={categories.includes(cat)}
          onChange={() => toggleCategory(cat)}
        />
        {cat}
      </label>
    ))}
  </div>
  <small className="hint-text">
    {lang === "fa"
      ? "حداقل 3 دسته‌بندی انتخاب شود"
      : "Select at least 3 categories"}
  </small>
</div>

      <button className="start-btn" onClick={startGame}>
        {t[lang].start}
      </button>

      <div className="end-game">
        <button className="end-btn" onClick={endGame}>
          {t[lang].end}
        </button>
      </div>
    </div>
  );
};

export default Setup;