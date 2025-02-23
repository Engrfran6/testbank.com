'use client';

import MobileNavbar from '@/components/MobileNavbar';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import {RootState} from '@/redux/store';
import {useSelector} from 'react-redux';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const loggedIn: any = useSelector((state: RootState) => state.user.user);

  return (
    <>
      <Navbar />

      <main className="flex h-screen w-full md:w-[85vw] mx-auto  font-inter md:pt-20">
        <Sidebar user={loggedIn} />

        <div className="flex size-full flex-col">
          <div className="root-layout">
            <MobileNavbar user={loggedIn} />
          </div>
          <main className="md:ml-[15.8%] mt-6">{children}</main>
        </div>
      </main>
    </>
  );
}
