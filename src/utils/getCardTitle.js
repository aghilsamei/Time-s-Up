// utils/getCardTitle.js
export const getCardTitle = (card) => {
  const settings = JSON.parse(localStorage.getItem("game_settings")) || {};
  const lang = settings.language || "fa";
  return lang === "fa" ? card.title_fa : card.title_en;
};

export const getCategory = (card) => {
  const settings = JSON.parse(localStorage.getItem("game_settings")) || {};
  const lang = settings.language || "fa";
  return card.category[lang] || card.category.fa;
};