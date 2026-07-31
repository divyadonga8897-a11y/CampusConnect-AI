"use client";

import React from "react";

export interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  wrapperClassName?: string;
}

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className = "", wrapperClassName = "", children, ...props }, ref) => {
    return (
      <div className={`w-full overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.02)] ${wrapperClassName}`}>
        <table
          ref={ref}
          className={`w-full border-collapse text-left text-xs ${className}`}
          {...props}
        >
          {children}
        </table>
      </div>
    );
  }
);
Table.displayName = "Table";

export const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className = "", children, ...props }, ref) => (
    <thead ref={ref} className={`bg-slate-50/70 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider ${className}`} {...props}>
      {children}
    </thead>
  )
);
TableHeader.displayName = "TableHeader";

export const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className = "", children, ...props }, ref) => (
    <tbody ref={ref} className={`divide-y divide-slate-100 ${className}`} {...props}>
      {children}
    </tbody>
  )
);
TableBody.displayName = "TableBody";

export const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className = "", children, ...props }, ref) => (
    <tr
      ref={ref}
      className={`transition-colors hover:bg-slate-50/60 ${className}`}
      {...props}
    >
      {children}
    </tr>
  )
);
TableRow.displayName = "TableRow";

export const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className = "", children, ...props }, ref) => (
    <th
      ref={ref}
      className={`px-5 py-3.5 font-bold align-middle select-none ${className}`}
      {...props}
    >
      {children}
    </th>
  )
);
TableHead.displayName = "TableHead";

export const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className = "", children, ...props }, ref) => (
    <td
      ref={ref}
      className={`px-5 py-4 align-middle text-slate-600 ${className}`}
      {...props}
    >
      {children}
    </td>
  )
);
TableCell.displayName = "TableCell";
