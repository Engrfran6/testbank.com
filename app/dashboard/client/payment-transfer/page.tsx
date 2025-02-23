'use client';

import HeaderBox from '@/components/HeaderBox';
import PaymentTransferForm from '@/components/PaymentTransferForm';
import {RootState} from '@/redux/store';
import {useSelector} from 'react-redux';

const Transfer = () => {
  const loggedIn = useSelector((state: RootState) => state.user.user);
  const accounts = useSelector((state: RootState) => state.accounts?.data?.data) ?? [];

  if (!loggedIn) return;

  return (
    <section className="payment-transfer mx-auto w-full md:w-[70vw]">
      <HeaderBox
        title="Payment Transfer"
        subtext="Please provide any specific details or notes related to the payment transfer"
      />

      <section className="size-full pt-5">
        <PaymentTransferForm accounts={accounts} user={loggedIn} />
      </section>
    </section>
  );
};

export default Transfer;
