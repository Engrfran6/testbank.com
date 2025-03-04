'use client';

import MobileNavbar from '@/components/MobileNavbar';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import {RootState} from '@/redux/store';
import {useState} from 'react';
import {useSelector} from 'react-redux';

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  const loggedIn: any = useSelector((state: RootState) => state.user.user);
  const [isChatOpen, setIsChatOpen] = useState(false); // Chat visibility state

  return (
    <>
      <Navbar />

      <section>
        <main className="flex w-full md:w-[80vw] mx-auto font-inter md:pt-10">
          <Sidebar user={loggedIn} />

          <div className="flex  size-full flex-col">
            <div className="root-layout">
              <MobileNavbar user={loggedIn} />
            </div>
            <main className=" md:mt-8">{children}</main>
          </div>
        </main>

        {/* Chat Toggle Button */}
        {/* <div className="fixed bottom-5 right-5 flex items-center gap-2">
          <span className="text-sm italic text-blue-700">Contact support</span>
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className=" bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-all">
            {isChatOpen ? <X size={40} /> : <MessageCircle size={40} />}
          </button>
        </div> */}

        {/* Chat Box */}
        {/* {isChatOpen && (
          <div className="fixed bottom-[5.3rem] right-5  max-w-fit bg-white border border-gray-300 shadow-lg rounded-lg z-10">
            <ClientLiveChat />
          </div>
        )} */}
      </section>
    </>
  );
}
