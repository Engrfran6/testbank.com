'use client';

import {logoutAccount} from '@/lib/actions/user.actions';
import {persistor} from '@/redux/store';
import {LucideFlag, SearchCheck, User2Icon} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useDispatch} from 'react-redux';

const Navbar = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogOut = async () => {
    await logoutAccount();

    dispatch({type: 'LOGOUT'});

    // Clear persisted state
    await persistor.purge();
    await persistor.flush(); // Ensures all updates are written before logout

    router.push('/auth/client/sign-in');
  };
  return (
    <nav className="hidden md:flex fixed w-full border-b bg-white  shadow-sm z-50">
      <div className="flex justify-between w-[85vw] h-[6.4rem] mx-auto">
        <Link href="/dashboard/client" className="flex cursor-pointer items-center gap-2">
          <Image
            src="/icons/logo.svg"
            width={500}
            height={500}
            alt="horizon logo"
            className="size-12 max-xl:size-14"
          />

          <h1 className="sidebar-logo">Horizon Bank</h1>
        </Link>
        <div className="flex items-center gap-8 text-[#3589FE]">
          <SearchCheck />
          <LucideFlag />
          <User2Icon />
          <button className="border px-1.5 py-0.5 rounded-md" onClick={handleLogOut}>
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
