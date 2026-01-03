import React, { useState } from "react";
import { setGamePhase } from "../utils/setupHandlers";
import "../assets/css/Start.css";

const Start = () => {
  const [showHelp, setShowHelp] = useState(false);

  const startGame = () => {
    setGamePhase("setup");
    window.location.reload();
  };

  return (
    <div className="start-page">
      {/* آیکون آموزش */}
      <div className="help-icon" onClick={() => setShowHelp(true)}>
        ❓
      </div>

      {/* عنوان بازی */}
      <h1 className="game-title">🎉 Times Up 🎉</h1>
      <p className="game-subtitle">بازی گروهی، هیجان‌انگیز و خنده‌دار</p>

      {/* دکمه شروع */}
      <button className="start-game-btn" onClick={startGame}>
        شروع بازی
      </button>

      {/* مودال آموزش */}
      {showHelp && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>📘 آموزش بازی</h2>

            <ul>
              <li>🔹 بازیکنان به تیم‌های دو نفره تقسیم می‌شوند</li>
              <li>🔹 هر بازیکن چند کارت وارد می‌کند</li>
              <li>🔹 در هر دور، تیم‌ها به نوبت بازی می‌کنند</li>
              <li>🔹 در هر دور اول : هر تیم با توضیح دادن سعی میکند کلمه را به هم تیمی خود بفهماند</li>
              <li>🔹 در هر دور دوم : هر تیم فقط با کفتن یک کلمه سعی میکند کلمه را به هم تیمی خود بفهماند</li>
              <li>🔹 در هر دور سوم : هر تیم فقط با بازی پانتومیم سعی میکند کلمه را به هم تیمی خود بفهماند</li>
              <li>🔹 با گفتن هر کارت، امتیاز می‌گیرید</li>
              <li>🔹 تیمی که بیشترین امتیاز را بگیرد برنده است</li>
            </ul>

            <button className="close-btn" onClick={() => setShowHelp(false)}>
              فهمیدم 👍
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Start;
