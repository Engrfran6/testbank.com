import ProductNav from '@/components/homepage/product-nav';
import ProductShowcase from '@/components/homepage/product-showcase';
import {SignInCard} from '@/components/homepage/sign-in-card';
import SiteHeader from '@/components/homepage/site-header';
import {Button} from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

const Page = () => {
  return (
    <div className="min-h-screen w-full">
      <nav className="space-y-4">
        <SiteHeader />
        <div className="container hidden md:block">
          <Link href="/" className="flex cursor-pointer items-center gap-2 pl-3">
            <Image
              src="/icons/logo.svg"
              width={500}
              height={500}
              alt="horizon logo"
              className="size-12 max-xl:size-14"
            />

            <h1 className="text-black-1 font-bold text-lg">Horizon Bank</h1>
          </Link>
        </div>

        <ProductNav />
      </nav>

      <main className="py-12  bg-blue-900 mt-8 mb-4">
        <div className="container grid gap-12 md:grid-cols-[1fr_300px] items-center">
          <div className="flex flex-col gap-8 md:flex md:gap-0 justify-center  md:justify-around text-white">
            <div className="flex flex-col justify-start">
              <span className="text-4xl font-semibold">Enjoy</span>
              <h1 className="text-7xl font-bold">$300</h1>
            </div>
            <div className="space-y-6">
              <div className="flex flex-col space-y-6 ">
                <h1 className=" text-4xl font-semibold max-w-[455px]">
                  New Horizon checking customers
                </h1>
                <p className="text-[1rem] max-w-[350px]">
                  Open a Horizon Total Checking® account with qualifying activities.
                </p>
              </div>
              <Button className="bg-green-600 float-start">
                <Link href="/sign-up">Open an account</Link>
              </Button>
            </div>
          </div>
          <div className="bg-white rounded-md">
            <SignInCard />
          </div>
        </div>
      </main>

      <ProductShowcase />

      {/* <Chat /> */}

      {/* <AdminChat chatRoomId="visitor" /> */}

      <footer className="border-t py-8">
        <div className="container">
          <div className="text-center text-sm text-muted-foreground">
            <p>We&apos;re here to help you manage your money today and tomorrow</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default Page;
