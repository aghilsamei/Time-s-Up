// pages/PlayerCardSelection.jsx
import React, { useState, useEffect } from "react";
import "../assets/css/playerCards.css";
import allCards from "../data/cards.json"; 
import { setGamePhase } from "../utils/setupHandlers";

const PlayerCardSelection = () => {
  const [players, setPlayers] = useState([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [playerCards, setPlayerCards] = useState([]);
  const [selectedToRemove, setSelectedToRemove] = useState([]);
  const [remainingDeck, setRemainingDeck] = useState([]); // کارت‌های باقی‌مانده

  useEffect(() => {
    const storedPlayers = JSON.parse(localStorage.getItem("players")) || [];
    const gameSettings = JSON.parse(localStorage.getItem("game_settings")) || {};
    setPlayers(storedPlayers);

    // ساخت deck اولیه بر اساس دسته‌بندی انتخاب شده
    const initialDeck = allCards.filter(c => gameSettings.categories.includes(c.category));
    setRemainingDeck(initialDeck);

    // کارت‌های بازیکن اول
    if (storedPlayers.length > 0 && gameSettings.cardsPerPlayer) {
      const { cards, newDeck } = pickRandomCards(gameSettings.cardsPerPlayer, initialDeck);
      setPlayerCards(cards);
      setRemainingDeck(newDeck);
    }
  }, []);

  // تابع انتخاب کارت بدون تکرار
  const pickRandomCards = (count, deck) => {
    const shuffled = [...deck].sort(() => 0.5 - Math.random());
    const cards = shuffled.slice(0, count);
    const newDeck = deck.filter(c => !cards.includes(c)); // حذف کارت‌های انتخاب شده از deck
    return { cards, newDeck };
  };

  const toggleCard = (card) => {
    const alreadySelected = selectedToRemove.includes(card);
    const gameSettings = JSON.parse(localStorage.getItem("game_settings"));

    if (!alreadySelected && selectedToRemove.length >= gameSettings.removePerPlayer) return;

    if (alreadySelected) {
      setSelectedToRemove(selectedToRemove.filter(c => c !== card));
    } else {
      setSelectedToRemove([...selectedToRemove, card]);
    }
  };

  const confirmSelection = () => {
    const gameSettings = JSON.parse(localStorage.getItem("game_settings"));

    // ✅ بررسی تعداد دقیق کارت‌های انتخابی
    if (selectedToRemove.length !== gameSettings.removePerPlayer) {
      alert(`شما باید دقیقاً ${gameSettings.removePerPlayer} کارت را انتخاب کنید!`);
      return; // اجازه رفتن به مرحله بعدی را نمی‌دهد
    }

    const updatedPlayers = [...players];
    updatedPlayers[currentPlayerIndex].removedCards = selectedToRemove;
    updatedPlayers[currentPlayerIndex].givenCards = playerCards.filter(c => !selectedToRemove.includes(c));

    localStorage.setItem("players", JSON.stringify(updatedPlayers));
    setPlayers(updatedPlayers);

    const nextIndex = currentPlayerIndex + 1;

    if (nextIndex < updatedPlayers.length) {
      setCurrentPlayerIndex(nextIndex);
      const { cards, newDeck } = pickRandomCards(gameSettings.cardsPerPlayer, remainingDeck);
      setPlayerCards(cards);
      setRemainingDeck(newDeck);
      setSelectedToRemove([]);
    } else {
      // همه بازیکن‌ها کارت‌هاشون رو انتخاب کردن → شروع بازی اصلی
      setGamePhase("main_game");
      alert("همه بازیکنان کارت‌های خود را انتخاب کردند! بازی اصلی شروع می‌شود.");
    }
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
      phase: "start",
    })
  );

  window.location.reload();
};


  if (players.length === 0) return <div>هیچ بازیکنی پیدا نشد!</div>;

  const gameSettings = JSON.parse(localStorage.getItem("game_settings"));

  return (
    <div className="player-container">
      <h2>بازیکن {players[currentPlayerIndex].name} کارت‌های خود را انتخاب کنید</h2>
      <div className="info">
        تعداد کارت‌های قابل حذف باقی‌مانده: {gameSettings.removePerPlayer - selectedToRemove.length}
      </div>

      <div className="cards-grid">
        {playerCards.map((card, idx) => (
          <div
            key={idx}
            className={`card ${selectedToRemove.includes(card) ? "selected" : ""}`}
            onClick={() => toggleCard(card)}
          >
            <div>{card.title}</div>
            <div style={{ fontSize: "0.8rem", color: "#aaa" }}>{card.category}</div>
          </div>
        ))}
      </div>

      <button className="confirm-btn" onClick={confirmSelection}>
        تایید کارت‌ها
      </button>

      
<div className="end-game">
  <button className="end-btn" onClick={endGame}>
    ⛔ پایان بازی
  </button>
</div>
    </div>
  );
};

export default PlayerCardSelection;
