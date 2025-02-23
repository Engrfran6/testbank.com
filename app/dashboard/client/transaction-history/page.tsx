'use client';

import HeaderBox from '@/components/HeaderBox';
import {Pagination} from '@/components/Pagination';
import TransactionsTable from '@/components/TransactionsTable';
import {formatAmount} from '@/lib/utils';
import {RootState} from '@/redux/store';
import {useSearchParams} from 'next/navigation';
import {useSelector} from 'react-redux';

const TransactionHistory = () => {
  const searchParams = useSearchParams();

  const id = searchParams.get('id');
  const page = searchParams.get('page');

  const currentPage = Number(page as string) || 1;

  const accounts: any = useSelector((state: RootState) => state.accounts.data?.data);

  // Get the account ID from the URL or default to the first account
  const accountId = id;

  // Find the account by ID from the Redux store
  const account: any = accounts.find((acc: any) => acc.$id === accountId);

  const accTransactions: any = useSelector((state: RootState) => state.transaction.transaction);

  const allTransactions: any = useSelector((state: RootState) => state.accounts.data?.transactions);

  const transactions = id ? accTransactions : allTransactions;

  const rowsPerPage = 10;
  const totalPages = Math.ceil(transactions.length / rowsPerPage);

  const indexOfLastTransaction = currentPage * rowsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;

  const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

  return (
    <div className="transactions">
      <HeaderBox title="Transaction History" subtext="Most recent transcations" />

      <div className="space-y-6">
        {id ? (
          <div className="transactions-account">
            {/* Details for a Specific Account */}
            <div className="flex flex-col gap-2">
              <h2 className="text-18 font-bold text-white">{account?.name}</h2>
              <p className="text-14 text-blue-25">{account?.subType}</p>
              <p className="text-14 font-semibold tracking-[1.1px] text-white">●●●● ●●●● ●●●●</p>
            </div>

            <div className="transactions-account-balance">
              <p className="text-14">Current balance</p>
              <p className="text-24 text-center font-bold">
                {formatAmount(account?.currentBalance)}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <h2 className="text-18 font-bold text-white">All Accounts</h2>
            <p className="text-14 text-blue-25">Combined transactions from all accounts</p>
          </div>
        )}

        <section className="flex w-full flex-col gap-6">
          <TransactionsTable transactions={currentTransactions} />
          {!transactions && (
            <p className="flex justify-center items-center p-48 italic text-gray-500 font-medium">
              You do not any transaction history
            </p>
          )}
          {totalPages > 1 && (
            <div className="my-4 w-full">
              <Pagination totalPages={totalPages} page={currentPage} />
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default TransactionHistory;
