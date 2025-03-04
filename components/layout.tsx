'use client';

import {Bell, ChevronDown, FileText, LogOut, Menu, Users, X} from 'lucide-react';
import Link from 'next/link';
import {ReactNode, useState} from 'react';

import {Button} from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {logoutAdminAccount} from '@/lib/actions/user.actions';
import {persistor} from '@/redux/store';
import Image from 'next/image';
import {useRouter} from 'next/navigation';
import {useDispatch} from 'react-redux';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({children}: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false); // Chat visibility state
  const dispatch = useDispatch();
  const router = useRouter();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogOut = async () => {
    await logoutAdminAccount();

    dispatch({type: 'LOGOUT'});

    // Clear persisted state
    await persistor.purge();
    await persistor.flush(); // Ensures all updates are written before logout

    router.push('/auth/admin/sign-in');
  };

  return (
    <div className="min-h-screen bg-gray-300">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/dashboard/admin">
                  <span className="text-2xl font-bold text-blue-600">BankAdmin</span>
                </Link>
              </div>
              <div
                className={`${
                  isMenuOpen
                    ? 'flex flex-col absolute right-0 top-[4.2rem] bg-white h-1/3 w-1/3'
                    : 'hidden'
                } sm:ml-6 md:flex sm:space-x-8`}>
                <Link
                  href="/dashboard/admin/users"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  <Users className="mr-2 h-4 w-4" />
                  Users
                </Link>

                <Link
                  href="/dashboard/admin/reports"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  <FileText className="mr-2 h-4 w-4" />
                  Reports
                </Link>
                <div
                  onClick={handleLogOut}
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </div>
              </div>
            </div>
            <div
              className={`${
                isMenuOpen ? 'flex flex-col' : 'flex'
              } hidden sm:ml-6 sm:flex sm:items-center`}>
              <Button variant="ghost" size="icon" className="ml-3">
                <Bell className="h-6 w-6" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="ml-3">
                    <Image
                      className="h-8 w-8 rounded-full"
                      src="https://github.com/shadcn.png"
                      alt="Admin"
                      width={500}
                      height={500}
                    />
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogOut}>Sign out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="-mr-2 flex items-center sm:hidden">
              <button onClick={toggleMenu} className="md:hidden text-gray-700 focus:outline-none">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <div className="max-w-full mx-auto  py-6 sm:px-6 lg:px-8">{children}</div>
        {/* Chat Toggle Button */}
        {/* <div className="fixed bottom-5 right-5 flex items-center gap-2">
          <span className="text-sm italic text-blue-700">Chat with client</span>
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className=" bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-all">
            {isChatOpen ? <X size={40} /> : <MessageCircle size={40} />}
          </button>
        </div> */}

        {/* Chat Box */}
        {/* {isChatOpen && (
          <div className=" fixed bottom-[5.3rem] right-5  max-w-fit bg-green-900 border border-gray-300 shadow-lg rounded-lg z-10">
            <AdminLiveChat />
          </div>
        )} */}
      </main>
    </div>
  );
}
