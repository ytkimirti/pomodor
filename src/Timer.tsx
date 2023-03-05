import { FC, useState, useEffect } from "react";
import Confetti from "react-confetti";
import { useWindowSize, useInterval } from "react-use";
import useSound from "use-sound";
import { Data } from "./App";
import ButtonPressSound from "./assets/sounds/ButtonPressSound.wav";
import ButtonReleaseSound from "./assets/sounds/ButtonReleaseSound.wav";
import AlarmSound from "./assets/sounds/AlarmSound1.mp3";

type TimerProps = {
  data: Data;
};

const Timer: FC<TimerProps> = ({ data }) => {
  const { width, height } = useWindowSize();
  const [playButtonPress] = useSound(ButtonPressSound);
  const [playButtonRelease] = useSound(ButtonReleaseSound);
  const [playAlarm] = useSound(AlarmSound);

  const [running, setRunning] = useState(false);
  const [time, setTime] = useState<number>(data.work * 60);
  const [isBreak, setIsBreak] = useState(false);

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

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key == " ") handleClick();
    if (event.key == "r") restart();
    if (event.key == "f") finish();
    if (event.key !== "Tab") {
      try {
        const ele = (event as any).composedPath()[0];
        const isInput =
          ele instanceof HTMLInputElement || ele instanceof HTMLTextAreaElement;
        if (!ele || !isInput || event.key === "Escape") {
          event.preventDefault();
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    addEventListener("keypress", handleKeyDown, { capture: true });

    return () => {
      removeEventListener("keypress", handleKeyDown, { capture: true });
    };
  }, [time, running]);

  useEffect(() => {
    let lastTime = Date.now();

    const int = setInterval(() => {
      const diffSecs = Math.floor((Date.now() - lastTime) / 1000);
      console.log(diffSecs);
      if (diffSecs < 1) return;
      lastTime = Date.now();

      setTime((s) => (diffSecs > s ? 0 : s - diffSecs));
    }, 100);
    return () => clearInterval(int);
  }, [setTime]);

  let bgColor = "bg-black";
  if (!running) {
    if (time === 0) bgColor = "bg-green-700";
    else bgColor = "bg-yellow-700";
  }

  return (
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
          {`${Math.floor(time / 60) < 10 ? "0" : ""}${Math.floor(time / 60)}:${
            time % 60 < 10 ? "0" : ""
          }${time % 60}`}
        </span>
      </div>
    </div>
  );
};

export default Timer;
