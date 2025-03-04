'use client';

import HeaderBox from '@/components/HeaderBox';
import PaymentTransferForm from '@/components/PaymentTransferForm';
import {getLoggedInUser} from '@/lib/actions/user.actions';
import {RootState} from '@/redux/store';
import {User} from '@/types';
import Link from 'next/link';
import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';

const Transfer = () => {
  const [loggedIn, setLoggedIn] = useState<User>();

  useEffect(() => {
    const loggedIn = async () => {
      const user = await getLoggedInUser();

      setLoggedIn(user);
    };

    loggedIn();
  }, []);

  const accounts = useSelector((state: RootState) => state.accounts?.data?.data) ?? [];

  if (!loggedIn) return;

  return (
    <section className="payment-transfer mx-auto w-full md:w-[60vw] lg:w-[40vw]">
      <HeaderBox
        verifyState
        title="Payment Transfer"
        subtext="Please provide any specific details or notes related to the payment transfer"
      />

      <div className={`${loggedIn?.verification !== 'Verified' ? 'mt-4 md:mt-0 w-full' : ''}`}>
        {loggedIn?.verification !== 'Verified' && (
          <div className="flex gap-2 items-center text-[10px] md:text-[12px]  md:mt-4">
            <p className="text-red-600">Finsh setting up your account to initiate transactions!</p>
            <Link
              href="/dashboard/client/finish-account-setup"
              className="border rounded-md px-1 py-0.5 flex gap-0.5">
              <span>Finish</span> {''}
              <span>setup</span>
            </Link>
          </div>
        )}
      </div>

      <section className="size-full pt-5">
        <PaymentTransferForm accounts={accounts} user={loggedIn} />
      </section>
    </section>
  );
};

export default Transfer;
