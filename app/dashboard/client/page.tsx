'use client';

import CreditCardBox from '@/components/CreditCardBox';
import ExternalAccountBox from '@/components/ExternalAccountBox';
import HeaderBox from '@/components/HeaderBox';
import RecentTransactions from '@/components/RecentTransactions';
import RightSidebar from '@/components/RightSidebar';
import TotalBalanceBox from '@/components/TotalBalanceBox';
import {getAccount, getAccounts} from '@/lib/actions/account.actions';
import {getLoggedInUser, processUserVerification} from '@/lib/actions/user.actions';
import ProtectedRoute from '@/lib/protected';
import {setAccountsData} from '@/redux/accountsDataSlice';
import {RootState} from '@/redux/store';
import {clearTransaction, setTransaction} from '@/redux/transactionSlice';
import {setUser} from '@/redux/userSlice';
import Link from 'next/link';

import {useSearchParams} from 'next/navigation';
import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

const Home = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams(); // Use useSearchParams to access query parameters

  // Get the `id` and `page` from the URL
  const id = searchParams.get('id');
  const page = searchParams.get('page');
  const currentPage = Number(page) || 1;

  const user = useSelector((state: RootState) => state.user.user);
  const accounts: any = useSelector((state: RootState) => state.accounts.data);
  const transactions: any = useSelector((state: RootState) => state.transaction.transaction);
  const [verifyState, setVerifyState] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const user = await getLoggedInUser();

      const verifyStatus = await processUserVerification(user);
      setVerifyState(verifyStatus);

      dispatch(setUser(user));
    };
    getUser();
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      const fetchAccounts = async () => {
        const accounts = await getAccounts({userId: user.userId as string});
        dispatch(setAccountsData(accounts));
      };

      fetchAccounts();
    }
  }, [user, dispatch]);

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
  }, [accountId, dispatch]);

  const filterTransactions = transactions.filter(
    (transaction: any) => transaction.type === 'credit' || transaction.type === 'debit'
  );

  return (
    <ProtectedRoute role="user">
      <section className="flex flex-col md:flex-row pt-2 w-full">
        <div className="home-content">
          <div className={`${user?.verification !== 'Verified' ? '-mt-3 md:-mb-8 w-full' : ''}`}>
            {user?.verification !== 'Verified' && (
              <div className="flex gap-2 items-center text-[10px] md:text-[12px] md:mt-10">
                <p className="text-red-600">
                  Finsh setting up your account for maximum experience!
                </p>
                <Link
                  href="/dashboard/client/finish-account-setup"
                  className="border rounded-md px-1 py-0.5 flex gap-0.5">
                  <span>Finish</span> {''}
                  <span>setup</span>
                </Link>
              </div>
            )}
          </div>
          <header className="home-header">
            <HeaderBox
              type="greeting"
              title="Welcome"
              user={user ?? undefined}
              verifyState={verifyState}
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
            transactions={filterTransactions}
            accountId={accountId}
            page={currentPage}
          />
        </div>

        <RightSidebar user={user!} transactions={filterTransactions} accounts={accounts} />
      </section>
    </ProtectedRoute>
  );
};

export default Home;
