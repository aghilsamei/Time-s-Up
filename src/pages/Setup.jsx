//pages/setup
import React, { useState } from "react";
import {
  saveGameSettings,
  createTeams,
  createPlayers,
  setGamePhase,
} from "../utils/setupHandlers";
import "../assets/css/setup.css";

const Setup = () => {
  const [teamsCount, setTeamsCount] = useState(2);
  const [teamNames, setTeamNames] = useState(["تیم 1", "تیم 2"]);
  const [cardsPerPlayer, setCardsPerPlayer] = useState(7);
  const [removePerPlayer, setRemovePerPlayer] = useState(2);
  const [roundTime, setRoundTime] = useState(30);
  const [categories, setCategories] = useState([
    "ورزشکار",
    "بازیگر و کارگردان",
  "شخصیت",
    "دانشمند",
    "خواننده",
    "اشخاص معروف",
    "سیاستمدار",
    "شاعر",
    "نویسنده",
    "نقاش",
    "مکان",
    "احساسات",
    "شغل‌",
    "صفت",
    "اشیاء",
    "حیوانات",
    "افراد مهم تاریخی",
    "غذا و خوراکی",
  ]);

  const handleTeamNameChange = (index, value) => {
    const newNames = [...teamNames];
    newNames[index] = value;
    setTeamNames(newNames);
  };

  const toggleCategory = (cat) => {
    if (categories.includes(cat)) {
      setCategories(categories.filter((c) => c !== cat));
    } else {
      setCategories([...categories, cat]);
    }
  };

  const startGame = () => {
    if (teamsCount < 2) {
      alert("حداقل ۲ تیم لازم است");
      return;
    }

    // هر تیم ۲ نفره
    const totalPlayers = teamsCount * 2;

    // ذخیره تنظیمات
    saveGameSettings({
      playersCount: totalPlayers,
      cardsPerPlayer,
      removePerPlayer,
      roundTime,
      categories,
    });

    // ایجاد تیم‌ها و بازیکن‌ها
    createTeams(teamNames.slice(0, teamsCount));
    createPlayers(totalPlayers);
    setGamePhase("selection");

    alert("Setup انجام شد! به مرحله انتخاب کارت بروید...");
    window.location.reload(); // ← اینجا رفرش انجام میشه
  };

  const endGame = () => {
    const confirmEnd = window.confirm(
      "آیا مطمئنی می‌خوای بازی رو به طور کامل تموم کنی؟"
    );

    if (!confirmEnd) return;

    // پاک کردن کل بازی
    localStorage.removeItem("players");
    localStorage.removeItem("teams");
    localStorage.removeItem("game_settings");
    localStorage.removeItem("remaining_cards");

    // ریست game_state
    localStorage.setItem(
      "game_state",
      JSON.stringify({
        round: 1,
        phase: "start",
      })
    );

    window.location.reload();
  };

  return (
    <div className="setup-container">
      <h2>تنظیمات بازی</h2>

      <div className="form-group">
        <label>تعداد تیم‌ها:</label>
        <input
          type="number"
          value={teamsCount}
          min={2}
          max={10}
          onChange={(e) => {
            const val = parseInt(e.target.value);
            setTeamsCount(val);
            setTeamNames(Array.from({ length: val }, (_, i) => `تیم ${i + 1}`));
          }}
        />
      </div>

      {teamNames.map((name, index) => (
        <div className="form-group" key={index}>
          <label>اسم تیم {index + 1}:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => handleTeamNameChange(index, e.target.value)}
          />
        </div>
      ))}

      <div className="form-group">
        <label>تعداد کارت برای هر نفر:</label>
        <input
          type="number"
          value={cardsPerPlayer}
          min={3}
          max={15}
          onChange={(e) => setCardsPerPlayer(parseInt(e.target.value))}
        />
      </div>

      <div className="form-group">
        <label>تعداد کارت‌های قابل حذف برای هر نفر:</label>
        <input
          type="number"
          value={removePerPlayer}
          min={0}
          max={cardsPerPlayer - 1}
          onChange={(e) => setRemovePerPlayer(parseInt(e.target.value))}
        />
      </div>

      <div className="form-group">
        <label>زمان هر تیم (ثانیه):</label>
        <input
          type="number"
          value={roundTime}
          min={10}
          max={120}
          onChange={(e) => setRoundTime(parseInt(e.target.value))}
        />
      </div>

      <div className="form-group">
        <label>دسته‌بندی کارت‌ها:</label>
        <div className="checkbox-group">
          {[
            "ورزشکار",
            "بازیگر و کارگردان",
            "شخصیت",
            "دانشمند",
            "خواننده",
            "اشخاص معروف",
            "سیاستمدار",
            "شاعر",
            "نویسنده",
            "نقاش",
            "مکان",
            "صفت",
            "افراد مهم تاریخی",
            "احساسات",
            "شغل‌",
            "اشیاء",
            "حیوانات",
            "غذا و خوراکی",
            
          ].map((cat) => (
            <>
              <label key={cat}>
                <input
                  type="checkbox"
                  checked={categories.includes(cat)}
                  onChange={() => toggleCategory(cat)}
                />
                {cat}
              </label>
              <br />
            </>
          ))}
        </div>
      </div>

      <button className="start-btn" onClick={startGame}>
        شروع بازی
      </button>

      <div className="end-game">
        <button className="end-btn" onClick={endGame}>
          ⛔ پایان بازی
        </button>
      </div>
    </div>
  );
};

export default Setup;
