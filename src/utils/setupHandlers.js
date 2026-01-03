// utils/setupHandlers.js

export const saveGameSettings = (settings) => {
  localStorage.setItem("game_settings", JSON.stringify(settings));
};

export const createTeams = (teamNames) => {
  const teams = teamNames.map((name, index) => ({
    id: index + 1,
    name,
    score: 0,
  }));

  localStorage.setItem("teams", JSON.stringify(teams));
  return teams;
};

export const createPlayers = (count) => {
  const players = Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `بازیکن ${i + 1}`,
    givenCards: [],
    removedCards: [],
  }));

  localStorage.setItem("players", JSON.stringify(players));
  return players;
};

export const setGamePhase = (phase) => {
  // اگر game_state هنوز وجود نداشته باشه، یک آبجکت خالی بساز
  const state = JSON.parse(localStorage.getItem("game_state")) || {};
  state.phase = phase;
  localStorage.setItem("game_state", JSON.stringify(state));
};
