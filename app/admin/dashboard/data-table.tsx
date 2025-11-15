"use client"

import { Button } from "@/components/ui/button"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useRouter } from "next/navigation"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pagination,
}: DataTableProps<TData, TValue>) {
  const router = useRouter()
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: pagination.totalPages,
  })

  return (
    <div>
      <div className="overflow-hidden rounded-md  bg-black/20 backdrop-blur ">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup, index) => (
              <TableRow key={`header-${index}`} className="border border-gray-800 bg-dark-200 hover:bg-dark-200">
                {headerGroup.headers.map((header, headerIndex) => {
                  return (
                    <TableHead key={`header-cell-${headerIndex}`} className="border border-gray-800   px-6 py-4 ">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, rowIndex) => (
                <TableRow
                  key={`row-${rowIndex}`}
                  data-state={row.getIsSelected() && "selected"}
                  className="border border-gray-800 bg-dark-200/40 hover:bg-primary/20 cursor-pointer transition-colors"
                >
                  {row.getVisibleCells().map((cell, cellIndex) => (
                    <TableCell key={`cell-${rowIndex}-${cellIndex}`} className="border border-gray-800 bg-black/20 px-6 py-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="border border-gray-800 bg-black/20">
                <TableCell colSpan={columns.length} className="h-24 text-center border border-gray-800 bg-black/20">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between py-4">
        <div className="text-sm text-muted-foreground">
          Showing {(pagination.page - 1) * pagination.limit + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} entries
        </div>
        <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`?page=${pagination.page - 1}`)}
          disabled={pagination.page === 1}
        >
          Previous
        </Button>
        <div className="flex items-center gap-1">
          {Array.from({ length: pagination.totalPages }, (_, i) => (
            <Button
              key={i}
              variant={i + 1 === pagination.page ? "secondary" : "outline"}
              size="sm"
              onClick={() => router.push(`?page=${i + 1}`)}
            >
              {i + 1}
            </Button>
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`?page=${pagination.page + 1}`)}
          disabled={pagination.page === pagination.totalPages}
        >
          Next
        </Button>
        </div>
      </div>
    </div>
  )
}