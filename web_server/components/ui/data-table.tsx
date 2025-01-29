import * as React from "react"
import { cn } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface FieldModel {
  field_name: string
  label: string
  value: string
  data_type: string
  sortable: boolean
  filterable: boolean
  hidden: boolean
}

type DataRecord = {
  [key: string]: string | number | boolean | null
}

export interface DataTableProps {
  title: string
  description: string
  table_name: string
  fields: FieldModel[]
  data?: DataRecord[]
  className?: string
}

const DataTable = React.forwardRef<HTMLDivElement, DataTableProps>(
  ({ title, description, fields, data = [], className, ...props }, ref) => {
    // Filter out hidden fields
    const visibleFields = fields.filter(field => !field.hidden)

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        {(title || description) && (
          <div className="mb-4">
            {title && <h2 className="text-lg font-semibold">{title}</h2>}
            {description && (
              <p className="mt-1 text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        )}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {visibleFields.map((field) => (
                  <TableHead
                    key={field.field_name}
                    className={cn(
                      field.sortable && "cursor-pointer select-none",
                    )}
                  >
                    {field.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {visibleFields.map((field) => (
                    <TableCell key={field.field_name}>
                      {row[field.field_name]?.toString() || ""}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              {data.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={visibleFields.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }
)
DataTable.displayName = "DataTable"

export { DataTable }