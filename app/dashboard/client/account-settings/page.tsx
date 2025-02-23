'use client';

import HeaderBox from '@/components/HeaderBox';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {deleteUserAccount, updateUserAccount} from '@/lib/actions/user.actions';
import {RootState} from '@/redux/store';
import {setUser} from '@/redux/userSlice';
import {User} from '@/types';
import {Delete, Edit2, Eye, EyeOff} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {useState} from 'react';
import {useSelector} from 'react-redux';
import {EditAccountModal} from './EditAccountModal';
import {AccountInfo} from './SelectAccountInfo';

const AccountSettingsSection = () => {
  const [showSSN, setShowSSN] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const router = useRouter();

  const user = useSelector((state: RootState) => state?.user?.user);
  const accounts: any = useSelector((state: RootState) => state.accounts.data?.data);

  const handleSaveUser = async (updatedUser: Partial<User>) => {
    if (!user) return;

    const updated = await updateUserAccount({
      documentId: user.$id,
      updates: updatedUser,
    });

    if (updated) setUser(updated);
  };

  const handleDeleteUser = async (documentId: string) => {
    if (!user) return;

    const deletedAccount = await deleteUserAccount({
      documentId,
    });

    // delete alert here

    if (deletedAccount) router.push('/');
  };

  if (!user)
    return (
      <p className="flex items-center justify-center mt-[25%] text-lg text-blue-600">Loading...</p>
    );

  return (
    <div className="md:ml-4">
      <Card className="border-0 w-full mt-8 md:p-8">
        <CardContent className="space-y-6 mt-6">
          <HeaderBox title="Account Settings" subtext="" />
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span>
                    {user.firstname} {user.lastname}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span>{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date of Birth:</span>
                  <span>{new Date(user.dateOfBirth).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">SSN:</span>
                  <div className="flex items-center gap-2">
                    <span>{showSSN ? user.ssn : `*** *** ${user.ssn}`}</span>
                    <Button variant="ghost" size="sm" onClick={() => setShowSSN(!showSSN)}>
                      {showSSN ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Address Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Address Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Street:</span>
                  <span>{user.address1}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">City:</span>
                  <span>{user.city}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">State:</span>
                  <span>{user.state}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Postal Code:</span>
                  <span>{user.postalCode}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="flex justify-between ">
                <span className="text-muted-foreground">User ID:</span>
                <span className="p-4 border bg-blue-50">{user?.userId}</span>
              </div>
              <div className="">
                <AccountInfo accounts={accounts} />
              </div>
            </CardContent>
          </Card>

          {/* Edit Button */}
          <div className="flex justify-between">
            <Button
              onClick={() => handleDeleteUser(user.$id)}
              className="py-0.5 px-2 bg-red-700 text-white">
              <Delete className="mr-2 h-4 w-4" /> Delete account
            </Button>
            <Button
              onClick={() => setIsEditModalOpen(true)}
              className="py-0.5 px-2 bg-[#3589FE] text-white">
              <Edit2 className="mr-2 h-4 w-4" /> Edit Account Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <EditAccountModal
        user={user}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveUser}
      />
    </div>
  );
};

export default AccountSettingsSection;
