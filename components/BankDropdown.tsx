'use client';

import {useRouter, useSearchParams} from 'next/navigation';
import {useState} from 'react';

import {formUrlQuery, formatAmount} from '@/lib/utils';
import {BankDropdownProps} from '@/types';
import GenericSelect from './GenericSelect';

export const BankDropdown = ({accounts = [], setValue, otherStyles}: BankDropdownProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selected, setSelected] = useState(accounts[0]);

  // Transform accounts into the format expected by GenericSelect
  const options = accounts.map((account) => ({
    value: account.$id,
    label: account.subType,
    icon: '/icons/credit-card.svg',
    subText: formatAmount(account.currentBalance),
  }));

  const handleBankChange = (id: string) => {
    const account = accounts.find((account) => account.$id === id)!;

    setSelected(account);
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: 'id',
      value: id,
    });
    router.push(newUrl, {scroll: false});

    if (setValue) {
      setValue('senderAccountId', id);
    }
  };

  return (
    <div>
      <GenericSelect
        defaultValue={selected?.$id}
        options={options}
        onValueChange={handleBankChange}
        placeholder="Choose a bank account"
        label="Select transfer source"
        className={otherStyles}
      />
    </div>
  );
};
