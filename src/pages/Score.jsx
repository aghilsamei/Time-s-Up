// pages/Score.jsx
import React, { useState, useEffect } from "react";
import { setGamePhase } from "../utils/setupHandlers";
import "../assets/css/score.css";

const Score = () => {
  const [round, setRound] = useState(1);
  const teams = JSON.parse(localStorage.getItem("teams")) || [];
  const players = JSON.parse(localStorage.getItem("players")) || [];

  const maxScore = Math.max(...teams.map(t => t.score), 0);

  useEffect(() => {
    const gameState = JSON.parse(localStorage.getItem("game_state")) || {};
    setRound(gameState.round || 1);
  }, []);

  const startNextRound = () => {
    let gameState = JSON.parse(localStorage.getItem("game_state")) || { round: 1 };
    const newRound = (gameState.round || 1) + 1;

    if (newRound > 3) {
      alert("🎉 بازی به پایان رسید!");
      const winners = teams.filter(t => t.score === maxScore).map(t => t.name).join(" و ");
      alert(`🏆 تیم برنده: ${winners}`);
      endGame();
      return;
    }

    gameState.round = newRound;
    localStorage.setItem("game_state", JSON.stringify(gameState));

    const allCards = players
      .flatMap(p => p.givenCards)
      .sort(() => 0.5 - Math.random());

    localStorage.setItem("remaining_cards", JSON.stringify(allCards));
    setGamePhase("main_game");
    window.location.reload();
  };

  const endGame = () => {
    const confirmEnd = window.confirm("آیا مطمئنی می‌خوای بازی رو به طور کامل تموم کنی؟");
    if (!confirmEnd) return;

    // پاک کردن کل بازی
    localStorage.removeItem("players");
    localStorage.removeItem("teams");
    localStorage.removeItem("game_settings");
    localStorage.removeItem("remaining_cards");
    localStorage.removeItem("game_state");

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
    <div className="score-page">
      <div className="score-card">
        <h2>🏁 پایان دور {round}</h2>

        <div className="team-scores">
          {teams.map(team => (
            <div
              key={team.id}
              className={`team-row ${
                team.score === maxScore && maxScore !== 0 ? "winner" : ""
              }`}
            >
              <span className="team-name">{team.name}</span>
              <span className="team-score">{team.score}</span>
            </div>
          ))}
        </div>

        {round < 3 && (
          <button className="next-round-btn" onClick={startNextRound}>
            🚀 شروع دور بعدی
          </button>
        )}

        <div className="end-game">
          <button className="end-btn" onClick={endGame}>
            ⛔ پایان بازی
          </button>
        </div>
      </div>
    </div>
  );
};

export default Score;
