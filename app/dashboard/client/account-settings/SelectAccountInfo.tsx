import {Account} from '@/types';
import {useState} from 'react';

interface AccountInfoProps {
  accounts: Account[];
}

export function AccountInfo({accounts}: AccountInfoProps) {
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(accounts[0]);

  const handleAccountChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const accountType = event.target.value;
    const account = accounts.find((acc) => acc.subType === accountType) || null;
    setSelectedAccount(account);
  };

  return (
    <div className="w-full">
      {/* Dropdown */}
      <select
        onChange={handleAccountChange}
        className="w-full bg-transparent border border-gray-300 rounded-md bg-blue-50 px-4 py-2 text-left focus:outline-none"
        defaultValue={accounts[0]?.subType}>
        {accounts.map((account) => (
          <option key={account.subType} value={account.subType}>
            {account.subType}
          </option>
        ))}
      </select>

      {/* Account Details */}
      {selectedAccount && (
        <div className="mt-4 p-4 border border-gray-300 rounded-md bg-slate-50 shadow">
          <p>
            <strong>Account No:</strong> {selectedAccount.accountNumber}
          </p>
          <p>
            <strong>Routing No:</strong> {selectedAccount.routingNumber}
          </p>
        </div>
      )}
    </div>
  );
}
