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
import PublicIcon from '@mui/icons-material/Public';
import PublicOffIcon from '@mui/icons-material/PublicOff';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import SettingsIcon from '@mui/icons-material/Settings';

import { DeleteMachine } from './DeleteMachine/DeleteMachine';
import { getMachines } from '../../../api';
import { refreshPage, dateToIso } from '../../../utils';

const MIN3 = 3*60000;
const loadDateTime = (new Date()).getTime();

function checkOnline(date) {
  return loadDateTime > (new Date(dateToIso(date)).getTime() + MIN3);
}

export function displayProduct(prod, num_of_prod, max_num_of_prod) {
  return (prod === null || num_of_prod <= max_num_of_prod) ? "N/A" : prod;
}

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  const getSwitchTimeToDisplay = (row) => {
    return checkOnline(row.sale_date) ?
      row.sale_date : row.online_status_changed;
  };

  const arrowOpen = (open) => {
    setOpen(open);
  };

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => arrowOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="center">{row.machine_id}</TableCell>
        <TableCell component="th" scope="row" align="center">
          <IconButton
            aria-label="expand row"
            size="small"
          >
            {checkOnline(row.sale_date) ?
            <PublicOffIcon/> : <PublicIcon color="primary"/>}
          </IconButton>
        </TableCell>
        {localStorage.getItem("username") === "admin" ?
          <TableCell align="left">{row.username}</TableCell> :
          <p/>
        }
        <TableCell component="th" scope="row">
          {row.machine_name}
        </TableCell>
        <TableCell align="right">
          {displayProduct(row.p1, row.num_of_prod, 0)}
        </TableCell>
        <TableCell align="right">
          {displayProduct(row.p2, row.num_of_prod, 1)}
        </TableCell>
        <TableCell align="right">
          {displayProduct(row.p3, row.num_of_prod, 2)}
        </TableCell>
        <TableCell align="right">
          {displayProduct(row.p4, row.num_of_prod, 3)}
        </TableCell>
        <TableCell align="right">
          {displayProduct(row.p5, row.num_of_prod, 4)}
        </TableCell>
        <TableCell align="right">{(row.online_status_changed === "01.01.1970 00:00:00" ||
                                   row.online_status_changed === "") ?
          "Waiting for data..." : getSwitchTimeToDisplay(row)}</TableCell>
        <TableCell align="right">
          <IconButton
            onClick={(e) => {
              props.openSettings(true);
              props.setSettingsMachineData(row);
            }}
          >
            <SettingsIcon color="primary"/>
          </IconButton>
        </TableCell>
        {localStorage.getItem("username") === "admin" ?
          <TableCell>
            <DeleteMachine machine_id={row.machine_id}/>
          </TableCell> :
          <p/>
        }
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
                      <TableCell align="right">
                        {displayProduct(historyRow.p1, row.num_of_prod, 0)}
                      </TableCell>
                      <TableCell align="right">
                        {displayProduct(historyRow.p2, row.num_of_prod, 1)}
                      </TableCell>
                      <TableCell align="right">
                        {displayProduct(historyRow.p3, row.num_of_prod, 2)}
                      </TableCell>
                      <TableCell align="right">
                        {displayProduct(historyRow.p4, row.num_of_prod, 3)}
                      </TableCell>
                      <TableCell align="right">
                        {displayProduct(historyRow.p5, row.num_of_prod, 4)}
                      </TableCell>
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
    num_of_prod: PropTypes.number.isRequired,
    history: PropTypes.arrayOf(
      PropTypes.shape({
        p1: PropTypes.PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        p2: PropTypes.PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        p3: PropTypes.PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        p4: PropTypes.PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        p5: PropTypes.PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
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

export function SalesByMachine({ sales, openSettings, setSettingsMachineData }) {
  const [machines, setMachines] = React.useState([]);
  const [filterEmpty, setFilterEmpty] = React.useState(false);
  const [filterOnline, setFilterOnline] = React.useState(false);

  React.useEffect(() => {
    const filterNoProduct = (machine) => {
      return (filterEmpty &&
        !((machine.p1 === 0 || machine.p2 === 0 || machine.p3 === 0 ||
        (machine.p4 != null && machine.p4 === 0) ||
        (machine.p5 != null && machine.p5 === 0)) &&
        !checkOnline(machine.sale_date)));
    };

    const onlineFilter = (machine) => {
        return (filterOnline && !checkOnline(machine.sale_date));
    }

    getMachines().then((machines) => {
      sales.forEach((sale) => {
        machines = addHistoryToMachine(machines, sale);
      });

      let tmp_machines = [];
      let new_machines = [];

      for (var j in machines) {
        if (filterNoProduct(machines[j])) {continue;}
        tmp_machines.push(machines[j]);
      }

      for (var i in tmp_machines) {
        if (onlineFilter(tmp_machines[i])) {continue;}
        new_machines.push(tmp_machines[i]);
      }

      setMachines(new_machines);
    })
  }, [sales, filterEmpty, filterOnline]);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell align="center" colSpan={2}>
              <FormControlLabel
                control={<Switch onChange={(event) => {setFilterOnline(event.target.checked)}}/>} label="Show Offline"
              />
            </TableCell>
            <TableCell align="center" colSpan={3}>
              <FormControlLabel
                control={<Switch onChange={(event) => {setFilterEmpty(event.target.checked)}}/>} label="Show Empty"
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell/>
            <TableCell align="left">Machine ID</TableCell>
            <TableCell>Online Status</TableCell>
            {localStorage.getItem("username") === "admin" ?
              <TableCell align="left">User Name</TableCell> :
              <p/>
            }
            <TableCell>Machine Name</TableCell>
            <TableCell align="right">Product 1</TableCell>
            <TableCell align="right">Product 2</TableCell>
            <TableCell align="right">Product 3</TableCell>
            <TableCell align="right">Product 4</TableCell>
            <TableCell align="right">Product 5</TableCell>
            <TableCell align="right">Last Online State Switch</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {machines.map((row) => (
            <Row
              key={row.machine_id}
              row={row}
              openSettings={openSettings}
              setSettingsMachineData={setSettingsMachineData}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
