import {HeaderBoxProps} from '@/types';
import {StopCircleIcon, VerifiedIcon} from 'lucide-react';

const HeaderBox = ({type = 'title', title, subtext, user, verifyState}: HeaderBoxProps) => {
  function getPersonalizedGreeting(name: string) {
    const hours = new Date().getHours();
    let greeting = '';

    if (hours < 12) {
      greeting = 'Good morning';
    } else if (hours < 18) {
      greeting = 'Good afternoon';
    } else {
      greeting = 'Good evening';
    }

    return (
      <div className="flex gap-1">
        <p className="text-xl">
          {greeting}, <span className="text-bankGradient">{name}</span> |
        </p>
        <div className="align-sub text-[8px] leading-5">
          {!verifyState && user?.verification === 'Verified' ? (
            <p className="text-green-600 underline flex items-center gap-0.5">
              <VerifiedIcon size={18} /> verified
            </p>
          ) : (
            <p className="text-red-600 underline flex items-center gap-0.5">
              <StopCircleIcon size={18} /> unverified
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="header-box">
      <h1 className="header-box-title">
        {type === 'greeting' && user ? getPersonalizedGreeting(user.firstname) : title}
      </h1>
      <p className="header-box-subtext">{subtext}</p>
    </div>
  );
};

export default HeaderBox;
