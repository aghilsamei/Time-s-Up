import React, { useState, useEffect, useRef } from "react";
import "../assets/css/mainGame.css";
import { setGamePhase } from "../utils/setupHandlers";

const MainGame = () => {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [teamStarted, setTeamStarted] = useState(false);
  const [remainingCards, setRemainingCards] = useState([]);
  const [lang, setLang] = useState("fa");

  const timerRef = useRef(null);
  const correctSoundRef = useRef(null);
  const audioRef = useRef(null);
  const [audioStarted, setAudioStarted] = useState(false);

  useEffect(() => {
    const settings = JSON.parse(localStorage.getItem("game_settings")) || {};
    const currentLang = settings.language || "fa";
    setLang(currentLang);
    document.documentElement.dir = currentLang === "fa" ? "rtl" : "ltr";

    correctSoundRef.current = new Audio(process.env.PUBLIC_URL + "/sounds/correct.mp3");
    audioRef.current = new Audio(process.env.PUBLIC_URL + "/sounds/timer.mp3");
    audioRef.current.loop = true;

    const storedPlayers = JSON.parse(localStorage.getItem("players")) || [];
    const storedTeams = JSON.parse(localStorage.getItem("teams")) || [];
    setPlayers(storedPlayers);
    setTeams(storedTeams);

    // جمع کردن همه کارت‌ها و shuffle
    const allCards = storedPlayers.flatMap((p) => p.givenCards).sort(() => 0.5 - Math.random());
    setRemainingCards(allCards);

    const gameSettings = JSON.parse(localStorage.getItem("game_settings")) || {};
    setTimeLeft(gameSettings.roundTime || 30);
  }, []);

  useEffect(() => {
    localStorage.setItem("remaining_cards", JSON.stringify(remainingCards));
  }, [remainingCards]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (timerRunning) {
      if (!audioStarted) {
        audioRef.current.currentTime = 4;
        setAudioStarted(true);
      }
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [timerRunning]);

  useEffect(() => {
    if (timerRunning && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
        if (navigator.vibrate) {
          if (timeLeft === 3 || timeLeft === 2) navigator.vibrate(120);
          if (timeLeft === 1) navigator.vibrate([200, 100, 200]);
        }
      }, 1000);
    } else if (timeLeft === 0 && timerRunning) {
      setTimerRunning(false);
      if (navigator.vibrate) navigator.vibrate([400, 150, 400]);
      nextTeam();
    }
    return () => clearTimeout(timerRef.current);
  }, [timeLeft, timerRunning]);

  const startTimer = () => {
    if (timerRunning) return;
    const gameSettings = JSON.parse(localStorage.getItem("game_settings")) || {};
    if (timeLeft === 0) setTimeLeft(gameSettings.roundTime || 30);

    setTimerRunning(true);
    setTeamStarted(true);
    if (audioRef.current) {
      audioRef.current.loop = true;
      if (!audioStarted) {
        audioRef.current.currentTime = 3;
        setAudioStarted(true);
      }
      audioRef.current.play().catch(() =>
        alert(lang === "fa"
          ? "برای پخش صدا، لطفا یکبار روی دکمه تایمر کلیک کن!"
          : "To play sound, please click the timer button once!"
        )
      );
    }
  };

  const nextCard = (correct = true) => {
    const updatedTeams = [...teams];
    if (correct) updatedTeams[currentTeamIndex].score += 1;
    setTeams(updatedTeams);
    localStorage.setItem("teams", JSON.stringify(updatedTeams));

    const newRemaining = remainingCards.slice(1);
    setRemainingCards(newRemaining);

    if (correct && correctSoundRef.current) {
      correctSoundRef.current.currentTime = 0;
      correctSoundRef.current.play().catch(() => {});
    }

    if (newRemaining.length === 0) {
      setTimerRunning(false);
      alert(
        lang === "fa"
          ? "تمام کارت‌های دور بازی تمام شد! امتیازات نمایش داده می‌شود."
          : "All round cards are finished! Scores will be displayed."
      );
      setGamePhase("score");
    }
  };

  const skipCard = () => {
    if (remainingCards.length > 1) {
      const newRemaining = [...remainingCards];
      const current = newRemaining.shift();
      newRemaining.push(current);
      setRemainingCards(newRemaining.sort(() => 0.5 - Math.random()));
    }
  };

  const nextTeam = () => {
    const nextIndex = (currentTeamIndex + 1) % teams.length;
    setRemainingCards([...remainingCards].sort(() => 0.5 - Math.random()));
    setCurrentTeamIndex(nextIndex);
    // setCurrentCardIndex(0);
    setTimeLeft(0);
    setTimerRunning(false);
    setAudioStarted(false);
    setTeamStarted(false);
  };

  const endGame = () => {
    if (!window.confirm(lang === "fa" ? "آیا مطمئنی می‌خوای بازی رو به طور کامل تموم کنی؟" : "Are you sure you want to end the game?")) return;

    localStorage.removeItem("players");
    localStorage.removeItem("teams");
    localStorage.removeItem("game_settings");
    localStorage.removeItem("remaining_cards");
    localStorage.setItem("game_state", JSON.stringify({ round: 1, phase: "start" }));
    window.location.reload();
  };

  if (players.length === 0 || teams.length === 0)
    return <div>{lang === "fa" ? "در حال بارگذاری..." : "Loading..."}</div>;

  return (
    <div className="main-game-container">
      <h2 className="current-team">
        🎯 {lang === "fa" ? "تیم فعلی" : "Current Team"}: <span>{teams[currentTeamIndex].name}</span>
      </h2>

      <div className={`timer ${timeLeft <= 10 ? "danger" : ""}`}>
        ⏱ {timeLeft} {lang === "fa" ? "ثانیه" : "seconds"}
      </div>

      {remainingCards.length > 0 && (
        <div className={`card neon ${!timerRunning ? "card-blur" : ""}`}>
          <div className="card-title">
            {timerRunning
              ? lang === "fa"
                ? remainingCards[0].title_fa
                : remainingCards[0].title_en
              : lang === "fa"
              ? "🔒 کارت مخفی"
              : "🔒 Hidden Card"}
          </div>
          <div className="card-category">
            {timerRunning
              ? lang === "fa"
                ? remainingCards[0].category.fa
                : remainingCards[0].category.en
              : ""}
          </div>
        </div>
      )}

      <div className="buttons">
        {timerRunning && (
          <>
            <button className="btn-correct" onClick={() => nextCard(true)}>
              {lang === "fa" ? "✅ درست" : "✅ Correct"}
            </button>
            <button onClick={() => setTimerRunning(!timerRunning)}>
              {timerRunning ? (lang === "fa" ? "⏸ توقف" : "⏸ Pause") : (lang === "fa" ? "▶️ ادامه" : "▶️ Resume")}
            </button>
          </>
        )}

        {!timerRunning && <button onClick={startTimer}>
          {lang === "fa" ? `▶️ تیم ${teams[currentTeamIndex].name}` : `▶️ Team ${teams[currentTeamIndex].name}`}
        </button>}

        {(() => {
          const gameState = JSON.parse(localStorage.getItem("game_state")) || { round: 1 };
          if (timerRunning && gameState.round > 1) {
            return <button onClick={skipCard}>{lang === "fa" ? "⏭ رد کردن کارت" : "⏭ Skip Card"}</button>;
          }
          return null;
        })()}
      </div>

      <div className="scores">
        <h3>{lang === "fa" ? "📊 امتیاز تیم‌ها" : "📊 Teams Scores"}</h3>
        {teams.map((team, i) => (
          <div key={team.id} className={`score-row ${i === currentTeamIndex ? "active" : ""}`}>
            <span>{team.name}</span>
            <span>{team.score}</span>
          </div>
        ))}
      </div>

      <div className="end-game">
        <button className="end-btn" onClick={endGame}>
          {lang === "fa" ? "⛔ پایان بازی" : "⛔ End Game"}
        </button>
      </div>
    </div>
  );
};

export default MainGame;