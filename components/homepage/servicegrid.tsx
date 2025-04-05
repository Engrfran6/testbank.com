import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {motion} from 'framer-motion';
import {Briefcase, Car, CreditCard, Home, Info, PiggyBank, Shield, Users} from 'lucide-react';
import Link from 'next/link';

const ServiceGrid = () => {
  return (
    <div>
      {/* Services Grid */}
      <motion.h2
        className="text-2xl font-bold text-center mb-8"
        initial={{opacity: 0, y: 20}}
        whileInView={{opacity: 1, y: 0}}
        viewport={{once: false}}
        transition={{duration: 0.5}}>
        We&apos;re here to help you manage your money today and tomorrow
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
    </div>
  );
};
export default ServiceGrid;

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
