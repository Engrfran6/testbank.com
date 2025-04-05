export const dynamic = 'force-dynamic';

import Footer from '@/components/homepage/footer';
import SiteHeader from '@/components/homepage/site-header';
import type {Metadata} from 'next';

export const metadata: Metadata = {
  title: 'Horizon Bank',
  description: 'Horizon is a modern banking app for everyone!',
  icons: {
    icon: './icons/logo.svg',
  },
};

export default function HomePageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        {children}
        <Footer />
      </body>
    </html>
  );
}
