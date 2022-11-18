import { useState, FC } from "react";
import Titlebar from "./Titlebar";
import Bottom from "./Bottom";
import Timer from "./Timer";
import RainSoundPlayer from "./RainSoundPlayer";

export type Data = {
  work: number;
  break: number;
  volume: number;
};

const App: FC = () => {
  const [data, setData] = useState<Data>({
    work: 25,
    break: 5,
    volume: 50,
  });

  return (
    <>
      <RainSoundPlayer data={data} />
      <Titlebar />
      <Bottom data={data} setData={setData} />
      <Timer data={data} />
    </>
  );
};

export default App;
