import {Layout} from '@/components/layout';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {getAllUsers} from '@/lib/actions/user.actions';
import Link from 'next/link';

const Page = async () => {
  const allUsers = await getAllUsers();

  return (
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
                <p className="text-3xl font-bold">{allUsers.length}</p>
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
  );
};
export default Page;
