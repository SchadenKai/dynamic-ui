import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

enum ComponentType {
    Button = "Button",
    Input = "Input",
    Table = "Table",
    TableBody = "TableBody",
    TableCell = "TableCell",
    TableHead = "TableHead",
    TableHeader = "TableHeader",
    TableRow = "TableRow",
    Textarea = "Textarea",
    }

const componentMap: Record<string, React.ComponentType<any>> = {
  "Button": Button,
  "Input": Input,
  "Table": Table,
  "TableBody": TableBody,
  "TableCell": TableCell,
  "TableHead": TableHead,
  "TableHeader": TableHeader,
  "TableRow": TableRow,
  "Textarea": Textarea,
};

export function mapTextToComponent(text: string): React.ComponentType<any> | null {
  return componentMap[text] || null;
}
