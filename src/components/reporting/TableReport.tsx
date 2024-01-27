import React from "react";
import { ReportOutputInterface, ReportResultInterface } from "../../interfaces";
import { Table, TableBody, TableRow, TableCell, TableHead } from "@mui/material";
import { ReportHelper } from "../../helpers/ReportHelper";

interface Props { reportResult: ReportResultInterface, output: ReportOutputInterface }

export const TableReport = (props: Props) => {

  const getHeaders = () => {
    const result: JSX.Element[] = []
    props.output.columns.forEach((c, i) => {
      result.push(<TableCell key={i} style={{fontWeight:"bold"}}>{c.header}</TableCell>);
    })
    return result;
  }

  const getRows = () => {
    const result: JSX.Element[] = []
    props.reportResult.table.forEach(d => {
      const row: JSX.Element[] = [];
      props.output.columns.forEach(c => {
        row.push(<TableCell>{ReportHelper.getField(c, d)}</TableCell>);
      })
      result.push(<TableRow>{row}</TableRow>);
    });
    return result;
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          {getHeaders()}
        </TableRow>
      </TableHead>
      <TableBody>
        {getRows()}
      </TableBody>
    </Table>
  );
}
