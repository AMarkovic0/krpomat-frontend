import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import { getSales, getMachines } from '../../../api';

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.machine_name}
        </TableCell>
        <TableCell align="right">{row.machine_id}</TableCell>
        <TableCell align="right">{row.p1}</TableCell>
        <TableCell align="right">{row.p2}</TableCell>
        <TableCell align="right">{row.p3}</TableCell>
        <TableCell align="right">{row.sale_date}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                History
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell align="right">Product 1</TableCell>
                    <TableCell align="right">Product 2</TableCell>
                    <TableCell align="right">Product 3</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.history ? row.history.map((historyRow) => (
                    <TableRow key={historyRow.sale_date}>
                      <TableCell component="th" scope="row">
                        {historyRow.sale_date}
                      </TableCell>
                      <TableCell align="right">{historyRow.p1}</TableCell>
                      <TableCell align="right">{historyRow.p2}</TableCell>
                      <TableCell align="right">{historyRow.p3}</TableCell>
                    </TableRow>
                  )) : <TableRow key="1"/>}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    machine_name: PropTypes.string.isRequired,
    machine_id: PropTypes.number.isRequired,
    p1: PropTypes.number.isRequired,
    p2: PropTypes.number.isRequired,
    p3: PropTypes.number.isRequired,
    sale_date: PropTypes.string.isRequired,
    history: PropTypes.arrayOf(
      PropTypes.shape({
        p1: PropTypes.number.isRequired,
        p2: PropTypes.number.isRequired,
        p3: PropTypes.number.isRequired,
        sale_date: PropTypes.string.isRequired,
      }),
    ),
  }).isRequired,
};

function addHistoryToMachine(machines, sale) {
  let arrayLength = machines.length;

  for (var i = 0; i < arrayLength; i++) {
      if (machines[i].machine_name === sale.machine_name) {
        if ( machines[i].history === undefined ) {
          machines[i].history = [];
        }

        machines[i].history.push({
          p1: sale.p1,
          p2: sale.p2,
          p3: sale.p3,
          sale_date: sale.sale_date
        });
      }
  }

  return machines;
}

export default function SalesByMachine({ sales }) {
  const [gMachines, setMachines] = React.useState([]);

  React.useEffect(() => {
    getMachines().then((machines) => {
      sales.forEach((sale) => {
        machines = addHistoryToMachine(machines, sale);
      });

      setMachines(machines);
    })
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Machine Name</TableCell>
            <TableCell align="right">Machine ID</TableCell>
            <TableCell align="right">Product 1</TableCell>
            <TableCell align="right">Product 2</TableCell>
            <TableCell align="right">Product 3</TableCell>
            <TableCell align="right">Last Time Online</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {gMachines.map((row) => (
            <Row key={row.machine_id} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
