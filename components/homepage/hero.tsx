import {motion} from 'framer-motion';
import Link from 'next/link';
import {Button} from '../ui/button';
import {SignInCard} from './sign-in-card';

const Hero = () => {
  return (
    <motion.main
      className="px-2 md:px-0 py-12 bg-blue-900  mb-4 "
      initial={{opacity: 0}}
      whileInView={{opacity: 1}}
      viewport={{once: false}}
      transition={{duration: 0.5}}>
      <div className="container grid md:gap-12  md:grid-cols-[1fr_300px] items-center ">
        <motion.div
          className="flex gap-8 md:gap-10 justify-start  text-white"
          initial={{x: -50, opacity: 0}}
          whileInView={{x: 0, opacity: 1}}
          viewport={{once: false}}
          transition={{duration: 0.5, delay: 0.2}}>
          <div className="flex flex-col justify-start">
            <motion.span
              className="text-2xl md:text-4xl font-semibold"
              initial={{y: 20, opacity: 0}}
              whileInView={{y: 0, opacity: 1}}
              viewport={{once: false}}
              transition={{duration: 0.5, delay: 0.4}}>
              Enjoy
            </motion.span>
            <motion.h1
              className="text-5xl md:text-7xl font-bold"
              initial={{y: 20, opacity: 0}}
              whileInView={{y: 0, opacity: 1}}
              viewport={{once: false}}
              transition={{duration: 0.5, delay: 0.6}}>
              $300
            </motion.h1>
          </div>
          <div className="space-y-6">
            <div className="flex flex-col space-y-2 md:space-y-6">
              <motion.h1
                className="text-xl md:text-4xl font-semibold max-w-[455px]"
                initial={{y: 20, opacity: 0}}
                whileInView={{y: 0, opacity: 1}}
                viewport={{once: false}}
                transition={{duration: 0.5, delay: 0.8}}>
                New Horizon checking customers
              </motion.h1>
              <motion.p
                className="text-[0.7rem] md:text-lg max-w-[350px]"
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
              <Button className="bg-[#156729] float-start">
                <Link href="/auth/client/sign-up">Open an account</Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>
        <motion.div
          className="bg-white rounded-md hidden md:block"
          initial={{x: 50, opacity: 0}}
          whileInView={{x: 0, opacity: 1}}
          viewport={{once: false}}
          transition={{duration: 0.5, delay: 0.2}}>
          <SignInCard />
        </motion.div>
      </div>
    </motion.main>
  );
};
export default Hero;
