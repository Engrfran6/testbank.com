'use client';

import {Layout} from '@/components/layout';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {getAllUsers} from '@/lib/actions/user.actions';
import ProtectedRoute from '@/lib/protected';
import {User} from '@/types';
import {MessageCircle, X} from 'lucide-react';
import Link from 'next/link';
import {useEffect, useState} from 'react';
import AdminLiveChat from './AdminLiveChat';

const Page = () => {
  const [users, setUsers] = useState<User | any>([]);

  useEffect(() => {
    const getUsers = async () => {
      const allUsers = await getAllUsers();

      setUsers(allUsers);
    };

    getUsers();
  }, []);

  const [isChatOpen, setIsChatOpen] = useState(false); // Chat visibility state

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
                <p className="text-3xl font-bold">569</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Total Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">1,678</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
      {/* Chat Toggle Button */}
      <div className="fixed bottom-5 right-5 flex items-center gap-2">
        <span className="text-sm italic text-blue-700">Chat with client</span>
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className=" bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-all">
          {isChatOpen ? <X size={40} /> : <MessageCircle size={40} />}
        </button>
      </div>

      {/* Chat Box */}
      {isChatOpen && (
        <div className="fixed bottom-16 right-5 w-80 max-w-fit bg-white border border-gray-300 shadow-lg rounded-lg z-10">
          <AdminLiveChat />
        </div>
      )}
    </ProtectedRoute>
  );
};
export default Page;
