// pages/MainGame.jsx
import React, { useState, useEffect, useRef } from "react";
import "../assets/css/mainGame.css";
import { setGamePhase } from "../utils/setupHandlers";

const MainGame = () => {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [cards, setCards] = useState([]);
  const [remainingCards, setRemainingCards] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [askLastCard, setAskLastCard] = useState(false);

  const timerRef = useRef(null);
  const audioRef = useRef(null);

  // بارگذاری اولیه فایل صدا
  useEffect(() => {
    audioRef.current = new Audio(process.env.PUBLIC_URL + "/sounds/timer.mp3");

    audioRef.current.loop = true;
  }, []);

  // پاکسازی هنگام خروج از صفحه
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      clearTimeout(timerRef.current);
    };
  }, []);

  // بارگذاری اولیه بازیکنان، تیم‌ها و کارت‌ها
  useEffect(() => {
    const storedPlayers = JSON.parse(localStorage.getItem("players")) || [];
    const storedTeams = JSON.parse(localStorage.getItem("teams")) || [];
    const gameSettings = JSON.parse(localStorage.getItem("game_settings")) || { roundTime: 60 };

    setPlayers(storedPlayers);
    setTeams(storedTeams);

    const allCards = storedPlayers
      .flatMap((p) => p.givenCards)
      .sort(() => 0.5 - Math.random());

    setRemainingCards(allCards);
    setCards([allCards[0]]);
    setCurrentCardIndex(0);
    setTimeLeft(gameSettings.roundTime);
  }, []);

  // تایمر
  useEffect(() => {
    if (timerRunning && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && timerRunning) {
      setTimerRunning(false);
      setAskLastCard(true);
    }

    return () => clearTimeout(timerRef.current);
  }, [timeLeft, timerRunning]);

  // توقف خودکار صدا وقتی تایمر متوقف شد
  useEffect(() => {
    if (!timerRunning && audioRef.current) {
      audioRef.current.pause();
    }
  }, [timerRunning]);

  // شروع تایمر با تعامل کاربر
 const startTimer = () => {
  if (timerRunning) return;

  const gameSettings = JSON.parse(localStorage.getItem("game_settings")) || { roundTime: 60 };
  if (timeLeft === 0) setTimeLeft(gameSettings.roundTime);

  setTimerRunning(true);
  setAskLastCard(false);

  // 🔊 حتما با تعامل کاربر
  if (audioRef.current) {
    audioRef.current.loop = true;
    audioRef.current.currentTime = 0;

    // play با catch برای بلاک شدن
    audioRef.current.play().catch((err) => {
      console.log("پخش صدا بلاک شد:", err);
      alert("برای پخش صدا، لطفا یکبار روی دکمه تایمر کلیک کن!");
    });
  }
};


  // کارت بعدی
  const nextCard = (correct = true) => {
    const updatedTeams = [...teams];
    if (correct) updatedTeams[currentTeamIndex].score += 1;

    setTeams(updatedTeams);
    localStorage.setItem("teams", JSON.stringify(updatedTeams));

    const newRemaining = remainingCards.slice(1);
    setRemainingCards(newRemaining);

    if (newRemaining.length > 0) {
      setCards([newRemaining[0]]);
      setCurrentCardIndex(0);
    } else {
      setTimerRunning(false);
      setAskLastCard(false);
      if (audioRef.current) audioRef.current.pause();
      alert("تمام کارت‌های دور بازی تمام شد! امتیازات نمایش داده می‌شود.");
      setGamePhase("score");
    }
  };

  // پاسخ به آخرین کارت
  const handleLastCardAnswer = (said) => {
    const updatedTeams = [...teams];
    let newRemaining = [...remainingCards];

    if (said) {
      updatedTeams[currentTeamIndex].score += 1;
      setTeams(updatedTeams);
      localStorage.setItem("teams", JSON.stringify(updatedTeams));
      newRemaining.shift();
    }

    newRemaining = newRemaining.sort(() => 0.5 - Math.random());
    setRemainingCards(newRemaining);

    setAskLastCard(false);
    setTimerRunning(false);

    if (newRemaining.length === 0) {
      alert("تمام کارت‌های دور بازی تمام شد!");
      setGamePhase("score");
      return;
    }

    nextTeam();
  };

  const nextTeam = () => {
    const nextIndex = (currentTeamIndex + 1) % teams.length;
    setCurrentTeamIndex(nextIndex);
    setCurrentCardIndex(0);
    setTimerRunning(false);
  };

  const startNextRound = () => {
    const allCards = players
      .flatMap((p) => p.givenCards)
      .sort(() => 0.5 - Math.random());

    setRemainingCards(allCards);
    setCards([allCards[0]]);
    setCurrentTeamIndex(0);
    setCurrentCardIndex(0);
    setTimerRunning(false);
  };

  const endGame = () => {
    if (!window.confirm("آیا مطمئنی می‌خوای بازی رو به طور کامل تموم کنی؟")) return;

    localStorage.removeItem("players");
    localStorage.removeItem("teams");
    localStorage.removeItem("game_settings");
    localStorage.removeItem("remaining_cards");

    localStorage.setItem(
      "game_state",
      JSON.stringify({ round: 1, phase: "setup" })
    );

    window.location.reload();
  };

  if (players.length === 0 || teams.length === 0)
    return <div>در حال بارگذاری...</div>;

  return (
    <div className="main-game-container">
      <h2 className="current-team">
        🎯 تیم فعلی: <span>{teams[currentTeamIndex].name}</span>
      </h2>

      <div className={`timer ${timeLeft <= 10 ? "danger" : ""}`}>
        ⏱ {timeLeft} ثانیه
      </div>

      {remainingCards.length > 0 && (
        <div className="card neon">
          <div className="card-title">{remainingCards[0].title}</div>
          <div className="card-category">{remainingCards[0].category}</div>
        </div>
      )}

      <div className="buttons">
        {timerRunning && (
          <button
            onClick={() => setTimerRunning(false)}
          >
            ⏸ توقف تایمر
          </button>
        )}

        {!timerRunning && !askLastCard && (
          <button onClick={startTimer}>
            {timeLeft === 0
              ? `شروع تیم ${teams[currentTeamIndex].name}`
              : "شروع تایمر ⏯"}
          </button>
        )}

        {askLastCard && (
          <div style={{ marginTop: "15px" }}>
            <p>آیا آخرین کارت گفته شد؟</p>
            <button onClick={() => handleLastCardAnswer(true)}>بله</button>
            <button onClick={() => handleLastCardAnswer(false)}>خیر</button>
          </div>
        )}
      </div>

      <div className="scores">
        <h3>📊 امتیاز تیم‌ها</h3>
        {teams.map((team, i) => (
          <div
            key={team.id}
            className={`score-row ${i === currentTeamIndex ? "active" : ""}`}
          >
            <span>{team.name}</span>
            <span>{team.score}</span>
          </div>
        ))}
      </div>

      <div className="end-game">
        <button className="end-btn" onClick={endGame}>
          ⛔ پایان بازی
        </button>
      </div>
    </div>
  );
};

export default MainGame;
