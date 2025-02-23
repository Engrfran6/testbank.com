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

interface Transaction {
  id: string
  user: string
  amount: number
  type: 'deposit' | 'withdrawal'
  date: string
}

const initialTransactions: Transaction[] = [
  { id: '1', user: 'John Doe', amount: 100, type: 'deposit', date: '2023-06-01' },
  { id: '2', user: 'Jane Smith', amount: 50, type: 'withdrawal', date: '2023-06-02' },
  { id: '3', user: 'Bob Johnson', amount: 200, type: 'deposit', date: '2023-06-03' },
]

export function TransactionsTable() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions)

  const handleDelete = (id: string) => {
    setTransactions(transactions.filter(transaction => transaction.id !== id))
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell>{transaction.user}</TableCell>
            <TableCell>${transaction.amount.toFixed(2)}</TableCell>
            <TableCell>{transaction.type}</TableCell>
            <TableCell>{transaction.date}</TableCell>
            <TableCell>
              <Button variant="ghost" size="icon">
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(transaction.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

