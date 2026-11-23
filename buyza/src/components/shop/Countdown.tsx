import { useEffect, useState } from "react";
export function Countdown() {
  const [t, setT] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const end = new Date(d);
      end.setHours(24, 0, 0, 0);
      setT(end.getTime() - d.getTime());
    };
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, []);
  const s = Math.floor((t ?? 0) / 1000);
  const parts = [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60];
  return (
    <div className="flex gap-1.5">
      {parts.map((v, i) => (
        <span
          key={i}
          className="rounded-lg bg-primary px-2 py-1 font-mono text-sm font-bold text-primary-foreground"
        >
          {t === null ? "--" : String(v).padStart(2, "0")}
        </span>
      ))}
    </div>
  );
}
