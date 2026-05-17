import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dispatch, SetStateAction } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    page: number;
    pageData: any;
    setPage: Dispatch<SetStateAction<number>>;
}

export function UserTable<TData, TValue>({
    columns,
    data,
    page,
    pageData,
    setPage,
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="overflow-hidden rounded-md border shadow-sm">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef
                                                      .header,
                                                  header.getContext(),
                                              )}
                                    </TableHead>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && 'selected'}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext(),
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className="h-24 text-center"
                            >
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <div className="mr-4 flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 border-sky-200 text-xs text-sky-700 hover:bg-sky-50 hover:text-sky-800 disabled:opacity-40"
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page <= 1}
                >
                    <ChevronLeft className="mr-1 h-3.5 w-3.5" />
                    Previous
                </Button>

                <span className="text-xs text-muted-foreground">
                    Page {page} of {pageData?.last_page ?? 1}
                </span>

                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 border-sky-200 text-xs text-sky-700 hover:bg-sky-50 hover:text-sky-800 disabled:opacity-40"
                    onClick={() => setPage((prev) => prev + 1)}
                    disabled={page >= (pageData?.last_page ?? 1)}
                >
                    Next
                    <ChevronRight className="ml-1 h-3.5 w-3.5" />
                </Button>
            </div>
        </div>
    );
}
