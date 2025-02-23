'use client';

import {logoutAccount} from '@/lib/actions/user.actions';
import {maskEmail} from '@/lib/utils';
import {RootState} from '@/redux/store';
import {FooterProps} from '@/types';
import Image from 'next/image';
import {useRouter} from 'next/navigation';
import {useSelector} from 'react-redux';

const Footer = ({type = 'desktop'}: FooterProps) => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user.user);

  if (!user) return;

  const handleLogOut = async () => {
    await logoutAccount();

    router.push('/sign-in');
  };

  return (
    <footer className="footer">
      <div className={type === 'mobile' ? 'footer_name-mobile' : 'footer_name'}>
        <p className="text-xl font-bold text-gray-700">{user?.firstname[0]}</p>
      </div>

      <div className={type === 'mobile' ? 'footer_email-mobile' : 'footer_email'}>
        <h1 className="text-14 truncate text-gray-700 font-semibold">
          {user?.firstname} | {user?.lastname}
        </h1>
        <p className="text-14 truncate font-normal text-gray-600">
          {maskEmail(JSON.stringify(user?.email))}
        </p>
      </div>

      <div className="footer_image" onClick={handleLogOut}>
        <Image src="/icons/logout.svg" priority fill alt="user" />
      </div>
    </footer>
  );
};

export default Footer;
