'use client';

import MobileNavbar from '@/components/MobileNavbar';
import Navbar from '@/components/Navbar';
import {RootState} from '@/redux/store';
import {useSelector} from 'react-redux';
export const dynamic = 'force-dynamic';

export default function DashboardLayout({children}: Readonly<{children: React.ReactNode}>) {
  const loggedIn: any = useSelector((state: RootState) => state.user.user);

  return (
    <section>
      <Navbar />
      <main className="flex w-full container  mx-auto font-inter md:pt-28">
        {/* <Sidebar user={loggedIn} /> */}
        <div className="flex  size-full flex-col">
          <div className="root-layout">
            <MobileNavbar user={loggedIn} />
          </div>
          <main className=" md:mt-8">{children}</main>
        </div>
      </main>
    </section>
  );
}
