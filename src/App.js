// App.jsx
import React, { useState, useEffect } from "react";
import Setup from "./pages/Setup";
import PlayerCardSelection from "./pages/PlayerCardSelection";
import MainGame from "./pages/MainGame";
import Score from "./pages/Score";

const App = () => {
  const [phase, setPhase] = useState(
    JSON.parse(localStorage.getItem("game_state"))?.phase || "setup"
  );

  // هر 200ms بررسی کن phase تو localStorage تغییر کرده؟
  useEffect(() => {
    const interval = setInterval(() => {
      const storedPhase = JSON.parse(localStorage.getItem("game_state"))?.phase;
      if (storedPhase && storedPhase !== phase) {
        setPhase(storedPhase);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [phase]);
  

  return (
    <>

      {phase === "setup" && <Setup />}
      {phase === "selection" && <PlayerCardSelection />}
      {phase === "main_game" && <MainGame />}
      {phase === "score" && <Score />}
    </>
  );
};

export default App;
