'use client';

import {sidebarLinks} from '@/constants';
import {cn} from '@/lib/utils';
import {SiderbarProps} from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import {usePathname} from 'next/navigation';

const Sidebar = ({user}: SiderbarProps) => {
  const pathname = usePathname();

  return (
    <section className="pt-4 pb-2">
      <nav className="flex gap-3">
        {sidebarLinks.map((item) => {
          const isActive = pathname == item.route;
          return (
            <Link
              href={item.route}
              key={item.label}
              className={cn('sidebar-link', {
                'border-b-4 border-blue-700': isActive,
              })}>
              <div className="relative size-6">
                <Image
                  src={item.imgURL}
                  alt={item.label}
                  fill
                  className={cn({
                    'font-extrabold': isActive,
                  })}
                />
              </div>
              <p className={cn('sidebar-label', {'!text-blue-700 font-extrabold': isActive})}>
                {item.label}
              </p>
            </Link>
          );
        })}
        {/* <PlaidLink user={user} /> */}
      </nav>

      {/* <Footer user={user} type="desktop" /> */}
    </section>
  );
};
export default Sidebar;
