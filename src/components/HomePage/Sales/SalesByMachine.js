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
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import PublicIcon from '@mui/icons-material/Public';
import PublicOffIcon from '@mui/icons-material/PublicOff';

import { getMachines } from '../../../api';
import { dateToIso } from '../../../utils';

const MIN30 = 30*60000;

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  const checkOnline = (date) => {
    return (new Date()).getTime() > (new Date(dateToIso(date)).getTime() + MIN30);
  }

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
        <TableCell component="th" scope="row" align="center">
          <IconButton
            aria-label="expand row"
            size="small"
          >
            {checkOnline(row.sale_date) ?
            <PublicOffIcon/> : <PublicIcon color="primary"/>}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.machine_name}
        </TableCell>
        <TableCell align="right">{row.machine_id}</TableCell>
        <TableCell align="right">{row.p1}</TableCell>
        <TableCell align="right">{row.p2}</TableCell>
        <TableCell align="right">{row.p3}</TableCell>
        <TableCell align="right">{row.p4 ? row.p4 : "N/A"}</TableCell>
        <TableCell align="right">{row.p5 ? row.p5 : "N/A"}</TableCell>
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
                    <TableCell align="right">Product 4</TableCell>
                    <TableCell align="right">Product 5</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.history ? row.history.map((historyRow) => (
                    <TableRow key={row.history.indexOf(historyRow)}>
                      <TableCell component="th" scope="row">
                        {historyRow.sale_date}
                      </TableCell>
                      <TableCell align="right">{historyRow.p1}</TableCell>
                      <TableCell align="right">{historyRow.p2}</TableCell>
                      <TableCell align="right">{historyRow.p3}</TableCell>
                      <TableCell align="right">{historyRow.p4 ? historyRow.p4 : "N/A"}</TableCell>
                      <TableCell align="right">{historyRow.p5 ? historyRow.p5 : "N/A"}</TableCell>
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
    p4: PropTypes.number,
    p5: PropTypes.number,
    sale_date: PropTypes.string.isRequired,
    history: PropTypes.arrayOf(
      PropTypes.shape({
        p1: PropTypes.number.isRequired,
        p2: PropTypes.number.isRequired,
        p3: PropTypes.number.isRequired,
        p4: PropTypes.number,
        p5: PropTypes.number,
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
          p4: sale.p4,
          p5: sale.p5,
          sale_date: sale.sale_date
        });
      }
  }

  return machines;
}

export default function SalesByMachine({ sales }) {
  const [machines, setMachines] = React.useState([]);
  const [filterActive, setFilterActive] = React.useState(false);

  React.useEffect(() => {
    const filterNoProduct = (machine) => {
      return (filterActive &&
        !(machine.p1 === 0 || machine.p2 === 0 || machine.p3 === 0 ||
        (machine.p4 != null && machine.p4 === 0) ||
        (machine.p5 != null && machine.p5 === 0)));
    };

    getMachines().then((machines) => {
      sales.forEach((sale) => {
        machines = addHistoryToMachine(machines, sale);
      });

      if (localStorage.getItem("username") !== "admin") {
        let new_machines = [];

        for (var i in machines) {
          if (machines[i].username === localStorage.getItem("username")) {
            new_machines.push(machines[i]);
          }
        }

        machines = new_machines;
      }

      let new_machines = [];
      for (var j in machines) {
        if (filterNoProduct(machines[j])) {continue;}
        new_machines.push(machines[j]);
      }

      setMachines(new_machines);
    })
  }, [sales, filterActive]);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell>
              <IconButton
                aria-label="expand row"
                size="small"
                onClick={() => {
                  setFilterActive(!filterActive);
              }}>
                {filterActive ? <FilterAltOffIcon/> : <FilterAltIcon/>}
              </IconButton>
            </TableCell>
            <TableCell>Online Status</TableCell>
            <TableCell>Machine Name</TableCell>
            <TableCell align="right">Machine ID</TableCell>
            <TableCell align="right">Product 1</TableCell>
            <TableCell align="right">Product 2</TableCell>
            <TableCell align="right">Product 3</TableCell>
            <TableCell align="right">Product 4</TableCell>
            <TableCell align="right">Product 5</TableCell>
            <TableCell align="right">Last Time Online</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {machines.map((row) => (
            <Row key={row.machine_id} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
