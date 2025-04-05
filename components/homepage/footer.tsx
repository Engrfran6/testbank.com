// import {motion} from 'framer-motion';
import Link from 'next/link';

import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  PinIcon as PinterestIcon,
  TwitterIcon,
  YoutubeIcon,
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-100 py-8">
      {/* <div className="border-t py-8">
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
      </div> */}
      <div className="container mx-auto px-4">
        <div className="flex justify-center space-x-4 mb-8">
          <FacebookIcon className="w-6 h-6 text-gray-600 hover:text-[#0b6efd] cursor-pointer" />
          <InstagramIcon className="w-6 h-6 text-gray-600 hover:text-[#0b6efd] cursor-pointer" />
          <TwitterIcon className="w-6 h-6 text-gray-600 hover:text-[#0b6efd] cursor-pointer" />
          <YoutubeIcon className="w-6 h-6 text-gray-600 hover:text-[#0b6efd] cursor-pointer" />
          <LinkedinIcon className="w-6 h-6 text-gray-600 hover:text-[#0b6efd] cursor-pointer" />
          <PinterestIcon className="w-6 h-6 text-gray-600 hover:text-[#0b6efd] cursor-pointer" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          {footerLinks.map((link) => (
            <Link key={link} href="#" className="text-sm text-gray-600 hover:text-[#0b6efd]">
              {link}
            </Link>
          ))}
        </div>
        <div className="text-xs text-gray-500 mt-8">
          <p className="mb-2">
            &quot;Horizon,&quot; &quot;Horizon Bank,&quot; the Horizon Bank logo and associated
            symbols are trademarks of Horizon Bank LLC. Horizon Bank LLC is a wholly-owned
            subsidiary of Horizon Financial Group.
          </p>
          <p className="mb-2">
            &quot;Horizon Private Client&quot; is the brand name for a banking and investment
            product and service offering, requiring a Horizon Private Client Checking℠ account.
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
            Bank deposit accounts, such as checking and savings, may be subject to approval. Deposit
            products and related services are offered by Horizon Bank LLC. Member FDIC.
          </p>
          <p>© 2025 Horizon Financial Group</p>
        </div>
      </div>
    </footer>
  );
}

const footerLinks = [
  'Deposit Account Agreements',
  'Mobile Banking',
  'Online Banking',
  'Student Center',
  'Zelle®',
  'Privacy & Security',
];
