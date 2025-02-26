'use client';

import {Layout} from '@/components/layout';
import {Button} from '@/components/ui/button';
import {useEffect, useState} from 'react';

import {DataTable} from '@/components/data-table';
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
import {useToast} from '@/hooks/use-toast';
import {getAccount} from '@/lib/actions/account.actions';
import {
  createTransaction,
  deleteTransaction,
  getAdminTransactions,
  updateTransaction,
} from '@/lib/actions/transaction.actions';
import {updateAccount} from '@/lib/actions/user.actions';
import {formatDateT, generateReceiverAccountId} from '@/lib/utils';
import {useSearchParams} from 'next/navigation';
import AutoGenerateTransactionsPage from './generateTransactions';

interface Transaction {
  $id: string;
  description: string;
  type: string;
  email: string;
  channel: string;
  category: string;
  accountNo: string;
  routingNo: string;
  recipientName: string;
  recipientBank: string;
  amount: number;
  receiverAccountId: string;
  senderAccountId: string;
  has_more: string;
  userId: string;
  created: string;
  updated: string;
  status: string;
  otp: string;
}

const columns: {header: string; accessor: keyof Transaction}[] = [
  {accessor: 'email', header: 'Email'},
  {accessor: 'recipientName', header: 'RecipientName'},
  {accessor: 'recipientBank', header: 'RecipientBank'},
  {accessor: 'accountNo', header: 'AccountNo'},
  {accessor: 'routingNo', header: 'RoutingNo'},
  {accessor: 'amount', header: 'Amount'},
  {accessor: 'description', header: 'Description'},
  {accessor: 'type', header: 'Transaction type'},
  {accessor: 'channel', header: 'Channel'},
  {accessor: 'created', header: 'CreatedAt'},
  {accessor: 'updated', header: 'UpdatedAt'},
  {accessor: 'status', header: 'Status'},
  {accessor: 'otp', header: 'OTP'},
];

export default function TransactionsPage() {
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);
  const {toast} = useToast();
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId') || 'No User ID';
  const id = searchParams.get('id') || 'No User ID';

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        if (id) {
          const allTransactions = await getAdminTransactions(id as string);

          const allFetchedTransactions = allTransactions.map((trx: any) => ({
            $id: trx.$id,
            userId: userId,
            description: trx.description,
            type: trx.type,
            email: trx.email,
            channel: trx.channel,
            category: trx.category,
            accountNo: trx.accountNo,
            routingNo: trx.routingNo,
            recipientName: trx.recipientName,
            recipientBank: trx.recipientBank,
            amount: trx.amount,
            receiverAccountId: trx.receiverAccountId,
            senderAccountId: trx.senderAccountId,
            has_more: trx.has_more,
            created: formatDateT(trx.$createdAt),
            updated: formatDateT(trx.$updatedAt),
            status: trx.status,
            otp: trx.otp,
          }));

          setTransactions(allFetchedTransactions); // This will update Transactions only once.
        } else return;
      } catch (error) {
        console.error('Error fetching Transactions:', error);
      }
    };

    fetchTransactions();
  }, [id, transactions.length++, userId]);

  const handleEdit = (transaction: Transaction) => {
    setCurrentTransaction(transaction);
    setIsDialogOpen(true);
  };

  const handleDelete = async (transaction: Transaction) => {
    try {
      const deletedTransaction = await deleteTransaction({documentId: transaction.$id});
      if (deletedTransaction.message) {
        // Update users state

        setTransactions(
          (prevTransactions) => prevTransactions?.filter((t) => t.$id !== transaction.$id) || []
        );

        // Display toast notification
        toast({
          variant: 'success', // Use a variant like "success" if it's not destructive
          title: 'Transaction Deleted',
          description:
            deletedTransaction.message || 'The transaction has been successfully deleted.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to delete transaction. Please try again.',
        });
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete transaction. Please try again.',
      });
    }
  };

  const updateAccountBalance = async (transaction: any, account: any) => {
    if (transaction?.status === 'success') {
      if (account?.$id === transaction?.senderAccountId) {
        await updateAccount({
          documentId: account?.$id,
          updates: {
            currentBalance:
              transaction?.type === 'debit'
                ? account?.currentBalance - transaction?.amount
                : account?.currentBalance + transaction?.amount,
          },
        });
      }

      toast({
        variant: 'success',
        title: 'Current balance updated',
        description: `Current balance updated!.`,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const amount = parseFloat(formData.get('amount') as string);
    const type = formData.get('type') as string; // Ensure type is a string
    const accountId = id as string;
    const account: any = await getAccount({accountId});
    const accountData = account?.data;
    const transferLimit = account?.transferlimit || '500';
    const mintransfer = account?.mintransfer || '100';
    const accountBalance = accountData?.currentBalance || 0;

    // Validation for debit transactions
    if (type === 'debit') {
      if (amount > accountBalance) {
        setErrors({amount: 'Insufficient balance'});
        return;
      }

      if (amount > parseFloat(transferLimit)) {
        setErrors({amount: `Amount exceeds transfer limit of $${transferLimit}`});
        return;
      }

      if (amount < parseFloat(mintransfer)) {
        setErrors({amount: `Amount must be at least $${mintransfer}`});
        return;
      }
    }

    // Validation for credit transactions
    if (type === 'credit') {
      if (amount > parseFloat(transferLimit)) {
        setErrors({amount: `Amount exceeds transfer limit of $${transferLimit}`});
        return;
      }

      if (amount < parseFloat(mintransfer)) {
        setErrors({amount: `Amount must be at least $${mintransfer}`});
        return;
      }
    }

    // Clear errors if validation passes
    setErrors({});

    const transactionData: any = {
      receiverAccountId: generateReceiverAccountId(20),
      senderAccountId: id,
      email: 'example@gmail.com',
      userId: userId,
      recipientName: formData.get('recipientName'),
      recipientBank: formData.get('recipientBank'),
      channel: formData.get('channel'),
      category: '',
      routingNo: formData.get('routingNo'),
      accountNo: formData.get('accountNo'),
      description: formData.get('description'),
      amount: parseFloat(formData.get('amount') as string),
      type: formData.get('type'),
      status: formData.get('status'),
    };

    if (currentTransaction) {
      const updatedFields: Partial<Transaction> = {};
      for (const key in transactionData) {
        if (
          transactionData[key as keyof Transaction] !== null &&
          currentTransaction[key as keyof Transaction] !== transactionData[key as keyof Transaction]
        ) {
          updatedFields[key as keyof Transaction] = transactionData[key as keyof Transaction];
        }
      }

      if (Object.keys(updatedFields).length > 0) {
        const updatedTransaction = await updateTransaction({
          documentId: currentTransaction.$id,
          updates: updatedFields,
        });

        await updateAccountBalance(updatedTransaction, accountData);

        setTransactions(
          transactions.map((transaction) =>
            transaction.$id === currentTransaction.$id ? updatedTransaction : transaction
          )
        );

        toast({
          variant: 'success',
          title: 'Successful',
          description: `This transaction details has been updated successfully!.`,
        });
      } else {
        toast({
          variant: 'default',
          title: 'No Changes Detected',
          description: 'No fields were updated.',
        });
      }
    } else {
      const newTransaction = await createTransaction(transactionData);

      await updateAccountBalance(newTransaction, accountData);

      if (newTransaction) {
        toast({
          variant: 'success',
          title: 'Success!',
          description: 'Transaction created successfully.',
        });
      }
    }

    setIsDialogOpen(false);
    setCurrentTransaction(null);
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setCurrentTransaction(null); // Reset current transaction
              setErrors({}); // Clear errors
            }
          }}>
          <h1 className="text-3xl font-bold tracking-tight pl-4">Transactions</h1>
          <div className="flex flex-col gap-2 md:flex  items-center">
            <DialogTrigger asChild className="mr-4">
              <Button onClick={() => setCurrentTransaction(null)}>Add New Transaction</Button>
            </DialogTrigger>

            <AutoGenerateTransactionsPage userId={userId as string} id={id as string} />
          </div>
          <DialogContent className="bg-slate-200 border border-gray-700 max-sm:max-w-sm max-sm:max-h-[85vh] max-sm:overflow-y-auto ">
            <DialogHeader>
              <DialogTitle>
                {currentTransaction ? 'Edit Transaction' : 'Add New Transaction'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Receiver&apos;s name</Label>
                  <Input
                    id="recipientName"
                    name="recipientName"
                    defaultValue={currentTransaction?.recipientName}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="recipientBank">Recipient Bank</Label>
                  <Input
                    id="recipientBank"
                    name="recipientBank"
                    defaultValue={currentTransaction?.recipientBank}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" defaultValue={currentTransaction?.email} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="receiverAccountId">Receipient Account</Label>
                  <Input
                    id="accountNo"
                    name="accountNo"
                    defaultValue={currentTransaction?.accountNo}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="accountNo">Routing Number</Label>
                  <Input
                    id="routingNo"
                    name="routingNo"
                    defaultValue={currentTransaction?.routingNo}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="text"
                  defaultValue={currentTransaction?.amount}
                  required
                />
                {errors.amount && <span className="text-red-500">{errors.amount}</span>}
              </div>

              <div>
                <Label htmlFor="amount">Description</Label>
                <Input
                  id="description"
                  name="description"
                  type="text"
                  defaultValue={currentTransaction?.description}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="channel" className="text-blue-800">
                    Channel
                  </Label>
                  <Select name="channel" defaultValue={currentTransaction?.channel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select channel" />
                    </SelectTrigger>
                    <SelectContent className="opacity-100 bg-slate-50 ">
                      <SelectItem className="cursor-pointer" value="online-mobile">
                        mobile
                      </SelectItem>
                      <SelectItem className="cursor-pointer" value="online-web">
                        Web
                      </SelectItem>
                      <SelectItem className="cursor-pointer" value="wire-transfer">
                        wire-transfer
                      </SelectItem>
                      <SelectItem className="cursor-pointer" value="cash-deposit">
                        Cash-D
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="type" className="text-blue-800">
                    Type
                  </Label>
                  <Select name="type" defaultValue={currentTransaction?.type}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="opacity-100 bg-slate-50 ">
                      <SelectItem className="cursor-pointer" value="debit">
                        debit
                      </SelectItem>
                      <SelectItem className="cursor-pointer" value="credit">
                        credit
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="status" className="text-blue-800">
                  Status
                </Label>
                <Select name="status" defaultValue={currentTransaction?.status}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="opacity-100 bg-slate-50 ">
                    <SelectItem className="cursor-pointer" value="declined">
                      Declined
                    </SelectItem>
                    <SelectItem className="cursor-pointer" value="success">
                      Success
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="px-4 py-2 border bg-blue-600 text-white">
                {currentTransaction ? ' Update transaction' : 'Create transaction'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {/* DataTable replacement */}
      <DataTable
        data={transactions}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </Layout>
  );
}
