'use client';

import TransferReceiptPDF from '@/components/TransferReceiptPDF';
import {Button} from '@/components/ui/button';
import {RootState} from '@/redux/store';
import {PDFDownloadLink} from '@react-pdf/renderer';
import Image from 'next/image';
import {useRouter} from 'next/navigation';
import {useSelector} from 'react-redux';

const SuccessPage = () => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user.user);
  const accounts: any = useSelector((state: RootState) => state.accounts.data);
  const transaction = useSelector((state: RootState) => state.transfer.TransactionDetails);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6 text-center">
      <Image src="/icons/ok.png" alt="Success" width={100} height={100} />
      <h1 className="text-green-600 text-2xl font-bold mt-4">Transfer Successful!</h1>
      <p className="text-gray-700 mt-2 max-w-[620px]">
        Your transaction has been approved and is being processed. You should receive a confirmation
        email shortly... You also can download the receipt below.
      </p>

      <div className="bg-white shadow-lg rounded-lg p-6 mt-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-2">Transaction Details</h2>
        <p className="text-sm">
          Amount: <span className="italic">${transaction?.amount.toFixed(2)}</span>
        </p>
        <p className="text-sm">
          Recipient: <span className="italic">{transaction?.recipientName}</span>
        </p>
        <p className="text-sm">
          Account Number: <span className="italic">{transaction?.accountNo}</span>
        </p>
        <p className="text-sm">
          Routing: <span className="italic">{transaction?.routingNo}</span>
        </p>
        <p className="text-sm">
          Recipient Bank: <span className="italic">{transaction?.recipientBank}</span>
        </p>
      </div>

      <div className="mt-6 flex gap-4">
        <Button
          onClick={() => router.push('/dashboard/client')}
          className="bg-blue-600 text-white px-4 py-2 rounded">
          Go to Dashboard
        </Button>
        <PDFDownloadLink
          document={
            <TransferReceiptPDF transaction={transaction!} user={user!} accounts={accounts!} />
          }
          fileName="transfer_receipt.pdf">
          {({loading}) => (
            <Button className="border border-green-400 bg-green-600 text-white px-4 py-2 rounded">
              {loading ? 'Loading...' : 'Download Receipt'}
            </Button>
          )}
        </PDFDownloadLink>
      </div>
    </div>
  );
};

export default SuccessPage;
