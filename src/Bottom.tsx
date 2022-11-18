import {
  useSpring,
  animated,
  useReducedMotion,
  SpringConfig,
} from "@react-spring/web";
import React, { FC, useRef } from "react";
import { useHover, useHoverDirty } from "react-use";
import { Data } from "./App";
import NumberInput from "./NumberInput";

type Props = {
  data: Data;
  setData: React.Dispatch<React.SetStateAction<Data>>;
};

const Bottom: FC<Props> = ({ data, setData }) => {
  const box = useRef<HTMLDivElement>(null);
  const isHovering = useHoverDirty(box);
  // const isHovering = true;
  const config: SpringConfig = {
    tension: 261,
    friction: 19,
    precision: 0.001,
    mass: 1,
  };
  const notchProps = useSpring({
    to: { height: `${isHovering ? 0 : 10}px`, opacity: isHovering ? 0 : 0.5 },
    config: { ...config, precision: 0.1 },
  });
  const bottomProps = useSpring({
    to: { height: `${isHovering ? 100 : 0}%` },
    config,
  });
  return (
    <div ref={box} className="fixed h-[100px] bottom-0 left-0 right-0">
      {/* Container that changes height */}
      <animated.div
        style={bottomProps}
        className="absolute bottom-0 left-0 right-0"
      >
        {/* Notch */}
        <animated.div
          style={notchProps}
          className="pointer-events-none absolute top-[-20px] left-0 right-0 mx-auto w-14 bg-white rounded-full"
        ></animated.div>
        {/* Content */}
        <form
          action=""
          className="left-0 right-0 top-0 flex justify-center gap-3"
        >
          {/* Input */}
          <NumberInput
            label="work"
            value={data.work}
            onChange={(newValue) => setData((x) => ({ ...x, work: newValue }))}
          />
          <NumberInput
            label="break"
            value={data.break}
            onChange={(newValue) => setData((x) => ({ ...x, break: newValue }))}
          />
          <NumberInput
            label="rain"
            min={0}
            max={100}
            value={data.volume}
            onChange={(newValue) =>
              setData((x) => ({ ...x, volume: newValue }))
            }
          />
        </form>
      </animated.div>
    </div>
  );
};
export default Bottom;
