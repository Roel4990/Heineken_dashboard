"use client";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { BRAND } from "@/lib/colors";

interface Column {
  key: string;
  label: string;
  isHighlight?: boolean;
}

type Row = Record<string, string>;

interface Props {
  columns: Column[];
  rows: Row[];
}

export default function DataTable({ columns, rows }: Props) {
  return (
    <Box sx={{ mt: "8px" }}>
      <TableContainer sx={{ maxHeight: 320, overflow: "auto" }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align="left">월</TableCell>
              {columns.map((col) => (
                <TableCell
                  key={col.key}
                  align="right"
                  sx={col.isHighlight ? { color: `${BRAND.g1} !important`, fontWeight: 700 } : undefined}
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.month} hover>
                <TableCell align="left">{row.month}</TableCell>
                {columns.map((col) => (
                  <TableCell
                    key={col.key}
                    align="right"
                    sx={col.isHighlight ? { fontWeight: 700, color: BRAND.g1 } : undefined}
                  >
                    {row[col.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
