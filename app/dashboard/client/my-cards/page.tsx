'use client';
import BankCard from '@/components/BankCard';
import HeaderBox from '@/components/HeaderBox';
import {RootState} from '@/redux/store';
import {Card} from '@/types';
import {useRouter} from 'next/navigation';
import {useEffect, useMemo} from 'react';
import {useSelector} from 'react-redux';

const MyCards = () => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user.user);

  // Redirect if user is not logged in
  useEffect(() => {
    if (!user) {
      router.push('/sign-in');
    }
  }, [user, router]);

  const accountsData = useSelector((state: RootState) => state.accounts.data);

  // Memoize cards & accounts to avoid unnecessary re-renders
  const cards = useMemo(() => accountsData?.cards || [], [accountsData]);
  const accs = useMemo(() => accountsData?.data || [], [accountsData]);

  // Merge accounts with their respective cards
  const all = useMemo(() => {
    return accs.map((account: any) => ({
      ...account,
      cards: cards.filter((card: any) => card.accountId === account.$id),
    }));
  }, [accs, cards]);

  console.log('all', all);

  if (!accountsData) return null;

  return (
    <section className="flex">
      <div className="my-banks">
        <HeaderBox
          title="My Bank Accounts"
          subtext="Effortlessly manage your banking activities."
        />

        <div className="space-y-4">
          <h2 className="header-2">Your Cards</h2>
          {cards.length === 0 && (
            <p className="flex justify-center items-center p-48 italic text-gray-500 font-medium">
              You do not have a card yet
            </p>
          )}
          <div className="flex flex-wrap gap-6">
            {all.map((account: any) =>
              account.cards.map((c: Card) => (
                <BankCard
                  key={c.cvv}
                  account={account} // Pass the entire account
                  card={c}
                  userName={`${user?.firstname} ${user?.lastname}`}
                  showBalance={false}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyCards;
