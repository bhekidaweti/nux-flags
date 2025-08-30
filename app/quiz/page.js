"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import flags from "../../data/flags.json";

const Quiz = () => {
  const [score, setScore] = useState(0); // ✅ safe initial default
  const [highScore, setHighScore] = useState(0); // ✅ safe initial default
  const [currentFlag, setCurrentFlag] = useState({});
  const [timer, setTimer] = useState(15);
  const [correctAnswerSelected, setCorrectAnswerSelected] = useState(false);
  const [options, setOptions] = useState([]);
  const [gamePaused, setGamePaused] = useState(false);
  const timerIntervalRef = useRef(null);

  // ✅ Hydrate from sessionStorage on client
  useEffect(() => {
    const storedScore = parseInt(sessionStorage.getItem("score")) || 0;
    const storedHighScore = parseInt(sessionStorage.getItem("highScore")) || 0;
    setScore(storedScore);
    setHighScore(storedHighScore);
  }, []);

  // ✅ Persist score changes
  useEffect(() => {
    sessionStorage.setItem("score", score);
  }, [score]);

  useEffect(() => {
    sessionStorage.setItem("highScore", highScore);
  }, [highScore]);

  const handleTimeUp = useCallback(() => {
    alert("Time's up! Game over 🤔");
  }, []);

  const startTimer = useCallback(() => {
    clearInterval(timerIntervalRef.current);
    timerIntervalRef.current = setInterval(() => {
      setTimer((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerIntervalRef.current);
          handleTimeUp();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  }, [handleTimeUp]);

  const getRandomFlags = useCallback((flagList, correctFlag, numberOfOptions = 4) => {
    const shuffledFlags = [...flagList].sort(() => 0.5 - Math.random());
    let selectedFlags = shuffledFlags.slice(0, numberOfOptions);

    if (!selectedFlags.includes(correctFlag)) {
      const randomIndex = Math.floor(Math.random() * numberOfOptions);
      selectedFlags[randomIndex] = correctFlag;
    }
    return selectedFlags;
  }, []);

  const loadNextFlag = useCallback(() => {
    setCorrectAnswerSelected(false);
    const randomFlag = flags[Math.floor(Math.random() * flags.length)];
    setCurrentFlag(randomFlag);

    const randomOptions = getRandomFlags(flags, randomFlag);
    setOptions(randomOptions);

    setTimer(15);
    startTimer();
  }, [getRandomFlags, startTimer]);

  const resetGame = useCallback(() => {
    setHighScore((prev) => {
      const newHigh = Math.max(prev, score);
      sessionStorage.setItem("highScore", newHigh);
      return newHigh;
    });
    setScore(0);
    setCorrectAnswerSelected(false);
    setGamePaused(false);
    clearInterval(timerIntervalRef.current);
  }, [score]);

  const handleFlagClick = (countryName) => {
    if (correctAnswerSelected) {
      alert("This question has already been answered! Please click continue to load the next quiz.");
      return;
    }

    if (countryName === currentFlag.country) {
      setScore((prevScore) => prevScore + 1);
      clearInterval(timerIntervalRef.current);
      setCorrectAnswerSelected(true);
      alert("Correct! You selected the right flag. 🙂");
      setTimeout(loadNextFlag, 1000);
    } else {
      alert("Incorrect. Game over! 😮");
      resetGame();
    }
  };

  const quitGame = () => {
    setGamePaused(true);
    clearInterval(timerIntervalRef.current);
    if (window.confirm("Are you sure you want to quit the game? 🙄")) {
      setHighScore((prev) => {
        const newHigh = Math.max(prev, score);
        sessionStorage.setItem("highScore", newHigh);
        return newHigh;
      });
      // ⚠️ You call onNavigate("/") here, but I don’t see onNavigate defined in your code
      // Maybe you meant to use Next.js
       router.push("/")
    } else {
      setGamePaused(false);
      startTimer();
    }
  };

  const pauseGame = () => {
    setGamePaused(true);
    clearInterval(timerIntervalRef.current);
  };

  const continueGame = () => {
    setGamePaused(false);
    startTimer();
    loadNextFlag();
  };

  useEffect(() => {
    loadNextFlag();
    return () => clearInterval(timerIntervalRef.current);
  }, [loadNextFlag]);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">🌍 World Flag Quiz</h1>
      <p className="text-center text-gray-700">
        Click the correct flag from the four flags provided that correspond to the country name.
      </p>

      {/* Score & Timer */}
      <div className="flex justify-center space-x-4">
        <div className="px-4 py-2 bg-gray-200 rounded font-semibold flex items-center space-x-1">
          <span>⭐</span>
          <span>Score: {score}</span>
        </div>
        <div className="px-4 py-2 bg-yellow-300 rounded font-semibold">
          High Score: {highScore}
        </div>
        <div className="px-4 py-2 bg-gray-200 rounded font-semibold flex items-center space-x-1">
          <span>⏱️</span>
          <span>{timer}s</span>
        </div>
      </div>

      {/* Game Controls */}
      {!gamePaused && (
        <div className="flex justify-center space-x-4">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={loadNextFlag}
          >
            ▶️ Play
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={quitGame}
          >
            ⏹️ Quit
          </button>
          <button
            className="px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500"
            onClick={pauseGame}
          >
            ⏸️ Pause
          </button>
        </div>
      )}

      {/* Paused Game */}
      {gamePaused && (
        <div className="text-center space-y-2">
          <div className="px-4 py-2 bg-green-200 text-green-800 rounded font-semibold">
            <strong>Game Paused!</strong> Click Play to continue.
          </div>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={continueGame}
          >
            ▶️ Play
          </button>
        </div>
      )}

      {/* Quiz Content */}
      {!gamePaused && currentFlag && (
        <div className="space-y-4">
          {/* Country Name */}
          <div className="text-center">
            <button className="px-6 py-2 bg-green-500 text-white font-bold rounded">
              {currentFlag.country}
            </button>
          </div>

          {/* Flag Options */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {options.map((flag, index) => (
              <div
                key={index}
                className="cursor-pointer border rounded p-2 hover:shadow-lg transition"
                onClick={() => handleFlagClick(flag.country)}
              >
                <img
                  src={flag.image}
                  alt={flag.country}
                  className="w-full h-24 object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;
