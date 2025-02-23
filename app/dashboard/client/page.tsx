'use client';

import CreditCardBox from '@/components/CreditCardBox';
import ExternalAccountBox from '@/components/ExternalAccountBox';
import HeaderBox from '@/components/HeaderBox';
import RecentTransactions from '@/components/RecentTransactions';
import RightSidebar from '@/components/RightSidebar';
import TotalBalanceBox from '@/components/TotalBalanceBox';
import {getAccount, getAccounts} from '@/lib/actions/account.actions';
import {getLoggedInUser} from '@/lib/actions/user.actions';
import {setAccountsData} from '@/redux/accountsDataSlice';
import {RootState} from '@/redux/store';
import {clearTransaction, setTransaction} from '@/redux/transactionSlice';
import {setUser} from '@/redux/userSlice';

import {useRouter, useSearchParams} from 'next/navigation';
import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

const Home = () => {
  const [show, setShow] = useState(true);
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams(); // Use useSearchParams to access query parameters

  // Get the `id` and `page` from the URL
  const id = searchParams.get('id');
  const page = searchParams.get('page');
  const currentPage = Number(page) || 1;

  const user = useSelector((state: RootState) => state.user.user);
  const accounts: any = useSelector((state: RootState) => state.accounts.data);
  const transactions: any = useSelector((state: RootState) => state.transaction.transaction);

  useEffect(() => {
    const getUser = async () => {
      const user = await getLoggedInUser();

      dispatch(setUser(user));
    };
    getUser();
  }, []);

  useEffect(() => {
    if (user) {
      const fetchAccounts = async () => {
        const accounts = await getAccounts({userId: user.userId as string});
        dispatch(setAccountsData(accounts));
      };

      fetchAccounts();
    }
  }, [user?.userId]);

  const accountsData = accounts?.data || []; // Ensure it's always an array
  // Get the account ID from the URL or default to the first account
  const accountId = id || (accountsData.length > 0 ? accountsData[0]?.$id : null);

  useEffect(() => {
    const fetchAccount = async () => {
      if (!accountId) {
        dispatch(clearTransaction());
        return;
      }

      try {
        const account = await getAccount({accountId});

        if (account.transactions.length > 0) {
          dispatch(setTransaction(account?.transactions));
        } else {
          dispatch(setTransaction([]));
        }
      } catch (error) {
        console.error('Error fetching account:', error);
        dispatch(clearTransaction());
      }
    };

    fetchAccount();
  }, [accountId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 60000);

    // Cleanup the timer when the component unmounts
    return () => clearTimeout(timer);
  }, [user?.verification]);

  return (
    <section className="flex">
      <div className="home-content">
        {user?.verification !== 'Verified' && (
          <div className="flex gap-2 items-center">
            <p className="text-red-600">Please verify account for maximum experience!</p>
            <a
              href="/dashboard/client/finish-account-setup"
              className="border rounded-md px-1.5 py-0.5">
              Finish setup
            </a>
          </div>
        )}
        {show && user?.verification === 'Verified' && (
          <p className="text-green-600">
            Congratulations!!! {user?.firstname} Your account has been fully verification
          </p>
        )}
        <header className="home-header">
          <HeaderBox
            type="greeting"
            title="Welcome"
            user={`${user?.firstname} ${user?.lastname}` || 'Guest'}
            subtext="Access and manage your account and transactions efficiently."
          />

          <TotalBalanceBox
            accounts={accountsData}
            totalAccounts={accounts?.totalBanks}
            totalCurrentBalance={accounts?.totalCurrentBalance}
            totalDeposits={accounts?.totalCredit}
            totalWithdrawals={accounts?.totalDebit}
          />
        </header>

        <CreditCardBox />

        <ExternalAccountBox />

        <RecentTransactions
          accounts={accountsData}
          transactions={transactions}
          accountId={accountId}
          page={currentPage}
        />
      </div>

      <RightSidebar user={user!} transactions={transactions} accounts={accounts} />
    </section>
  );
};

export default Home;
