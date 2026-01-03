// pages/MainGame.jsx
import React, { useState, useEffect, useRef } from "react";
import "../assets/css/mainGame.css"; 
import { setGamePhase } from "../utils/setupHandlers";

const MainGame = () => {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [cards, setCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [askLastCard, setAskLastCard] = useState(false); // ⚡ اضافه شد
  const timerRef = useRef(null);
  const [remainingCards, setRemainingCards] = useState([]); // ⚡ کارت‌های باقی‌مانده کل دور

  const audioRef = useRef(null);
  const [audioStarted, setAudioStarted] = useState(false); // ⚡ برای شروع اولیه آهنگ از ثانیه 3



useEffect(() => {
  audioRef.current = new Audio("/sounds/timer.mp3");
  audioRef.current.loop = true; // تکرار آهنگ
}, []);

// کنترل پخش آهنگ با تایمر
useEffect(() => {
  if (!audioRef.current) return;

  if (timerRunning) {
    if (!audioStarted) {
      audioRef.current.currentTime = 4; // فقط بار اول از ثانیه 3 شروع کن
      setAudioStarted(true);
    }
    audioRef.current.play();
  } else {
    audioRef.current.pause();
  }
}, [timerRunning]);
// پاکسازی هنگام خروج از صفحه
useEffect(() => {
  return () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };
}, []);

 useEffect(() => {
  const storedPlayers = JSON.parse(localStorage.getItem("players")) || [];
  const storedTeams = JSON.parse(localStorage.getItem("teams")) || [];
  const gameSettings = JSON.parse(localStorage.getItem("game_settings")) || {};

  setPlayers(storedPlayers);
  setTeams(storedTeams);

  // همه کارت‌ها جمع‌آوری و shuffle می‌شوند
  const allCards = storedPlayers.flatMap(p => p.givenCards).sort(() => 0.5 - Math.random());
  setRemainingCards(allCards);
  setCards([allCards[0]]); // کارت اول برای شروع نمایش داده می‌شود
  setCurrentCardIndex(0);
  setTimeLeft(gameSettings.roundTime);
}, []);

  useEffect(() => {
    if (timerRunning && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && timerRunning) {
      setTimerRunning(false);
      setAskLastCard(true); // ⚡ وقتی تایمر تموم شد، دیالوگ نمایش داده شود
    }
    return () => clearTimeout(timerRef.current);
  }, [timeLeft, timerRunning]);

  const startTimer = () => {
  if (timerRunning) return; // اگر تایمر در حال اجراست کاری نکن

  const gameSettings = JSON.parse(localStorage.getItem("game_settings"));

  // اگر timeLeft صفره یعنی هنوز تایمر شروع نشده → مقدار اولیه بگذار
  if (timeLeft === 0) {
    setTimeLeft(gameSettings.roundTime);
  }

  setTimerRunning(true);
  setAskLastCard(false);
};


  
const nextCard = (correct = true) => {
  const updatedTeams = [...teams];
  if (correct) updatedTeams[currentTeamIndex].score += 1;
  setTeams(updatedTeams);
  localStorage.setItem("teams", JSON.stringify(updatedTeams));

  const newRemaining = remainingCards.slice(1); // کارت فعلی برداشته شد
  setRemainingCards(newRemaining);

  if (newRemaining.length > 0) {
    setCards([newRemaining[0]]); // کارت بعدی نمایش داده شود
    setCurrentCardIndex(0);
  } else {
    // تمام کارت‌ها بازی شدند → پایان دور
    setTimerRunning(false);
    setAskLastCard(false);
    alert("تمام کارت‌های دور بازی تمام شد! امتیازات نمایش داده می‌شود.");
    setGamePhase("score"); // وارد صفحه امتیازات شو
  }
};


const handleLastCardAnswer = (said) => {
  let newRemaining = [...remainingCards];
  const updatedTeams = [...teams];

  if (said) {
    // امتیاز بده
    updatedTeams[currentTeamIndex].score += 1;
    setTeams(updatedTeams);
    localStorage.setItem("teams", JSON.stringify(updatedTeams));

    // کارت فعلی حذف شود
    newRemaining.shift();
  }

  // در هر دو حالت کارت‌ها shuffle شوند
  newRemaining = newRemaining.sort(() => 0.5 - Math.random());
  setRemainingCards(newRemaining);

  setAskLastCard(false);
  setTimerRunning(false);

  // اگر کارت‌ها تمام شدند → پایان بازی
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
  // همه کارت‌ها دوباره shuffle شوند
  const allCards = players.flatMap(p => p.givenCards).sort(() => 0.5 - Math.random());
  setRemainingCards(allCards);
  setCards([allCards[0]]);
  setCurrentTeamIndex(0);
  setCurrentCardIndex(0);
  setTimerRunning(false);
};

const endGame = () => {
  const confirmEnd = window.confirm("آیا مطمئنی می‌خوای بازی رو به طور کامل تموم کنی؟");

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
      phase: "setup",
    })
  );

  window.location.reload();
};




  if (players.length === 0 || teams.length === 0) return <div>در حال بارگذاری...</div>;

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
          <>
            <button onClick={() => nextCard(true)}>درست</button>

             {/* دکمه توقف */}
      <button onClick={() => setTimerRunning(false)}>⏸ توقف تایمر</button>
          </>
        )}

      {!timerRunning && !askLastCard && (
  <button onClick={() => startTimer()}>
    {timeLeft === 0
      ? `شروع تیم ${teams[currentTeamIndex].name}` // تایمر هنوز شروع نشده یا تیم عوض شده
      : "شروع تایمر ⏯"} 
  </button>
)}



        {askLastCard && (
          <div style={{ marginTop: "15px" }}>
            <p>آیا آخرین کارت گفته شد؟</p>
            <button onClick={() => handleLastCardAnswer(true)}>بله</button>
            <button onClick={() =>{
              handleLastCardAnswer(false)
            } }>خیر</button>
          </div>
        )}

        {/* {!timerRunning && currentCardIndex >= cards.length - 1 && !askLastCard && (
          <button onClick={nextTeam}>شروع تیم بعدی</button>
        )} */}
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
