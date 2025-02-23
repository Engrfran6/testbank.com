import { useState } from 'react'
import { Edit, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface Account {
  id: string
  user: string
  accountNumber: string
  balance: number
  type: 'checking' | 'savings'
}

const initialAccounts: Account[] = [
  { id: '1', user: 'John Doe', accountNumber: '1234567890', balance: 1000, type: 'checking' },
  { id: '2', user: 'Jane Smith', accountNumber: '0987654321', balance: 5000, type: 'savings' },
  { id: '3', user: 'Bob Johnson', accountNumber: '1357924680', balance: 2500, type: 'checking' },
]

export function AccountsTable() {
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts)

  const handleDelete = (id: string) => {
    setAccounts(accounts.filter(account => account.id !== id))
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Account Number</TableHead>
          <TableHead>Balance</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {accounts.map((account) => (
          <TableRow key={account.id}>
            <TableCell>{account.user}</TableCell>
            <TableCell>{account.accountNumber}</TableCell>
            <TableCell>${account.balance.toFixed(2)}</TableCell>
            <TableCell>{account.type}</TableCell>
            <TableCell>
              <Button variant="ghost" size="icon">
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(account.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

