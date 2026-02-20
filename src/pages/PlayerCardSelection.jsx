import React, { useState, useEffect } from "react";
import "../assets/css/playerCards.css";
import allCards from "../data/cards.json";
import { setGamePhase } from "../utils/setupHandlers";

const PlayerCardSelection = () => {
  const [players, setPlayers] = useState([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [playerCards, setPlayerCards] = useState([]);
  const [selectedToRemove, setSelectedToRemove] = useState([]);
  const [remainingDeck, setRemainingDeck] = useState([]);
  const [lang, setLang] = useState("fa");

  useEffect(() => {
    const settings = JSON.parse(localStorage.getItem("game_settings")) || {};
    const currentLang = settings.language || "fa";
    setLang(currentLang);
    document.documentElement.dir = currentLang === "fa" ? "rtl" : "ltr";

    const storedPlayers = JSON.parse(localStorage.getItem("players")) || [];
    setPlayers(storedPlayers);

    const initialDeck = allCards.filter((c) =>
      settings.categories.includes(c.category[currentLang])
    );
    setRemainingDeck(initialDeck);

    if (storedPlayers.length > 0 && settings.cardsPerPlayer) {
      const { cards, newDeck } = pickRandomCards(settings.cardsPerPlayer, initialDeck);
      setPlayerCards(cards);
      setRemainingDeck(newDeck);
    }
  }, []);

  const pickRandomCards = (count, deck) => {
    const shuffled = [...deck].sort(() => 0.5 - Math.random());
    const cards = shuffled.slice(0, count);
    const newDeck = deck.filter((c) => !cards.includes(c));
    return { cards, newDeck };
  };

  const toggleCard = (card) => {
    const settings = JSON.parse(localStorage.getItem("game_settings"));
    const alreadySelected = selectedToRemove.includes(card);
    if (!alreadySelected && selectedToRemove.length >= settings.removePerPlayer) return;

    if (alreadySelected) {
      setSelectedToRemove(selectedToRemove.filter((c) => c !== card));
    } else {
      setSelectedToRemove([...selectedToRemove, card]);
    }
  };

  const confirmSelection = () => {
    const settings = JSON.parse(localStorage.getItem("game_settings"));
    if (selectedToRemove.length !== settings.removePerPlayer) {
      alert(
        lang === "fa"
          ? `شما باید دقیقاً ${settings.removePerPlayer} کارت را انتخاب کنید!`
          : `You must select exactly ${settings.removePerPlayer} cards!`
      );
      return;
    }

    const updatedPlayers = [...players];
    updatedPlayers[currentPlayerIndex].removedCards = selectedToRemove;
    updatedPlayers[currentPlayerIndex].givenCards = playerCards.filter(
      (c) => !selectedToRemove.includes(c)
    );

    localStorage.setItem("players", JSON.stringify(updatedPlayers));
    setPlayers(updatedPlayers);

    const nextIndex = currentPlayerIndex + 1;
    if (nextIndex < updatedPlayers.length) {
      setCurrentPlayerIndex(nextIndex);
      const settings = JSON.parse(localStorage.getItem("game_settings"));
      const { cards, newDeck } = pickRandomCards(settings.cardsPerPlayer, remainingDeck);
      setPlayerCards(cards);
      setRemainingDeck(newDeck);
      setSelectedToRemove([]);
    } else {
      setGamePhase("main_game");
      alert(
        lang === "fa"
          ? "همه بازیکنان کارت‌های خود را انتخاب کردند! بازی اصلی شروع می‌شود."
          : "All players have selected their cards! Main game starts."
      );
    }
  };

  const endGame = () => {
    const confirmEnd = window.confirm(
      lang === "fa"
        ? "آیا مطمئنی می‌خوای بازی رو به طور کامل تموم کنی؟"
        : "Are you sure you want to end the game completely?"
    );
    if (!confirmEnd) return;

    localStorage.removeItem("players");
    localStorage.removeItem("teams");
    localStorage.removeItem("game_settings");
    localStorage.removeItem("remaining_cards");

    localStorage.setItem(
      "game_state",
      JSON.stringify({ round: 1, phase: "start" })
    );

    window.location.reload();
  };

  if (players.length === 0)
    return <div>{lang === "fa" ? "هیچ بازیکنی پیدا نشد!" : "No players found!"}</div>;

  const settings = JSON.parse(localStorage.getItem("game_settings"));

  return (
    <div className="player-container">
      <h2>
        {lang === "fa"
          ? `بازیکن ${players[currentPlayerIndex].name} کارت‌های خود را انتخاب کنید`
          : `Player ${players[currentPlayerIndex].name}, select your cards`}
      </h2>

      <div className="info">
        {lang === "fa"
          ? `تعداد کارت‌های قابل حذف باقی‌مانده: ${
              settings.removePerPlayer - selectedToRemove.length
            }`
          : `Remaining removable cards: ${
              settings.removePerPlayer - selectedToRemove.length
            }`}
      </div>

      <div className="cards-grid">
        {playerCards.map((card, idx) => (
          <div
            key={idx}
            className={`card ${selectedToRemove.includes(card) ? "selected" : ""}`}
            onClick={() => toggleCard(card)}
          >
            <div>{lang === "fa" ? card.title_fa : card.title_en}</div>
            <div style={{ fontSize: "0.8rem", color: "#aaa" }}>
              {lang === "fa" ? card.category.fa : card.category.en}
            </div>
          </div>
        ))}
      </div>

      <button className="confirm-btn" onClick={confirmSelection}>
        {lang === "fa" ? "تایید کارت‌ها" : "Confirm Cards"}
      </button>

      <div className="end-game">
        <button className="end-btn" onClick={endGame}>
          {lang === "fa" ? "⛔ پایان بازی" : "⛔ End Game"}
        </button>
      </div>
    </div>
  );
};

export default PlayerCardSelection;