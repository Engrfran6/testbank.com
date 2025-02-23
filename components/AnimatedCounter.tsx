'use client';
import {useCountUp} from 'use-count-up';

const AnimatedCounter = ({amount}: {amount: number}) => {
  const {value} = useCountUp({
    isCounting: true,
    end: amount | 0,
    duration: 0.4,
    decimalPlaces: 2,
  });

  return (
    <span>
      <span className="currency-type">$</span>
      {value}
    </span>
  );
};

export default AnimatedCounter;
