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


  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault(); // جلوگیری از popup پیش‌فرض
      setDeferredPrompt(e);
      setShowInstall(true); // نمایش دکمه نصب
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

    const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;

    if (choice.outcome === "accepted") {
      console.log("User accepted the install");
    }

    setDeferredPrompt(null);
    setShowInstall(false);
  };


  return (
    <>

      {showInstall && (
        <button onClick={handleInstall} style={{ position: "fixed", bottom: 20 }}>
          نصب برنامه
        </button>
      )}
      {phase === "setup" && <Setup />}
      {phase === "selection" && <PlayerCardSelection />}
      {phase === "main_game" && <MainGame />}
      {phase === "score" && <Score />}
    </>
  );
};

export default App;
