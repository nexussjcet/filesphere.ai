import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const FileList = () => {
  return (
    <div>
      <Table>
        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Last changes</TableHead>
            <TableHead className="text-right">File size</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">File 01</TableCell>
            <TableCell>Name 01</TableCell>
            <TableCell>Change 01</TableCell>
            <TableCell className="text-right">14mb</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">File 02</TableCell>
            <TableCell>Name 02</TableCell>
            <TableCell>Change 02</TableCell>
            <TableCell className="text-right">14mb</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">File 03</TableCell>
            <TableCell>Name 03</TableCell>
            <TableCell>Change 03</TableCell>
            <TableCell className="text-right">14mb</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">File 04</TableCell>
            <TableCell>Name 04</TableCell>
            <TableCell>Change 04</TableCell>
            <TableCell className="text-right">14mb</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default FileList;
