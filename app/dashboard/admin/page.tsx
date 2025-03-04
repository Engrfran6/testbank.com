'use client';

import {Layout} from '@/components/layout';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {getAllAccounts, getAllTransactions, getAllUsers} from '@/lib/actions/user.actions';
import ProtectedRoute from '@/lib/protected';
import {Account, Transaction, User} from '@/types';
import Link from 'next/link';
import {useEffect, useState} from 'react';

const Page = () => {
  const [users, setUsers] = useState<User | any>([]);
  const [accounts, setAccounts] = useState<Account | any>([]);
  const [transactions, setTransactions] = useState<Transaction | any>([]);

  useEffect(() => {
    const getData = async () => {
      const allUsers = await getAllUsers();
      const allAccounts = await getAllAccounts();
      const allTransations = await getAllTransactions();

      setUsers(allUsers);
      setAccounts(allAccounts);
      setTransactions(allTransations);
    };

    getData();
  }, []);

  return (
    <ProtectedRoute role="admin">
      <Layout>
        <div className="px-4">
          <h1 className="text-3xl font-bold tracking-tight mb-6">Admin Dashboard</h1>
          <div className="grid gap-4  md:grid-cols-2 lg:grid-cols-3 ">
            <Card>
              <Link href="/dashboard/admin/users">
                <CardHeader>
                  <CardTitle>Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{users.length}</p>
                </CardContent>
              </Link>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Active Accounts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{accounts.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Total Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{transactions.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Restrictions</CardTitle>
              </CardHeader>
              <CardContent>
                <ul>
                  <li className="text-xl font-semibold">Users restrictions</li>
                  <li className="text-xl font-semibold">Account restrictions</li>
                  <li className="text-xl font-semibold">Transaction restrictions</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};
export default Page;
