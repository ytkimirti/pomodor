import { useSpring, animated, useReducedMotion } from "@react-spring/web";
import { useRef } from "react";
import { useHover, useHoverDirty } from "react-use";
import NumberInput from "./NumberInput";

export default function Bottom({ data, setData }) {
  const box = useRef();
  const isHovering = useHoverDirty(box);
  // const isHovering = true;
  const config = {
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
            time={data.work}
            setTime={(newTime) => setData((x) => ({ ...x, work: newTime }))}
          />
          <NumberInput
            label="break"
            time={data.break}
            setTime={(newTime) => setData((x) => ({ ...x, break: newTime }))}
          />
        </form>
      </animated.div>
    </div>
  );
}
