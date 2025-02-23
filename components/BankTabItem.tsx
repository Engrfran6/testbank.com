'use client';

import {useRouter, useSearchParams} from 'next/navigation';

import {cn, formUrlQuery} from '@/lib/utils';
import {BankTabItemProps} from '@/types';

export const BankTabItem = ({account, accountId}: BankTabItemProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isActive = accountId === account?.$id;

  const handleBankChange = () => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: 'id',
      value: account?.$id,
    });
    router.push(newUrl, {scroll: false});
  };

  return (
    <div
      onClick={handleBankChange}
      className={cn(`banktab-item`, {
        ' border-blue-600': isActive,
      })}>
      <p
        className={cn(`text-16 line-clamp-1 flex-1 font-medium text-gray-500`, {
          ' text-blue-600': isActive,
        })}>
        {account.subType}
      </p>
    </div>
  );
};
