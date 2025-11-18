import { useCallback, useEffect, useState } from "react";
import throttle from "lodash.throttle";

import "./App.css";

import Dart from "./Dart";
import Github from "./Github";
import Placeholder from "./Placeholder";

function App() {
  const [coords, setCoords] = useState(null);
  const [darts, setDarts] = useState([]);
  const [started, setStarted] = useState(false);

  const startFiring = useCallback(
    (event) => setCoords({ x: event.clientX, y: event.clientY }),
    [],
  );
  const stopFiring = useCallback(() => setCoords(null), []);
  const updateCoords = useCallback(
    (event) => {
      if (!coords) return;
      startFiring(event);
    },
    [coords, startFiring],
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fireDart = useCallback(
    throttle(
      ({ x, y, darts }) => {
        const fire = new Audio(process.env.PUBLIC_URL + "/fire.wav");
        const volume = Math.random() ** 2 * 0.02 + 0.07;
        fire.volume = volume;
        fire.play();

        setTimeout(() => {
          const offset = Math.random() * Math.random() * 150;
          const theta = Math.random() * 2 * Math.PI;
          const xOffset = offset * Math.cos(theta);
          const yOffset = offset * Math.sin(theta);

          setDarts([
            ...darts,
            <Dart key={Date.now()} x={x + xOffset} y={y + yOffset} />,
          ]);
        }, 100);
      },
      125,
      { leading: false },
    ),
    [],
  );

  const fireOnce = fireDart.flush;

  useEffect(() => {
    if (!coords) return;
    if (!started) setStarted(true);

    fireDart({ ...coords, darts });
  }, [coords, darts, fireDart, started]);

  return (
    <div
      className="App"
      onClick={fireOnce}
      onPointerDown={startFiring}
      onPointerUp={stopFiring}
      onPointerLeave={stopFiring}
      onPointerMove={updateCoords}
    >
      <Placeholder done={started} />
      <Github start={started} />
      {darts}
    </div>
  );
}

export default App;
