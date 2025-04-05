'use client';

import {DataTable} from '@/components/data-table';
import {Layout} from '@/components/layout';
import {Button} from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {Switch} from '@/components/ui/switch';
import {Textarea} from '@/components/ui/textarea';
import {useToast} from '@/hooks/use-toast';
import {getAccounts} from '@/lib/actions/account.actions';
import {deleteAccount, updateAccount} from '@/lib/actions/user.actions';
import {useSearchParams} from 'next/navigation';
import {useEffect, useState} from 'react';

declare type Account = {
  $id: string;
  userId: string;
  accountNumber: string;
  currentBalance: number;
  availableBalance: number;
  subType: string;
  status: string;
  active: boolean;
  fraudAlert: boolean;
  name: string;
  routingNumber: string;
  otp: string;
  createdAt: string;
  message: string;
  codestatus: boolean;
  updateAt: string;
  transferlimit: number;
  mintransfer: number;
};

const columns: {header: string; accessor: keyof Account}[] = [
  {accessor: 'accountNumber', header: 'Account Number'},
  {accessor: 'routingNumber', header: 'Routing Number'},
  {accessor: 'subType', header: 'Sub Type'},
  {accessor: 'currentBalance', header: 'Current Balance'},
  {accessor: 'status', header: 'Status'},
  {accessor: 'createdAt', header: 'Created'},
  {accessor: 'updateAt', header: 'Updated'},
  {accessor: 'mintransfer', header: 'Min-transfer'},
  {accessor: 'transferlimit', header: 'Max-transfer'},
];

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [changesMade, setChangesMade] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentAccount, setCurrentAccount] = useState<Account | null>(null);
  const {toast} = useToast();
  const [selectedStatus, setSelectedStatus] = useState('active');
  const [codestatus, setCodeStatus] = useState<boolean>(false);

  const searchParams = useSearchParams();
  const userId = searchParams.get('userId') || 'No User ID';
  const id = searchParams.get('id') || 'No ID';

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        if (userId) {
          const allAccounts = await getAccounts({userId: userId as string});
          setAccounts(allAccounts.data);
        } else return;
      } catch (error) {
        console.error('Error fetching accounts:', error);
      }
    };

    fetchAccounts();
  }, [userId, changesMade]);

  useEffect(() => {
    if (currentAccount) {
      setCodeStatus(currentAccount.codestatus);
    }
  }, [currentAccount]);

  const handleEdit = (account: Account) => {
    setCurrentAccount(account);
    setIsDialogOpen(true);
  };

  const handleDelete = async (account: Account) => {
    try {
      const deletedUser = await deleteAccount({documentId: account.$id});
      if (deletedUser.message) {
        setAccounts((prevAccounts) => prevAccounts?.filter((a) => a.$id !== account.$id) || []);
        toast({
          variant: 'success',
          title: 'Account Deleted',
          description: deletedUser.message || 'The account has been successfully deleted.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to delete account. Please try again.',
        });
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete account. Please try again.',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const min = parseFloat(formData.get('mintransfer') as string);
    const max = parseFloat(formData.get('transferlimit') as string);
    const currentBalance = parseFloat(formData.get('currentBalance') as string);

    if (isNaN(min) || isNaN(max)) {
      setErrors({amount: 'Min and Max transfer values must be valid numbers'});
      return;
    }

    if (min > max) {
      setErrors({amount: 'Min transfer must not be greater than Max transfer limit'});
      return;
    }

    if (isNaN(currentBalance)) {
      setErrors({currentBalance: 'Current balance must be a valid number'});
      return;
    }

    setErrors({});

    const accountData: any = {
      accountNumber: formData.get('accountNumber') as string,
      currentBalance: parseFloat(formData.get('currentBalance') as string),
      transferlimit: formData.get('transferlimit'),
      mintransfer: formData.get('mintransfer'),
      status: formData.get('status'),
      message: formData.get('message'),
      codestatus,
    };

    if (currentAccount) {
      try {
        const updatedAccount = await updateAccount({
          documentId: currentAccount.$id,
          updates: accountData,
        });

        if (updatedAccount) {
          setAccounts((prevAccounts) =>
            prevAccounts.map((account) =>
              account.$id === currentAccount.$id ? updatedAccount : account
            )
          );

          setChangesMade(true);

          toast({
            variant: 'success',
            title: 'Account Updated',
            description: 'The account has been successfully updated.',
          });
        } else {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Failed to update account. Please try again.',
          });
        }
      } catch (error) {
        console.error('Error updating account:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to update account. Please try again.',
        });
      }
    }

    setIsDialogOpen(false);
    setCurrentAccount(null);
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight pl-4">Accounts</h1>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setErrors({});
              setCurrentAccount(null);
            }
          }}>
          <DialogTrigger asChild className="mr-4">
            <Button onClick={() => setCurrentAccount(null)} disabled>
              Add New Account
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-200 border border-gray-700 max-sm:max-w-sm max-sm:max-h-[85vh] max-sm:overflow-y-auto ">
            <DialogHeader>
              <DialogTitle>{currentAccount ? 'Edit Account' : 'Add New Account'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input
                  id="accountNumber"
                  name="accountNumber"
                  defaultValue={currentAccount?.accountNumber}
                  required
                />
              </div>
              <div>
                <Label htmlFor="currentBalance">Current Balance</Label>
                <Input
                  id="currentBalance"
                  name="currentBalance"
                  type="number"
                  defaultValue={currentAccount?.currentBalance}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2 items-center">
                <div>
                  <Label htmlFor="mintransfer">Min-Transfer</Label>
                  <Input
                    id="mintransfer"
                    name="mintransfer"
                    type="text"
                    defaultValue={currentAccount?.mintransfer}
                  />
                </div>
                <div>
                  <Label htmlFor="amount">Max-Transfer</Label>
                  <Input
                    id="transferlimit"
                    name="transferlimit"
                    type="text"
                    defaultValue={currentAccount?.transferlimit}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  name="status"
                  value={currentAccount?.status}
                  onValueChange={(value) => setSelectedStatus(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="opacity-100 bg-slate-50 ">
                    <SelectItem className="cursor-pointer" value="active">
                      Active
                    </SelectItem>
                    <SelectItem className="cursor-pointer" value="inactive">
                      Inactive (lock account)
                    </SelectItem>
                    <SelectItem className="cursor-pointer" value="frozen">
                      Frozen
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {(selectedStatus === 'inactive' || selectedStatus === 'frozen') && (
                <div>
                  <Label htmlFor="message">Status Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    defaultValue={currentAccount?.message}
                    placeholder="Enter status reason..."
                    required
                  />
                </div>
              )}
              {errors.amount && <span className="text-red-500">{errors.amount}</span>}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="cot">CODE (cot - tax - imf)</Label>
                  <Switch
                    id="cot"
                    name="cot"
                    checked={codestatus}
                    onCheckedChange={() => setCodeStatus(!codestatus)}
                    className="!bg-gray-400 data-[state=checked]:!bg-blue-700"
                  />
                </div>
              </div>

              <Button type="submit" className="px-4 py-2 border bg-blue-600 text-white">
                {currentAccount ? ' Update account' : 'Create account'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <DataTable data={accounts} columns={columns} onEdit={handleEdit} onDelete={handleDelete} />
    </Layout>
  );
}
