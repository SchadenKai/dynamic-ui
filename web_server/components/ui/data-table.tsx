import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./button";
import { Input } from "./input";

interface FieldModel {
  field_name: string;
  label: string;
  value: string | number | boolean[];
  data_type: string;
  sortable: boolean;
  filterable: boolean;
  hidden: boolean;
}

export interface DataTableProps {
  title: string;
  description: string;
  table_name: string;
  fields: FieldModel[];
  className?: string;
}

const DataTable = React.forwardRef<HTMLDivElement, DataTableProps>(
  ({ title, description, fields, className, ...props }, ref) => {
    // Filter out hidden fields
    const visibleFields = fields.filter((field) => !field.hidden);

    // Transform field values into rows
    const rows = React.useMemo(() => {
      // Find the maximum array length among all field values
      const maxLength = visibleFields.reduce((max, field) => {
        const value = Array.isArray(field.value) ? field.value.length : 1;
        return Math.max(max, value);
      }, 0);

      // Create rows based on field values
      return Array.from({ length: maxLength }, (_, rowIndex) => {
        return visibleFields.reduce((row, field) => {
          const value = Array.isArray(field.value)
            ? field.value[rowIndex]
            : rowIndex === 0
            ? field.value
            : "";
          row[field.field_name] = value;
          return row;
        }, {} as Record<string, string | number | boolean>);
      });
    }, [visibleFields]);

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
          {/* <Input /> */}
          <Table>
            <TableHeader>
              <TableRow>
                {visibleFields.map((field) => (
                  <TableHead
                    key={field.field_name}
                    className={cn(
                      field.sortable && "cursor-pointer select-none"
                    )}
                  >
                    {field.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {visibleFields.map((field) => (
                    <TableCell key={field.field_name}>
                      {row[field.field_name]?.toString() || ""}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              {rows.length === 0 && (
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
          <div className="flex flex-row w-full justify-end gap-3">
            <Button className="">Start</Button>
            <Button className="">End</Button>
          </div>
        </div>
      </div>
    );
  }
);
DataTable.displayName = "DataTable";

export { DataTable };
