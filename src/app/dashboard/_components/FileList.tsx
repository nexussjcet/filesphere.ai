"use client"

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
import { UserBrowserState } from "@/lib/store";

export const FileList = () => {
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

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
]

export const TableDemo = () => {
  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRowCustom key={invoice.invoice} invoice={invoice} />
        ))}
      </TableBody>
    </Table>
  )
}

const TableRowCustom: React.FC<{
  invoice: typeof invoices[0]
}> = ({ invoice }) => {
  const { selectFile } = UserBrowserState()

  return (<TableRow key={invoice.invoice} onClick={() => selectFile([invoice.invoice])}>
    <TableCell className="font-medium">{invoice.invoice}</TableCell>
    <TableCell>{invoice.paymentStatus}</TableCell>
    <TableCell>{invoice.paymentMethod}</TableCell>
    <TableCell className="text-right">{invoice.totalAmount}</TableCell>
  </TableRow>);
}
