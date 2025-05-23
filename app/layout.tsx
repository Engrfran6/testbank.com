export const dynamic = 'force-dynamic';

import TawkChat from '@/components/ui/Tawk';
import {Toaster} from '@/components/ui/toaster';
import {IBM_Plex_Serif, Inter} from 'next/font/google';
import './globals.css';
import ReduxProvider from './ReduxProvider';

const inter = Inter({subsets: ['latin'], variable: '--font-inter'});
const ibmPlexSerif = IBM_Plex_Serif({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-ibm-plex-serif',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${ibmPlexSerif.variable}`}>
        <ReduxProvider>
          <Toaster />
          {children}
          <TawkChat />
        </ReduxProvider>
      </body>
    </html>
  );
}
