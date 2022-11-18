import { Howl } from "howler";
import { FC, useRef, useEffect } from "react";
import { Data } from "./App";
import RainSound from "./assets/sounds/rain.mp3";

const RainSoundPlayer: FC<{ data: Data }> = ({ data }) => {
  let rainRef = useRef<Howl | null>(null);

  useEffect(() => {
    let sound = new Howl({ src: [RainSound], loop: true });
    sound.play();
    rainRef.current = sound;
    return () => {
      sound.stop();
    };
  }, []);

  if (rainRef.current !== null) rainRef.current.volume(data.volume / 100);
  return <></>;
};

export default RainSoundPlayer;
