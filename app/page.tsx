'use client';

import ProductNav from '@/components/homepage/product-nav';
import ProductShowcase from '@/components/homepage/product-showcase';
import {SignInCard} from '@/components/homepage/sign-in-card';
import SiteHeader from '@/components/homepage/site-header';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {motion} from 'framer-motion';
import {
  Briefcase,
  Car,
  CreditCard,
  FacebookIcon,
  Home,
  Info,
  InstagramIcon,
  LinkedinIcon,
  PiggyBank,
  PinIcon as PinterestIcon,
  Shield,
  TwitterIcon,
  Users,
  YoutubeIcon,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const Page = () => {
  return (
    <div className="min-h-screen w-full">
      <nav className="space-y-4">
        <SiteHeader />
        <motion.div
          className="container hidden md:block"
          initial={{opacity: 0, y: -20}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: false}} // Triggers every time the element comes into view
          transition={{duration: 0.5}}>
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
        </motion.div>

        <ProductNav />
      </nav>

      <motion.main
        className="py-12 bg-blue-900 mt-8 mb-4"
        initial={{opacity: 0}}
        whileInView={{opacity: 1}}
        viewport={{once: false}}
        transition={{duration: 0.5}}>
        <div className="container grid gap-12 md:grid-cols-[1fr_300px] items-center">
          <motion.div
            className="flex flex-col gap-8 md:flex md:gap-0 justify-center md:justify-around text-white"
            initial={{x: -50, opacity: 0}}
            whileInView={{x: 0, opacity: 1}}
            viewport={{once: false}}
            transition={{duration: 0.5, delay: 0.2}}>
            <div className="flex flex-col justify-start">
              <motion.span
                className="text-4xl font-semibold"
                initial={{y: 20, opacity: 0}}
                whileInView={{y: 0, opacity: 1}}
                viewport={{once: false}}
                transition={{duration: 0.5, delay: 0.4}}>
                Enjoy
              </motion.span>
              <motion.h1
                className="text-7xl font-bold"
                initial={{y: 20, opacity: 0}}
                whileInView={{y: 0, opacity: 1}}
                viewport={{once: false}}
                transition={{duration: 0.5, delay: 0.6}}>
                $300
              </motion.h1>
            </div>
            <div className="space-y-6">
              <div className="flex flex-col space-y-6">
                <motion.h1
                  className="text-4xl font-semibold max-w-[455px]"
                  initial={{y: 20, opacity: 0}}
                  whileInView={{y: 0, opacity: 1}}
                  viewport={{once: false}}
                  transition={{duration: 0.5, delay: 0.8}}>
                  New Horizon checking customers
                </motion.h1>
                <motion.p
                  className="text-[1rem] max-w-[350px]"
                  initial={{y: 20, opacity: 0}}
                  whileInView={{y: 0, opacity: 1}}
                  viewport={{once: false}}
                  transition={{duration: 0.5, delay: 1}}>
                  Open a Horizon Total Checking® account with qualifying activities.
                </motion.p>
              </div>
              <motion.div
                initial={{y: 20, opacity: 0}}
                whileInView={{y: 0, opacity: 1}}
                viewport={{once: false}}
                transition={{duration: 0.5, delay: 1.2}}>
                <Button className="bg-green-600 float-start">
                  <Link href="/sign-up">Open an account</Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
          <motion.div
            className="bg-white rounded-md"
            initial={{x: 50, opacity: 0}}
            whileInView={{x: 0, opacity: 1}}
            viewport={{once: false}}
            transition={{duration: 0.5, delay: 0.2}}>
            <SignInCard />
          </motion.div>
        </div>
      </motion.main>

      <ProductShowcase />

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-12">
          <div className="grid gap-8 mb-16 w-full">
            {/* College Student Offer */}
            <motion.div
              initial={{opacity: 0, y: 50}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: false}}
              transition={{duration: 0.5}}>
              <Card className="bg-[#f4f4f4] w-full">
                <CardContent className="p-4 sm:p-6 grid gap-4 sm:grid-cols-4 items-center">
                  <div className="flex flex-col col-span-1 bg-[#0b6efd] p-4 sm:p-10 sm:rounded-lg sm:mr-6 text-center sm:text-left">
                    <span className="text-white text-lg sm:text-3xl font-semibold">Enjoy</span>
                    <span className="text-white text-2xl sm:text-7xl font-bold">$100</span>
                  </div>
                  <div className="col-span-3">
                    <h2 className="text-xl sm:text-2xl font-bold mb-2 text-center sm:text-left">
                      College students: This offer is for you
                    </h2>
                    <p className="text-gray-600 mb-4 text-center sm:text-left">
                      As a new Horizon checking customer, earn $100 when you open Horizon College
                      Checking℠ and complete 10 qualifying transactions.
                    </p>
                    <Button className="bg-[#1a7f37] hover:bg-[#156729] w-full sm:w-auto">
                      Continue
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Commission-free trades offer */}
            <motion.div
              initial={{opacity: 0, y: 50}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: false}}
              transition={{duration: 0.5, delay: 0.4}}>
              <Card className="bg-[#f4f4f4]">
                <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-center sm:justify-between">
                  <div className="text-center sm:text-left">
                    <h2 className="text-xl sm:text-2xl font-bold mb-2">
                      Commission-free online trades — plus a bonus
                    </h2>
                    <p className="text-gray-600 mb-4">
                      Get up to $700 when you open a Horizon Self-Directed Investing account.
                    </p>
                    <Button className="bg-[#1a7f37] hover:bg-[#156729] w-full sm:w-auto">
                      Continue
                    </Button>
                  </div>
                  <div className="text-4xl sm:text-6xl font-bold text-gray-700 mt-4 sm:mt-0 text-center">
                    Get up to <br /> $700
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* New Customer Offer */}
            <motion.div
              initial={{opacity: 0, y: 50}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: false}}
              transition={{duration: 0.5, delay: 0.2}}>
              <Card className="bg-[#f4f4f4]">
                <CardContent className="p-4 sm:p-6 grid gap-4 sm:grid-cols-4 items-center">
                  <div className="flex flex-col col-span-1 bg-[#0b6efd] p-4 sm:p-10 sm:rounded-lg sm:mr-6 text-center sm:text-left">
                    <span className="text-white text-lg sm:text-3xl font-semibold">Enjoy</span>
                    <span className="text-white text-2xl sm:text-7xl font-bold">$100</span>
                  </div>
                  <div className="col-span-3">
                    <h2 className="text-xl sm:text-2xl font-bold mb-2 text-center sm:text-left">
                      New Horizon checking customers
                    </h2>
                    <p className="text-gray-600 mb-4 text-center sm:text-left">
                      Enjoy $100 when you open a Horizon Secure Banking℠ account.
                    </p>
                    <Button className="bg-[#1a7f37] hover:bg-[#156729] w-full sm:w-auto">
                      Open an account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Services Grid */}
          <motion.h2
            className="text-2xl font-bold text-center mb-8"
            initial={{opacity: 0, y: 20}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: false}}
            transition={{duration: 0.5}}>
            We're here to help you manage your money today and tomorrow
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{opacity: 0, y: 50}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: false}}
                transition={{duration: 0.5, delay: index * 0.1}}>
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <motion.div
                      whileHover={{scale: 1.1}}
                      transition={{type: 'spring', stiffness: 400, damping: 10}}>
                      <service.icon className="w-8 h-8 text-[#0b6efd] mb-4" />
                    </motion.div>
                    <CardTitle>{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">{service.description}</p>
                    {service.links.map((link, linkIndex) => (
                      <Link
                        key={linkIndex}
                        href={link.url}
                        className="block text-[#0b6efd] hover:underline mb-2">
                        {link.text}
                      </Link>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 mt-16 py-8">
        <div className="container mx-auto px-4">
          <motion.div
            className="flex justify-center space-x-4 mb-8"
            initial={{opacity: 0, y: 20}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: false}}
            transition={{duration: 0.5}}>
            <FacebookIcon className="w-6 h-6 text-gray-600 hover:text-[#0b6efd] cursor-pointer" />
            <InstagramIcon className="w-6 h-6 text-gray-600 hover:text-[#0b6efd] cursor-pointer" />
            <TwitterIcon className="w-6 h-6 text-gray-600 hover:text-[#0b6efd] cursor-pointer" />
            <YoutubeIcon className="w-6 h-6 text-gray-600 hover:text-[#0b6efd] cursor-pointer" />
            <LinkedinIcon className="w-6 h-6 text-gray-600 hover:text-[#0b6efd] cursor-pointer" />
            <PinterestIcon className="w-6 h-6 text-gray-600 hover:text-[#0b6efd] cursor-pointer" />
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
            {footerLinks.map((link, index) => (
              <motion.div
                key={link}
                initial={{opacity: 0, y: 20}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: false}}
                transition={{duration: 0.5, delay: index * 0.1}}>
                <Link href="#" className="text-sm text-gray-600 hover:text-[#0b6efd]">
                  {link}
                </Link>
              </motion.div>
            ))}
          </div>
          <motion.div
            className="text-xs text-gray-500 mt-8"
            initial={{opacity: 0}}
            whileInView={{opacity: 1}}
            viewport={{once: false}}
            transition={{duration: 0.5, delay: 0.5}}>
            <p className="mb-2">
              "Horizon," "Horizon Bank," the Horizon Bank logo and associated symbols are trademarks
              of Horizon Bank LLC. Horizon Bank LLC is a wholly-owned subsidiary of Horizon
              Financial Group.
            </p>
            <p className="mb-2">
              "Horizon Private Client" is the brand name for a banking and investment product and
              service offering, requiring a Horizon Private Client Checking℠ account.
            </p>
            <p className="mb-2">
              Investing involves market risk, including possible loss of principal, and there is no
              guarantee that investment objectives will be achieved. Past performance is not a
              guarantee of future results.
            </p>
            <p className="mb-2">
              Horizon Wealth Management is a business of Horizon Financial Group, which offers
              investment products and services through Horizon Securities LLC (HSL), a registered
              broker-dealer and investment adviser, member FINRA and SIPC.
            </p>
            <p className="mb-2">
              Bank deposit accounts, such as checking and savings, may be subject to approval.
              Deposit products and related services are offered by Horizon Bank LLC. Member FDIC.
            </p>
            <p>© 2025 Horizon Financial Group</p>
          </motion.div>
        </div>
      </footer>

      <footer className="border-t py-8">
        <div className="container">
          <motion.div
            className="text-center text-sm text-muted-foreground"
            initial={{opacity: 0, y: 20}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: false}}
            transition={{duration: 0.5}}>
            <p>We&apos;re here to help you manage your money today and tomorrow</p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default Page;

// ... (services and footerLinks remain the same)

// ... (services and footerLinks remain the same)

const services = [
  {
    icon: CreditCard,
    title: 'Checking Accounts',
    description:
      'Choose the checking account that works best for you. See our Horizon Total Checking® offer for new customers. Make purHorizons with your debit card, and bank from almost anywhere by phone, tablet or computer and more than 15,000 ATMs and more than 4,700 branches.',
    links: [
      {text: 'Open a checking account', url: '#'},
      {text: 'See Horizon Total Checking®', url: '#'},
    ],
  },
  {
    icon: PiggyBank,
    title: 'Savings Accounts & CDs',
    description:
      "It's never too early to begin saving. Open a savings account or open a Certificate of Deposit (see interest rates) and start saving your money.",
    links: [
      {text: 'Open a savings account', url: '#'},
      {text: 'Open a Certificate of Deposit', url: '#'},
    ],
  },
  {
    icon: CreditCard,
    title: 'Credit Cards',
    description:
      'Horizon credit cards can help you buy the things you need. Many of our cards offer rewards that can be redeemed for cash back or travel-related perks.',
    links: [
      {text: 'Explore credit cards', url: '#'},
      {text: 'Check your credit score', url: '#'},
    ],
  },
  {
    icon: Home,
    title: 'Mortgages',
    description:
      "Apply for a mortgage or refinance your mortgage with Horizon. View today's mortgage rates or calculate what you can afford with our mortgage calculator.",
    links: [
      {text: 'Apply for a mortgage', url: '#'},
      {text: 'Refinance your mortgage', url: '#'},
    ],
  },
  {
    icon: Car,
    title: 'Auto',
    description:
      'Horizon Auto is here to help you get the right car. Apply for auto financing for a new or used car with Horizon. Use the payment calculator to estimate monthly payments.',
    links: [
      {text: 'Apply for auto financing', url: '#'},
      {text: 'Use the payment calculator', url: '#'},
    ],
  },
  {
    icon: Briefcase,
    title: 'Horizon for Business',
    description:
      "With Horizon for Business, you'll receive guidance from a team of business professionals who specialize in helping improve cash flow, providing credit solutions, and managing payroll.",
    links: [
      {text: 'Explore business checking', url: '#'},
      {text: 'Explore business credit cards', url: '#'},
    ],
  },
  {
    icon: Shield,
    title: 'Investing by J.P. Morgan',
    description:
      'Whether you choose to work with a financial advisor or to invest on your own, we have the tools and resources to help you grow your wealth.',
    links: [
      {text: 'Invest on your own', url: '#'},
      {text: 'Work with an advisor', url: '#'},
    ],
  },
  {
    icon: Users,
    title: 'Horizon Private Client',
    description:
      'Get more from a personalized relationship with Horizon Private Client. Connect with a dedicated team and special perks and benefits.',
    links: [
      {text: 'Learn about eligibility', url: '#'},
      {text: 'Find a Horizon branch', url: '#'},
    ],
  },
  {
    icon: Info,
    title: 'About Horizon',
    description:
      'Horizon serves millions of people with a broad range of products. Horizon online lets you manage your Horizon accounts, view statements, monitor activity, pay bills or transfer funds securely from one central place.',
    links: [
      {text: 'Learn about Horizon', url: '#'},
      {text: 'Contact customer service', url: '#'},
    ],
  },
];

const footerLinks = [
  'Deposit Account Agreements',
  'Mobile Banking',
  'Online Banking',
  'Student Center',
  'Zelle®',
  'Privacy & Security',
];
