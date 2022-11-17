import { useEffect, useState, useRef } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";
import Titlebar from "./Titlebar";
import Bottom from "./Bottom";
import ButtonPressSound from "./assets/sounds/ButtonPressSound.wav";
import ButtonReleaseSound from "./assets/sounds/ButtonReleaseSound.wav";
import AlarmSound from "./assets/sounds/AlarmSound1.mp3";
import useSound from "use-sound";
import RainSound from "./assets/sounds/rain.mp3";
import { Howl } from "howler";
import { useLocalStorage } from "react-use";

function App() {
  const [running, setRunning] = useState(false);
  const { width, height } = useWindowSize();
  const [data, setData] = useLocalStorage("data", {
    work: 25,
    break: 5,
    volume: 50,
  });
  const [time, setTime] = useState(data.work * 60);
  const [playButtonPress] = useSound(ButtonPressSound);
  const [playButtonRelease] = useSound(ButtonReleaseSound);
  const [playAlarm] = useSound(AlarmSound);
  const [isBreak, setIsBreak] = useState(false);
  let rainObject = useRef(null);

  useEffect(() => {
    let sound = new Howl({ src: [RainSound], loop: true });
    console.log(RainSound);
    sound.play();
    rainObject.current = sound;
    return () => sound.stop();
  }, []);

  if (rainObject.current !== null) rainObject.current.volume(data.volume / 100);

  useEffect(() => {
    console.log(data);
  }, [data]);

  const restart = () => {
    setTime((isBreak ? data.work : data.break) * 60);
    setRunning(false);
  };

  const handleMouseDown = () => {
    playButtonPress();
  };

  const handleClick = () => {
    playButtonRelease();
    if (!running && time > 0) setRunning(true);
    else if (running) setRunning(false);
    else if (!running) restart();
  };

  const finish = () => {
    setTime(0);
    setRunning(false);
    setIsBreak((x) => !x);
    playAlarm();
  };

  const handleKeyDown = (event) => {
    if (event.key == " ") handleClick();
    if (event.key == "r") restart();
    if (event.key == "f") finish();
    if (event.key !== "Tab") {
      const ele = event.composedPath()[0];
      const isInput =
        ele instanceof HTMLInputElement || ele instanceof HTMLTextAreaElement;
      if (!ele || !isInput || event.key === "Escape") {
        event.preventDefault();
      }
    }
  };

  useEffect(() => {
    console.log("use effect!");

    addEventListener("keypress", handleKeyDown, { capture: true });

    return () => {
      removeEventListener("keypress", handleKeyDown, { capture: true });
    };
  }, [time, running]);

  useInterval(() => {
    if (!running) return;

    if (time > 1) {
      setTime((x) => x - 1);
    } else if (time > 0) {
      finish();
    }
  }, 1000);

  let bgColor = "bg-black";
  if (!running) {
    if (time === 0) bgColor = "bg-green-700";
    else bgColor = "bg-yellow-700";
  }

  return (
    <>
      <Titlebar />
      <Bottom data={data} setData={setData} />
      <div
        className={`select-none h-screen ${bgColor} text-center flex justify-center items-center transition-colors`}
      >
        <Confetti
          width={width}
          height={height}
          numberOfPieces={time === 0 ? 5 : 0}
        />

        {/* Center container */}
        <div className="">
          <span
            className="text-7xl select-none text-white font-extrabold hover:border-2 hover:p-2 cursor-pointer transition-all"
            onClick={() => handleClick()}
            onMouseDown={() => handleMouseDown()}
          >
            {`${Math.floor(time / 60) < 10 ? "0" : ""}${Math.floor(
              time / 60
            )}:${time % 60 < 10 ? "0" : ""}${time % 60}`}
          </span>
        </div>
      </div>
    </>
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
