'use client';

import {logoutAccount} from '@/lib/actions/user.actions';
import {persistor, RootState} from '@/redux/store';
import {
  AccessibilityIcon,
  BanknoteIcon,
  ChevronDown,
  ContactIcon,
  DownloadIcon,
  LucideFlag,
  SettingsIcon,
  User2Icon,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useDispatch, useSelector} from 'react-redux';
import Sidebar from './Sidebar';
import {Button} from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

const Navbar = () => {
  const user = useSelector((state: RootState) => state.user.user);
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
    <nav className="hidden md:flex flex-col justify-start items-center pb-4 fixed w-full border-b bg-white  shadow-sm z-50">
      <div className="flex justify-between container  h-[6.4rem] mx-auto border-b">
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
        <div className="flex items-center gap-8 text-[#2960a7]">
          <LucideFlag />
          <Link href="/dashboard/client/account-settings ">
            <User2Icon />
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="cursor-pointer flex items-center">
                <SettingsIcon size={25} />
                <ChevronDown size={20} />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 text-sm relative top-9 pt-4">
              <DropdownMenuItem className="cursor-pointer">
                <DownloadIcon />
                <Link href="/dashboard/client/deposit-funds">Deposit</Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <ContactIcon />
                <Link href="/dashboard/client/contact-support">Contact Support</Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <AccessibilityIcon />
                <Link href="/dashboard/client/savings-account">View Savings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <BanknoteIcon />
                <Link href="/dashboard/client/checking-account">Checking Account</Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <SettingsIcon />
                <Link href="/dashboard/client/account-settings">Account settings</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="ghost"
            className="border-2  px-3 py-0.5 rounded-md font-bold"
            onClick={handleLogOut}>
            Sign out
          </Button>
        </div>
      </div>
      <Sidebar user={user!} />
    </nav>
  );
};
export default Navbar;
