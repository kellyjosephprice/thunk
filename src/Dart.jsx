import { useEffect, useState, useRef } from "react";

const Dart = ({ x = 0, y = 0 }) => {
  const [style, setStyle] = useState({});
  const ref = useRef();
  const played = useRef(false);

  useEffect(() => {
    const z = 400;
    const maxDistance = Math.sqrt(
      (window.innerWidth / 2) ** 2 + window.innerHeight ** 2 + z ** 2,
    );
    const deg = Math.floor(Math.random() * 360) - 180;
    const a = Math.abs(x - window.innerWidth / 2);
    const b = Math.abs(window.innerHeight - y);
    const distance = Math.sqrt(a ** 2 + b ** 2 + z ** 2);
    const duration = 0.4 * distance;
    const height = 50 + Math.floor(Math.random() * 100);
    let startDeg = (Math.atan(a / b) * 180) / Math.PI;
    const curveX = (0.5 * (maxDistance - distance)) / maxDistance;
    const curveY = distance / maxDistance + 1;
    const curve = `cubic-bezier(${curveX}, ${curveY}, 1, 1)`;

    if (x < window.innerWidth / 2) {
      startDeg *= -1;
    }

    const newStyle = {
      transform: `rotate(${deg}deg) scale(0.2)`,
      top: `${y - 50}px`,
      left: `${x - 50}px`,
      height: `${height}px`,
      transition: `top ${duration}ms ${curve}, left ${duration}ms ease-out, transform ${duration}ms ease-out, height ${duration}ms ${curve}`,
    };

    window.requestAnimationFrame(() => {
      setStyle({ transform: `rotate(${startDeg}deg)` });

      window.requestAnimationFrame(() => {
        setStyle(newStyle);
      });
    });
  }, [x, y]);

  useEffect(() => {
    const cb = () => {
      if (played.current) return;
      played.current = true;

      const nerf = new Audio(process.env.PUBLIC_URL + "/nerf.mp3");
      nerf.volume = 0.1;
      nerf.play();
    };
    ref.current.addEventListener("transitionend", cb);
  }, []);

  return (
    <div className="Dart" style={style} ref={ref}>
      <div className="Head" />
      <div className="Body" />
      <div className="Butt" />
    </div>
  );
};

export default Dart;
