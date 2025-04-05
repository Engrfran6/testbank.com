'use client';

import {countTransactionCategories, maskEmail} from '@/lib/utils';
import {CategoryCount, RightSidebarProps} from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import {useState} from 'react';
import BankCard from './BankCard';
import Category from './Category';
import Offers from './Offers';
import Rewards from './Rewards';
import Travels from './Travels';

const RightSidebar = ({user, transactions, accounts}: RightSidebarProps) => {
  const [frontCardIndex, setFrontCardIndex] = useState(0);

  const switchCards = () => {
    setFrontCardIndex((frontCardIndex + 1) % accounts.length);
  };

  const categories: CategoryCount[] = countTransactionCategories(transactions);

  return (
    <aside className="right-sidebar">
      <section className="hidden md:flex flex-col pb-8">
        <div className="profile-banner" />
        <div className="profile">
          <div className="profile-img">
            {user?.photoId ? (
              <Image
                src={user.photoId || '/icons/avatar.png'}
                width={500}
                height={500}
                alt="image"
                className="w-full h-full object-fill rounded-full"
              />
            ) : (
              <span className="text-5xl font-bold text-blue-500">{user?.firstname[0]}</span>
            )}
          </div>

          <div className="profile-details">
            <h1 className="profile-name">{`${user?.firstname}|${user?.lastname}`}</h1>
            <p className="profile-email">{maskEmail(user?.email)}</p>
          </div>
        </div>
      </section>

      <section className="banks">
        <Rewards />

        <Travels />

        <Offers />
        <div className="flex w-full justify-between">
          <h3 className="font-semibold text-sm md:text-base">My Banks</h3>

          <Link href="/sign-in" className="flex gap-2">
            <Image src="/icons/plus.svg" width={20} height={20} alt="plus" />
            <h2 className="text-14 font-semibold text-gray-600">Add Bank</h2>
          </Link>
        </div>

        {accounts?.length > 0 && (
          <div
            onClick={() => switchCards()}
            className="relative flex flex-1 flex-col items-center justify-center gap-5">
            <div
              className={`${
                frontCardIndex === 0
                  ? 'z-10 translate-x-0 transform transition-transform duration-300'
                  : 'z-0 absolute right-0 top-8 transform transition-transform duration-300'
              }`}
              style={{transform: frontCardIndex === 0 ? 'translateX(0)' : 'translateX(10%)'}}>
              <BankCard
                key={accounts[0].$id}
                account={accounts[0]}
                userName={`${user?.firstname} ${user.lastname}`}
                showBalance={false}
              />
            </div>
            {accounts[1] && (
              <div
                className={`${
                  frontCardIndex === 1
                    ? 'z-10 translate-x-0 transform transition-transform duration-300'
                    : 'z-0 absolute right-0 top-8 transform transition-transform duration-300'
                }`}
                style={{transform: frontCardIndex === 1 ? 'translateX(0)' : 'translateX(10%)'}}>
                <BankCard
                  key={accounts[1].$id}
                  account={accounts[1]}
                  userName={`${user?.firstname} ${user.lastname}`}
                  showBalance={false}
                />
              </div>
            )}
          </div>
        )}
        <div className="mt-10 flex flex-1 flex-col gap-6">
          <h3 className="font-semibold text-sm md:text-base"> Top categories</h3>

          <div className="space-y-5">
            {categories.map((category, index) => (
              <Category key={category?.name} category={category} />
            ))}
          </div>
        </div>
      </section>
    </aside>
  );
};

export default RightSidebar;
