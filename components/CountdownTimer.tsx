'use client';

import { useEffect, useState } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

interface CountdownTimerProps {
  endDate: string; // ISO string
}

export default function CountdownTimer({ endDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const calculate = () => {
      const diff = new Date(endDate).getTime() - Date.now();
      if (diff <= 0) {
        setExpired(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / 86_400_000),
        hours: Math.floor((diff % 86_400_000) / 3_600_000),
        minutes: Math.floor((diff % 3_600_000) / 60_000),
        seconds: Math.floor((diff % 60_000) / 1_000),
      });
    };

    calculate();
    const id = setInterval(calculate, 1000);
    return () => clearInterval(id);
  }, [endDate]);

  if (expired) {
    return (
      <div className="text-orange-400 font-black text-sm uppercase tracking-widest">
        Çekiliş Sona Erdi
      </div>
    );
  }

  const units: { label: string; value: number }[] = [
    { label: 'GÜN',   value: timeLeft.days    },
    { label: 'SAAT',  value: timeLeft.hours   },
    { label: 'DAK',   value: timeLeft.minutes },
    { label: 'SAN',   value: timeLeft.seconds },
  ];

  return (
    <div className="flex items-center gap-2">
      {units.map((u, i) => (
        <div key={u.label} className="flex items-center gap-2">
          <div className="flex flex-col items-center">
            <div
              className="
                w-14 h-14 rounded-lg flex items-center justify-center
                bg-black/60 border border-zinc-700/60
                font-black text-2xl text-white tabular-nums
                shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]
              "
            >
              {pad(u.value)}
            </div>
            <span className="text-[9px] font-black text-zinc-500 mt-1 tracking-[0.12em]">
              {u.label}
            </span>
          </div>
          {i < units.length - 1 && (
            <span className="text-[#00E676] font-black text-xl mb-4 select-none">:</span>
          )}
        </div>
      ))}
    </div>
  );
}
