'use client';

import {sidebarLinks} from '@/constants';
import {cn} from '@/lib/utils';
import {SiderbarProps} from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import Footer from './Footer';

const Sidebar = ({user}: SiderbarProps) => {
  const pathname = usePathname();

  return (
    <section className="sidebar">
      <nav className="flex flex-col gap-4">
        {sidebarLinks.map((item) => {
          const isActive = pathname == item.route;
          return (
            <Link
              href={item.route}
              key={item.label}
              className={cn('sidebar-link', {
                'bg-bank-gradient': isActive,
              })}>
              <div className="relative size-6">
                <Image
                  src={item.imgURL}
                  alt={item.label}
                  fill
                  className={cn({
                    'brightness-[3] invert-0': isActive,
                  })}
                />
              </div>
              <p className={cn('sidebar-label', {'!text-white': isActive})}>{item.label}</p>
            </Link>
          );
        })}
        {/* <PlaidLink user={user} /> */}
      </nav>

      <Footer user={user} type="desktop" />
    </section>
  );
};
export default Sidebar;
