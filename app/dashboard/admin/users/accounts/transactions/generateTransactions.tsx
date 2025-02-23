'use client';

import {Button} from '@/components/ui/button';
import {useState} from 'react';

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
import {generateTransactions, saveTransactionsToAppwrite} from '@/lib/transactionGenerator';

interface UserTrxProps {
  userId: string;
  id: string;
}

export default function AutoGenerateTransactionsPage({userId, id}: UserTrxProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const {toast} = useToast();

  const senderInfo = {
    userId: userId,
    firstname: 'Deulocode',
    lastname: 'Francis ',
    email: 'john.doe@example.com',
  };

  const senderAccount = {
    $id: id,
    accountNumber: '123456789',
    routingNumber: '021000021',
  };

  const handleGenerateTrx = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formdata = new FormData(e.currentTarget);

    const inputdata = {
      primaryTransactionCountry: formdata.get('primaryTransactionCountry') as string,
      secondaryTransactionCountry: formdata.get('secondaryTransactionCountry') as string,
      totalNumberOfTransactions: parseInt(formdata.get('totalNumberOfTransactions') as string, 10),
      transactionType: formdata.get('type') as string,
      minAmount: parseFloat(formdata.get('minAmount') as string),
      maxAmount: parseFloat(formdata.get('maxAmount') as string),
      month: parseInt(formdata.get('month') as string, 10),
      year: parseInt(formdata.get('year') as string, 10),
    };

    if (!userId || !id) {
      toast({
        title: 'Error',
        description: 'User ID or Account ID is missing.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    if (inputdata.minAmount > inputdata.maxAmount) {
      toast({
        title: 'Error',
        description: 'Min amount should not be greater than max amount.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    if (inputdata.month < 1 || inputdata.month > 12) {
      toast({
        title: 'Error',
        description: 'Month must be between 1 and 12.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    try {
      const transactions = await generateTransactions({
        inputdata,
        senderInfo,
        senderAccount,
      });

      toast({
        title: 'Success',
        description: `${transactions.length} transactions generated, You can preview and modify accordingly on the transactions list.`,
      });

      console.log('all created transactions no stringfy======>', transactions);

      if (transactions.length > 0) {
        await saveTransactionsToAppwrite(transactions);

        toast({
          variant: 'success',
          title: 'Success!',
          description: `${transactions.length} transactions has been saved successfully.`,
        });
      } else return null;

      setIsOpen(false);
    } catch (error) {
      console.error('Error generating transactions:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate transactions.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <div>
        <DialogTrigger asChild>
          <Button className="border-black-1 border hover:bg-blue-300 cursor-pointer">
            Auto Generate History
          </Button>
        </DialogTrigger>
      </div>
      <DialogContent className="bg-slate-200 border border-gray-700">
        <DialogHeader className="mb-4 text-blue-700">
          <DialogTitle>Auto generation transactions history</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleGenerateTrx}>
          <div>
            <Label htmlFor="status" className="text-blue-800">
              Transaction type
            </Label>
            <Select name="type">
              <SelectTrigger>
                <SelectValue placeholder="type" />
              </SelectTrigger>
              <SelectContent className="opacity-100 bg-slate-50 ">
                <SelectItem className="cursor-pointer" value="both">
                  Credit & Debit
                </SelectItem>
                <SelectItem className="cursor-pointer" value="credit">
                  Credit
                </SelectItem>
                <SelectItem className="cursor-pointer" value="debit">
                  Debit
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Primary country</Label>
              <Input
                id="primaryTransactionCountry"
                name="primaryTransactionCountry"
                defaultValue="united states"
                placeholder="ex: Canada"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">
                Secondary country <span className="text-slate-600">(Optional)</span>
              </Label>
              <Input
                id="secondaryTransactionCountry"
                name="secondaryTransactionCountry"
                defaultValue=""
                placeholder="Optional"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="recipientBank">Total history</Label>
              <Input
                type="number"
                id="totalNumberOfTransactions"
                name="totalNumberOfTransactions"
                defaultValue={5}
                placeholder="ex: 5"
                required
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="name">Amount between</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  id="minAmount"
                  name="minAmount"
                  defaultValue={5}
                  placeholder="lowest amount"
                  required
                />
                -
                <Input
                  type="number"
                  id="maxAmount"
                  name="maxAmount"
                  defaultValue={10}
                  placeholder="highest amount"
                  required
                />
              </div>
            </div>
          </div>

          <div className="col-span-2">
            <Label htmlFor="name">Month / Year</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                id="month"
                name="month"
                defaultValue={1}
                placeholder='ex: "04" for april'
                required
              />
              -
              <Input
                type="number"
                id="year"
                name="year"
                placeholder='ex: "2020"'
                defaultValue={2000}
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 border bg-blue-600 text-white">
            {isLoading ? 'Generating...' : 'Generate Transactions'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
