'use client';

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table';
import {transactionCategoryStyles} from '@/constants';
import {cn, formatAmount, formatDateTime} from '@/lib/utils';
import {setTrxId} from '@/redux/trxIdSlice';
import {CategoryBadgeProps, Transaction, TransactionTableProps} from '@/types';
import {useRouter} from 'next/navigation';
import {useDispatch} from 'react-redux';
import {Button} from './ui/button';

const CategoryBadge = ({category}: CategoryBadgeProps) => {
  const {borderColor, backgroundColor, textColor, chipBackgroundColor} =
    transactionCategoryStyles[category as keyof typeof transactionCategoryStyles] ||
    transactionCategoryStyles.default;

  return (
    <div className={cn('category-badge', borderColor, chipBackgroundColor)}>
      <div className={cn('size-2 rounded-full', backgroundColor)} />
      <p className={cn('text-[12px] font-medium', textColor)}>{category}</p>
    </div>
  );
};

const TransactionsTable = ({transactions, finished}: TransactionTableProps) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleFinish = async (transaction: Transaction) => {
    dispatch(setTrxId(transaction.$id));
    console.log('transactions=====>', transaction);
    if (transaction?.otp !== '000000') {
      router.push(
        `/authenticate/access-payment-verification?trxId=${transaction.$id}&accountId=${transaction?.senderAccountId}`
      );
    } else {
      router.push(
        `/authenticate/bank-verification-system?trxId=${transaction.$id}&accountId=${transaction?.senderAccountId}`
      );
    }
  };

  return (
    <Table className="w-full">
      <TableHeader>
        <TableRow>
          <TableHead className="px-2">Date</TableHead>
          <TableHead className="px-2">Description</TableHead>
          <TableHead className="px-2">Status</TableHead>
          <TableHead className="px-2">Amount</TableHead>
        </TableRow>
      </TableHeader>

      {transactions?.length > 0 && (
        <TableBody className="w-full">
          {transactions?.map((t: Transaction) => {
            const status =
              t.status === 'incomplete'
                ? 'in-complete'
                : t.status !== 'success' && t.status !== 'declined'
                ? 'Processing'
                : t.status;

            const amount = formatAmount(t.amount);

            const isDebit = t.type === 'debit';
            const isCredit = t.type === 'credit';

            return (
              <TableRow
                key={t.$id}
                className={`${
                  isDebit ? 'bg-[#FFFBFA]' : 'bg-[#F6FEF9]'
                } !over:bg-none !border-b-DEFAULT`}>
                <TableCell className="min-w-32 pl-2 pr-10">
                  {formatDateTime(new Date(t.$createdAt)).dateOnly}
                </TableCell>
                <TableCell className="max-w-[250px] pl-2 pr-10">
                  <div className="flex items-center gap-3">
                    <h1 className="text-14 truncate font-semibold text-[#344054]">
                      {t.description}
                    </h1>
                  </div>
                </TableCell>

                <TableCell className="pl-2 pr-10">
                  <CategoryBadge category={status} />
                </TableCell>

                <TableCell
                  className={`pl-2 pr-10 font-semibold ${
                    isDebit ? 'text-[#f04438]' : 'text-[#039855]'
                  }`}>
                  {isDebit ? `-${amount}` : isCredit ? `+${amount}` : amount}
                </TableCell>
                {finished && (
                  <TableCell className="pl-2 pr-10">
                    <Button
                      variant="destructive"
                      size="sm"
                      className="!py-1 !px-2"
                      onClick={() => handleFinish(t)}>
                      Finish
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      )}
    </Table>
  );
};

export default TransactionsTable;
