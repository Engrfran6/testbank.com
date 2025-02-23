'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {Account, User} from '@/types';
import {PDFDownloadLink} from '@react-pdf/renderer';
import TransferReceiptPDF from './TransferReceiptPDF';
import {Button} from './ui/button';

interface TransferReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: {
    senderAccountId: string;
    receiverAccountId: string;
    accountNo: string;
    routingNo: string;
    recipientName: string;
    recipientBank: string;
    amount: number;
    email: string;
  };
  user: User;
  accounts: Account[];
}

const TransferReceiptModal = ({
  isOpen,
  onClose,
  transaction,
  user,
  accounts = [],
}: TransferReceiptModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-slate-50">
        <DialogHeader>
          <DialogTitle className="text-green-600">Transfer Successful</DialogTitle>
          <DialogDescription>
            Your transfer has been processed successfully. You can download the receipt below.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 py-4">
          <p className="text-sm text-muted-foreground font-bold mb-2">Transaction Details:</p>
          <p className="text-sm">
            Amount: <span className="italic">${transaction.amount.toFixed(2)}</span>
          </p>
          <p className="text-sm">
            Recipient: <span className="italic">{transaction.recipientName}</span>
          </p>
          <p className="text-sm">
            Account Number: <span className="italic">{transaction.accountNo}</span>
          </p>
          <p className="text-sm">
            Routing: <span className="italic">{transaction.routingNo}</span>
          </p>
          <p className="text-sm">
            Recipient Bank: <span className="italic">{transaction.recipientBank}</span>
          </p>
        </div>
        <DialogFooter>
          <PDFDownloadLink
            document={
              <TransferReceiptPDF transaction={transaction} user={user} accounts={accounts} />
            }
            fileName="transfer_receipt.pdf">
            {/* @ts-ignore */}
            {({loading}) => (
              <Button className="border border-b-green-400 bg-slate-100">
                {loading ? 'Loading...' : 'Download transaction receipt'}
              </Button>
            )}
          </PDFDownloadLink>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default TransferReceiptModal;
