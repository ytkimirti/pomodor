import { useSpring, animated, config, useSpringRef } from "@react-spring/web";
import React, { ChangeEventHandler, FC, useRef, useState } from "react";
import useSound from "use-sound";
import SwitchOnSound from "./assets/sounds/SwitchOnSound.mp3";

type Props = {
  label: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (newValue: number) => void;
};

const NumberInput: FC<Props> = ({ label, value, onChange, min, max }) => {
  const [pressed, setPressed] = useState(false);
  const scale = useSpring({
    scale: pressed ? 0.9 : 1,
    config: { tension: 300, friction: 20, mass: 1 },
  });

  const [playTick] = useSound(SwitchOnSound);
  const springRef = useSpringRef();
  const translateY = useSpring({
    ref: springRef,
    translateY: 0,
    config: { tension: 3000, friction: 5, precision: 0.1, mass: 0.5 },
  });

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    // On a key is pressed
    playTick();

    console.log(springRef.current);

    springRef.start({ translateY: 20 });
    setTimeout(() => springRef.start({ translateY: 0 }), 30);
    onChange(+e.target.value);
  };

  return (
    <div>
      <span className="block font-bold text-white text-center">{label}</span>
      <animated.div style={{ ...scale, ...translateY }}>
        <input
          className="w-[80px] h-[70px] no-increment 
        bg-transparent text-center text-5xl font-extrabold 
        text-white border-[1.5px] rounded-md selection-white
        focus:outline-none border-transparent hover:border-white cursor-pointer transition-all"
          type="number"
          min={min ?? "0"}
          max={max ?? "240"}
          value={value}
          onChange={handleChange}
          onMouseDown={(e) => {
            (e.target as HTMLInputElement).select();
            e.preventDefault();
            setPressed(true);
          }}
          onClick={() => setPressed(false)}
          onMouseLeave={() => setPressed(false)}
        />
      </animated.div>
    </div>
  );
};

export default NumberInput;
