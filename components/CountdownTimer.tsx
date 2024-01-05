import React, { useEffect, useState, FC, useCallback } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownTimerProps {
  targetDate: Date;
}

const CountdownTimer: FC<CountdownTimerProps> = ({ targetDate }) => {
  const calculateTimeLeft = useCallback((): TimeLeft => {
    const nowUTC = Date.now();
    const targetUTC = targetDate.getTime();

    const difference = targetUTC - nowUTC;

    return {
      days: Math.max(0, Math.floor(difference / (1000 * 60 * 60 * 24))),
      hours: Math.max(0, Math.floor((difference / (1000 * 60 * 60)) % 24)),
      minutes: Math.max(0, Math.floor((difference / 1000 / 60) % 60)),
      seconds: Math.max(0, Math.floor((difference / 1000) % 60)),
    };
  }, [targetDate]);

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  const { days, hours, minutes, seconds } = timeLeft;

  return (
    <div>
      {days || hours || minutes || seconds ? (
        <>
          {days} {days === 1 ? 'DAY' : 'DAYS'}{' '}
          {hours} {hours === 1 ? 'HOUR' : 'HOURS'}{' '}
          {minutes} {minutes === 1 ? 'MINUTE' : 'MINUTES'}{' '}
          {seconds} {seconds === 1 ? 'SECOND' : 'SECONDS'}
        </>
      ) : (
        <span>Time&apos;s up!</span>
      )}
    </div>
  );
};

export default CountdownTimer;