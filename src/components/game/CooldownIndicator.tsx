'use client';

interface CooldownIndicatorProps {
  remainingMs: number;
  totalMs: number;
}

export default function CooldownIndicator({ remainingMs, totalMs }: CooldownIndicatorProps) {
  const isReady = remainingMs <= 0;
  const seconds = Math.max(0, Math.ceil(remainingMs / 1000));
  const progress = totalMs > 0 ? ((totalMs - remainingMs) / totalMs) * 100 : 100;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-lg font-semibold">
        {isReady ? (
          <span className="text-green-400">Ready to fire!</span>
        ) : (
          <span className="text-yellow-400">Cooldown: {seconds}s</span>
        )}
      </div>
      <div className="w-48 h-2 bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-100 ${
            isReady ? 'bg-green-500' : 'bg-yellow-500'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="text-sm text-slate-400">
        {isReady ? 'Click an enemy cell to fire' : 'Wait for cooldown...'}
      </div>
    </div>
  );
}
