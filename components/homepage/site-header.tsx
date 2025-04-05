'use client';

import {motion} from 'framer-motion';
import {Globe, Search} from 'lucide-react';
import Link from 'next/link';

import {Button} from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import Image from 'next/image';
import ProductNav from './product-nav';

const SiteHeader = () => {
  return (
    <header className="bg-slate-50">
      <div className="container flex h-14  items-center justify-between">
        <div className="flex items-center">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent font-semibold">
                  Personal
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[400px] gap-3 p-4">
                    <NavigationMenuLink asChild>
                      <Link href="/personal/checking" className="block p-2 hover:bg-accent">
                        Checking Accounts
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link href="/personal/savings" className="block p-2 hover:bg-accent">
                        Savings Accounts
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link href="/personal/credit-cards" className="block p-2 hover:bg-accent">
                        Credit Cards
                      </Link>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent">Business</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[400px] gap-3 p-4">
                    <NavigationMenuLink asChild>
                      <Link href="/business/checking" className="block p-2 hover:bg-accent">
                        Business Checking
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link href="/business/credit" className="block p-2 hover:bg-accent">
                        Business Credit
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link href="/business/lending" className="block p-2 hover:bg-accent">
                        Business Lending
                      </Link>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent">Commercial</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[400px] gap-3 p-4">
                    <NavigationMenuLink asChild>
                      <Link href="/commercial/treasury" className="block p-2 hover:bg-accent">
                        Treasury Services
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link href="/commercial/trade" className="block p-2 hover:bg-accent">
                        Trade Finance
                      </Link>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" size="sm">
            Schedule a meeting
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                Customer service
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Contact Us</DropdownMenuItem>
              <DropdownMenuItem>Find a Branch</DropdownMenuItem>
              <DropdownMenuItem>Help Center</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost" size="icon">
            <Globe className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <nav className="space-y-4">
        <motion.div
          className="container hidden md:block"
          initial={{opacity: 0, y: -20}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: false}} // Triggers every time the element comes into view
          transition={{duration: 0.5}}>
          <Link href="/" className="flex cursor-pointer items-center  gap-1.5 pl-1">
            <Image
              src="/icons/logo.svg"
              width={500}
              height={500}
              alt="horizon logo"
              className=" size-12 max-xl:size-10"
            />
            <h1 className="text-black-1 font-bold text-3xl">Horizon Bank</h1>
          </Link>
        </motion.div>

        <ProductNav />
      </nav>
    </header>
  );
};
export default SiteHeader;
