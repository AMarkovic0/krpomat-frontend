import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import FunctionsIcon from '@mui/icons-material/Functions';
import IconButton from '@mui/material/IconButton';

import { dateToIso } from '../../../utils';

const columns = [
  { id: 'machine_id', label: 'Machine ID', minWidth: 170 },
  { id: 'machine_name', label: 'Machine Name', minWidth: 100 },
  {
    id: 'p1',
    label: 'Product 1',
    minWidth: 170,
    align: 'right',
  },
  {
    id: 'p2',
    label: 'Product 2',
    minWidth: 170,
    align: 'right',
  },
  {
    id: 'p3',
    label: 'Product 3',
    minWidth: 170,
    align: 'right',
  },
  {
    id: 'p4',
    label: 'Product 4',
    minWidth: 170,
    align: 'right',
  },
  {
    id: 'p5',
    label: 'Product 5',
    minWidth: 170,
    align: 'right',
  },
  {
    id: 'sale_date',
    label: 'Date',
    minWidth: 170,
    align: 'right',
    format: (value) => value.toLocaleString('en-US'),
  },

];

export default function Sales({ sales }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [machines, setMachines] = React.useState([]);

  React.useEffect(() => {
    setMachines(sales);
  }, [sales]);


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  //const in24h = (date) => {
  //  return (new Date()).getTime() < ((new Date(dateToIso(date))).getTime() + 1440*60000);
  //};

  //const sumPtoday = (p) => {
  //  let sum = 0;

  //  for (var i in sales) {
  //      if (in24h(sales[i].sale_date)) {
  //        if (sales[i][p] === "N/A") {
  //          continue;
  //        }

  //        sum = sum + sales[i][p];
  //      }
  //  }

  //  return sum;
  //};

  const sumAll = (p) => {
    let sum = 0;

    for (var i in sales) {
      if (sales[i][p] === "N/A") {
        continue;
      }

      sum = sum + sales[i][p];
    }

    return sum;
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {machines.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={machines.indexOf(row)}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : ((value !== null) ? value : "N/A")}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <Table stickyHeader aria-label="sticky table footer">
        <TableCell/>
        <TableCell component="th" scope="row">
          <IconButton
            aria-label="expand row"
            size="small"
          >
            <FunctionsIcon/>
          </IconButton>
        </TableCell>
        <TableCell>{sumAll("p1")}</TableCell>
        <TableCell>{sumAll("p2")}</TableCell>
        <TableCell>{sumAll("p3")}</TableCell>
        <TableCell>{sumAll("p4")}</TableCell>
        <TableCell>{sumAll("p5")}</TableCell>
      </Table>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={machines.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
