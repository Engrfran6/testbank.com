'use client';

import MobileNavbar from '@/components/MobileNavbar';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import {RootState} from '@/redux/store';
import {MessageCircle, X} from 'lucide-react'; // Import icons
import {useState} from 'react';
import {useSelector} from 'react-redux';
import ClientLiveChat from './ClientLiveChat';

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  const loggedIn: any = useSelector((state: RootState) => state.user.user);
  const [isChatOpen, setIsChatOpen] = useState(false); // Chat visibility state

  return (
    <>
      <Navbar />

      <section>
        <main className="flex h-screen w-full md:w-[85vw] mx-auto font-inter md:pt-20">
          <Sidebar user={loggedIn} />

          <div className="flex size-full flex-col">
            <div className="root-layout">
              <MobileNavbar user={loggedIn} />
            </div>
            <main className="md:ml-[15.8%] mt-6">{children}</main>
          </div>
        </main>

        {/* Chat Toggle Button */}
        <div className="fixed bottom-5 right-5 flex items-center gap-2">
          <span className="text-sm italic text-blue-700">Contact support</span>
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className=" bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-all">
            {isChatOpen ? <X size={40} /> : <MessageCircle size={40} />}
          </button>
        </div>

        {/* Chat Box */}
        {isChatOpen && (
          <div className="fixed bottom-16 right-5 w-80 max-w-fit bg-white border border-gray-300 shadow-lg rounded-lg z-10">
            <ClientLiveChat />
          </div>
        )}
      </section>
    </>
  );
}
