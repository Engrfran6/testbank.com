'use client';

import {RootState} from '@/redux/store';
import {useEffect} from 'react';
import {useSelector} from 'react-redux';

// Extend TypeScript definition
declare global {
  interface Window {
    Tawk_API?: any;
  }
}

const TawkChat = () => {
  const user = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    // Prevent reloading if already initialized
    if (window.Tawk_API) return;

    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_API.onLoad = function () {
      window.Tawk_API.setAttributes(
        {
          name: user?.firstname || 'Guest',
          email: user?.email,
        },
        function (error: any) {
          console.log('Tawk.to User Attributes Set', error);
        }
      );
    };

    const script = document.createElement('script');
    script.src = 'https://embed.tawk.to/67c3a093ba8d7c1912f30bf3/1ila2mh4v';
    script.async = true;
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');

    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return null; // No UI needed, just loads the script
};

export default TawkChat;
