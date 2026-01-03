//utils/initCards
import cards from "../data/cards.json";

export const initDatabase = () => {
  // 1️⃣ کارت‌ها
  if (!localStorage.getItem("cards")) {
    localStorage.setItem("cards", JSON.stringify(cards));
  }

  // 2️⃣ تنظیمات بازی
  if (!localStorage.getItem("game_settings")) {
    localStorage.setItem(
      "game_settings",
      JSON.stringify({
        playersCount: 0,
        cardsPerPlayer: 7,
        removePerPlayer: 2,
        roundTime: 36,
        categories: []
      })
    );
  }

  // 3️⃣ وضعیت بازی
  if (!localStorage.getItem("game_state")) {
    localStorage.setItem(
      "game_state",
      JSON.stringify({
        round: 1,
        phase: "setup",
        currentPlayer: 0,
        currentTeam: 0,
        players: [],
        teams: [],
        deck: [],
        usedCards: []
      })
    );
  }
};
