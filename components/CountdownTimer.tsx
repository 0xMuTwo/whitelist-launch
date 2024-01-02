import { useEffect, useState, FC, useCallback } from 'react';

type TimeLeft = {
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
};

type CountdownTimerProps = {
  targetDate: Date;
};

const CountdownTimer: FC<CountdownTimerProps> = ({ targetDate }) => {
  const calculateTimeLeft = useCallback((): TimeLeft => {
    const difference = +targetDate - +new Date();
    let timeLeft: TimeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  }, [targetDate]);

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  }, [calculateTimeLeft]);

  const timerComponents = (Object.keys(timeLeft) as Array<keyof TimeLeft>).reduce((components, interval) => {
    const value = timeLeft[interval];
    if (value !== undefined) {
      return [
        ...components,
        <span key={interval}>
          {value} {interval}{" "}
        </span>,
      ];
    }
    return components;
  }, [] as JSX.Element[]);

  return (
    <div>
      {timerComponents.length ? timerComponents : <span>Time&apos;s up!</span>}
    </div>
  );
};

export default CountdownTimer;