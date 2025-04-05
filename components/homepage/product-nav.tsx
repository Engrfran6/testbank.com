'use client';

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import {Menu, X} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {useState} from 'react';

const products = [
  {name: 'Checking', href: '/checking'},
  {name: 'Savings & CDs', href: '/savings'},
  {name: 'Credit cards', href: '/credit-cards'},
  {name: 'Home loans', href: '/home-loans'},
  {name: 'Auto', href: '/auto'},
  {name: 'Investing', href: '/investing'},
  {name: 'Education & goals', href: '/education'},
  {name: 'Travel', href: '/travel'},
];

const ProductNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  return (
    <div className=" pb-2">
      <div
        className={`${
          isMenuOpen ? 'shadow-2xl bg-gray-300 py-2' : ''
        } md:hidden flex justify-between px-2`}>
        <button onClick={toggleMenu} className="md:hidden text-gray-700 focus:outline-none">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <Link href="/" className=" flex cursor-pointer items-center gap-1">
          <Image
            src="/icons/logo.svg"
            width={500}
            height={500}
            alt="horizon logo"
            className="size-8 max-xl:size-8"
          />

          <h1 className="text-black-1 font-extrabold text-lg pb-">Horizon</h1>
        </Link>
        <div>
          <Link href="/auth/client/sign-in" className="text-[14px] font-bold">
            Login
          </Link>
        </div>
      </div>

      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:block container`}>
        <NavigationMenu>
          <NavigationMenuList className={`${isMenuOpen && 'flex flex-col'} flex container`}>
            {products.map((product) => (
              <NavigationMenuItem key={product.href}>
                <NavigationMenuLink asChild>
                  <Link href={product.href} className="block px-4 py-2 text-sm hover:bg-accent">
                    {product.name}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
};
export default ProductNav;
