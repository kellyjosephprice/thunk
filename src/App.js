import { useCallback, useEffect, useState, useRef } from "react";
import throttle from "lodash.throttle";

import "./App.css";

import Dart from "./Dart";
import Github from "./Github";
import Placeholder from "./Placeholder";

const RATE_LIMIT = 250;
const SOUND_LIMIT = 100;
const PRECISION_COOLDOWN = 1000;

function App() {
  const [coords, setCoords] = useState(null);
  const [darts, setDarts] = useState([]);
  const [started, setStarted] = useState(false);
  const thenRef = useRef(null);

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

        const then = thenRef.current;

        let precision = 100;
        if (then) {
          const period = Date.now() - then;

          if (period > RATE_LIMIT) {
            precision = Math.max(
              0,
              Math.min(100, 100 * ((period - RATE_LIMIT) / PRECISION_COOLDOWN)),
            );
          }
        }

        thenRef.current = Date.now();

        setTimeout(() => {
          const offsetRange = 25 + (175 * (100 - precision)) / 100;
          const offset = Math.random() * offsetRange;
          const theta = Math.random() * 2 * Math.PI;
          const xOffset = offset * Math.cos(theta);
          const yOffset = offset * Math.sin(theta);

          setDarts([
            ...darts,
            <Dart key={Date.now()} x={x + xOffset} y={y + yOffset} />,
          ]);
          // fire.wav has 100ms of silence
        }, SOUND_LIMIT);
      },
      RATE_LIMIT,
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
