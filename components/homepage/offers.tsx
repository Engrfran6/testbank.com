'use client';

import {motion} from 'framer-motion';
import Link from 'next/link';
import {Button} from '../ui/button';
import {Card, CardContent} from '../ui/card';

const Offers = () => {
  return (
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
              <Link href="/auth/client/sign-up">
                <Button className="bg-[#1a7f37] hover:bg-[#156729] w-full sm:w-auto">
                  Continue
                </Button>
              </Link>
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
                Get up to $900 when you open a Horizon Self-Directed Investing account.
              </p>
              <Link href="/auth/client/sign-up">
                <Button className="bg-[#1a7f37] hover:bg-[#156729] w-full sm:w-auto">
                  Continue
                </Button>
              </Link>
            </div>
            <div className="text-4xl sm:text-6xl font-bold text-gray-700 mt-4 sm:mt-0 text-center">
              Get up to <br /> $900
              <div className="w-72 h-4 bg-slate-300 mt-4" />
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
              <Link href="/auth/client/sign-up">
                <Button className="bg-[#1a7f37] hover:bg-[#156729] w-full sm:w-auto">
                  Open an account
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
export default Offers;
