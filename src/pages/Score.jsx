// pages/Score.jsx
import React, { useState, useEffect, useMemo } from "react";
import { setGamePhase } from "../utils/setupHandlers";
import "../assets/css/score.css";

const Score = () => {
  const [round, setRound] = useState(1);
  const [lang, setLang] = useState("fa");

  const teams = JSON.parse(localStorage.getItem("teams")) || [];
  const players = JSON.parse(localStorage.getItem("players")) || [];

  const maxScore = Math.max(...teams.map((t) => t.score), 0);

  // 🧠 تشخیص برنده یا مساوی
  const winnerTeams = useMemo(
    () => teams.filter((t) => t.score === maxScore && maxScore !== 0),
    [teams, maxScore]
  );

  const isTie = winnerTeams.length > 1;

  // 🎉 تولید کاغذ رنگی
  const confettiPieces = useMemo(() => {
    if (isTie || winnerTeams.length === 0) return [];
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 4 + Math.random() * 4,
    }));
  }, [isTie, winnerTeams.length]);

  // ترجمه‌ها
  const t = {
    fa: {
      endRound: "🏁 پایان دور",
      nextRound: "🚀 شروع دور بعدی",
      endGame: "⛔ پایان بازی",
      gameOver: "🎉 بازی به پایان رسید!",
      winners: "🏆 تیم برنده",
      tie: "🤝 مساوی",
      confirmEnd: "آیا مطمئنی می‌خوای بازی رو به طور کامل تموم کنی؟",
      and: " و ",
    },
    en: {
      endRound: "🏁 Round End",
      nextRound: "🚀 Start Next Round",
      endGame: "⛔ End Game",
      gameOver: "🎉 Game Over!",
      winners: "🏆 Winning Team",
      tie: "🤝 Tie",
      confirmEnd: "Are you sure you want to end the game?",
      and: " & ",
    },
  };

  useEffect(() => {
    const settings = JSON.parse(localStorage.getItem("game_settings")) || {};
    setLang(settings.language || "fa");

    const gameState = JSON.parse(localStorage.getItem("game_state")) || {};
    setRound(gameState.round || 1);
  }, []);

  const startNextRound = () => {
    let gameState =
      JSON.parse(localStorage.getItem("game_state")) || { round: 1 };
    const newRound = (gameState.round || 1) + 1;

    if (newRound > 3) {
      alert(t[lang].gameOver);

      const winners = teams
        .filter((t) => t.score === maxScore)
        .map((t) => t.name)
        .join(t[lang].and);

      alert(`${t[lang].winners}: ${winners}`);
      endGame();
      return;
    }

    gameState.round = newRound;
    localStorage.setItem("game_state", JSON.stringify(gameState));

    const allCards = players
      .flatMap((p) => p.givenCards)
      .sort(() => 0.5 - Math.random());

    localStorage.setItem("remaining_cards", JSON.stringify(allCards));
    setGamePhase("main_game");
    window.location.reload();
  };

  const endGame = () => {
    const confirmEnd = window.confirm(t[lang].confirmEnd);
    if (!confirmEnd) return;

    localStorage.removeItem("players");
    localStorage.removeItem("teams");
    localStorage.removeItem("game_settings");
    localStorage.removeItem("remaining_cards");
    localStorage.removeItem("game_state");

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
      {/* 🎉 CONFETTI */}
      {!isTie && confettiPieces.length > 0 && (
        <div className="confetti-container">
          {confettiPieces.map((c) => (
            <span
              key={c.id}
              className="confetti"
              style={{
                left: `${c.left}%`,
                animationDelay: `${c.delay}s`,
                animationDuration: `${c.duration}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="score-card">
        <h2>
          {t[lang].endRound} {round}
        </h2>

        {/* 🏆 یا مساوی */}
        {isTie && maxScore !== 0 && (
          <div className="tie-text">{t[lang].tie}</div>
        )}

        <div className="team-scores">
          {teams.map((team) => {
            const isWinner =
              !isTie && team.score === maxScore && maxScore !== 0;

            return (
              <div
                key={team.id}
                className={`team-row ${isWinner ? "winner" : ""}`}
              >
                <span className="team-name">
                  {team.name} {isWinner && "🏆"}
                </span>
                <span className="team-score">{team.score}</span>
              </div>
            );
          })}
        </div>

        {round < 3 && (
          <button className="next-round-btn" onClick={startNextRound}>
            {t[lang].nextRound}
          </button>
        )}

        <div className="end-game">
          <button className="end-btn" onClick={endGame}>
            {t[lang].endGame}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Score;