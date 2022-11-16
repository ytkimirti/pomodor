import { useEffect, useState, useRef } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";

function App() {
  const timerTime = 2;
  const [running, setRunning] = useState(false);
  const [time, setTime] = useState(timerTime);
  const { width, height } = useWindowSize();

  const restart = () => {
    setTime(timerTime);
    setRunning(false);
  };

  const handleClick = () => {
    if (!running && time > 0) setRunning(true);
    else if (running) setRunning(false);
    else if (!running) restart();
  };

  const finish = () => {
    setTime(0);
    setRunning(false);
  };

  useInterval(() => {
    if (time > 0) {
      if (!running) return;
      setTime((x) => x - 1);

      if (time <= 1) finish();
    } else if (running) {
      finish();
    }
  }, 1000);

  let bgColor = "bg-black";
  if (!running) {
    if (time === 0) bgColor = "bg-green-700";
    else bgColor = "bg-yellow-700";
  }

  return (
    <div
      className={`h-screen ${bgColor} text-center flex justify-center items-center transition-colors`}
    >
      <Confetti
        width={width}
        height={height}
        numberOfPieces={time === 0 ? 100 : 0}
      />

      {/* Center container */}
      <div className="">
        <span
          className="text-7xl select-none text-white font-extrabold hover:border-2 hover:p-2 cursor-pointer transition-all"
          onClick={() => handleClick()}
        >
          {time}
        </span>
      </div>
    </div>
  );
}

// source: https://overreacted.io/making-setinterval-declarative-with-react-hooks/
function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

// https://stackoverflow.com/a/2998874/1673761
const twoDigits = (num) => String(num).padStart(2, "0");

export default App;
