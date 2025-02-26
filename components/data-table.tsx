'use client';

import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table';
import {cn} from '@/lib/utils';
import {ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Dot, Loader2} from 'lucide-react';
import {usePathname, useRouter} from 'next/navigation';
import {useState} from 'react';
import {MyAlert} from './deleteAlert';
import {BreadcrumbDemo} from './homepage/breadcrum';

interface DataTableProps<T> {
  data: T[];
  columns: {
    header: string;
    accessor: keyof T;
  }[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
}

export function DataTable<T extends {$id: string; userId: string; status: string}>({
  data = [],
  columns,
  onEdit,
  onDelete,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  const filteredData = data.filter((item) =>
    Object.values(item).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const routeMapping: Record<string, string> = {
    '/dashboard/admin/users': '/dashboard/admin/users/accounts',
    '/dashboard/admin/users/accounts': '/dashboard/admin/users/accounts/transactions',
  };

  const handleRedirect = (item: any) => {
    const basePath = pathname.split('?')[0];
    const nextRoute = routeMapping[basePath];

    if (nextRoute) {
      const newUrl = `${nextRoute}?userId=${item.userId}&id=${item.$id}`;
      router.push(newUrl);
    } else {
      return;
    }
  };

  return (
    <div>
      <div className="px-4 mb-4">
        <div className="mb-4">
          <BreadcrumbDemo />
        </div>
        {pathname.endsWith('users') && (
          <div className="flex flex-col gap-4 md:flex justify-between items-center md:mb-4">
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}>
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}>
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <Table className="overflow-x-auto min-w-full">
        <TableHeader>
          <TableRow className="bg-blue-300 border-b-blue-900">
            <Dot size={60} />
            {columns.map((column) => (
              <TableHead key={column.accessor as string}>{column.header}</TableHead>
            ))}
            {(onEdit || onDelete) && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentData.map((item) => (
            <TableRow
              key={item.$id}
              className="hover:bg-slate-200 text-[12px] hover:cursor-pointer hover:border-b-black-1">
              <TableCell>
                <Dot
                  size={50}
                  className={cn(
                    item.status === 'Active'
                      ? 'text-green-600'
                      : item.status === 'InActive'
                      ? 'text-red-600'
                      : ''
                  )}
                />
              </TableCell>
              {columns.map((column) => (
                <TableCell
                  key={`${item.$id}-${column.accessor as string}`} // Unique key for each cell
                  onClick={() => handleRedirect(item)}
                  className={cn(
                    item[column.accessor] === 'pending'
                      ? 'text-gray-700'
                      : item[column.accessor] === 'success'
                      ? 'text-green-600'
                      : item[column.accessor] === 'declined'
                      ? 'text-red-700'
                      : '',
                    item.$id === 'OTP' ? 'text-green-500' : ''
                  )}>
                  {item[column.accessor] as string}
                </TableCell>
              ))}

              {(onEdit || onDelete) && (
                <TableCell key={`${item.$id}-actions`}>
                  {onEdit && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(item)}
                      className="text-blue-700">
                      Edit
                    </Button>
                  )}
                  {onDelete && <MyAlert onConfirm={() => onDelete(item)} />}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {!data.length && (
        <p className="flex justify-center items-center p-32 text-blue-500">
          <Loader2 size={40} className="animate-spin" /> &nbsp; Loading...
        </p>
      )}
    </div>
  );
}
