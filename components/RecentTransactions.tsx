import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {Account, RecentTransactionsProps} from '@/types';
import Link from 'next/link';
import BankInfo from './BankInfo';
import {BankTabItem} from './BankTabItem';
import {Pagination} from './Pagination';
import TransactionsTable from './TransactionsTable';

const RecentTransactions = ({
  accounts,
  transactions = [],
  accountId,
  page = 1,
}: RecentTransactionsProps) => {
  const rowsPerPage = 10;
  const totalPages = Math.ceil(transactions.length / rowsPerPage);

  const indexOfLastTransaction = page * rowsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;

  const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

  return (
    <section className="recent-transactions">
      <header className="flex items-center justify-between">
        <h2 className="recent-transactions-label">Recent transactions</h2>
        <Link
          href={`/dashboard/client/transaction-history?id=${accountId}`}
          className="view-all-btn">
          View all
        </Link>
      </header>

      <Tabs defaultValue={accountId} className="w-full">
        <TabsList className="recent-transactions-tablist">
          {accounts?.map((account: Account) => (
            <TabsTrigger key={account.$id} value={account.$id}>
              <BankTabItem key={account.$id} account={account} accountId={accountId} />
            </TabsTrigger>
          ))}
        </TabsList>

        {accounts.map((account: Account) => (
          <TabsContent value={account.$id} className="space-y-4" key={account.$id}>
            <BankInfo account={account} accountId={accountId} type="full" />

            <TransactionsTable transactions={currentTransactions} />

            {totalPages > 1 && (
              <div className="my-4 w-full">
                <Pagination totalPages={totalPages} page={page} />
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
};

export default RecentTransactions;
