import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

import { CSVLink } from 'react-csv';

import SalesByMachine from "./Sales/SalesByMachine";
import Sales from "./Sales/Sales";
import LinearIndeterminate from "./LoadBar/LoadBar";
import DateSelector from "./DateSelector/DateSelector";
import AddMachine from "./AddMachine/AddMachine";
import EditMachine from "./EditMachine/EditMachine";
import DeleteMachine from "./DeleteMachine/DeleteMachine";
import AddUser from "./AddUser/AddUser";

import { getSales } from '../../api';
import { refreshPage } from "../../utils";

const drawerWidth = 240;

function getDate() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  return `${date}.${month}.${year}.`;
}

function toDotDateFormat(date) {
  if(typeof date === 'string' || date instanceof String) {
    return date
  }

  return date.format("DD.MM.YYYY.");
}

function DrawerAppBar(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [displayItem, setDisplayItem] = React.useState("SALES");
  const [sales, setSales] = React.useState([]);
  const [startDate, setStartDate] = React.useState("01.01.1980.");
  const [endDate, setEndDate] = React.useState(getDate());
  const [showByMachine, setShowByMachine] = React.useState(true);
  const [showRecord, setShowRecord] = React.useState(false);

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialogOpenEdit, setDialogOpenEdit] = React.useState(false);
  const [dialogOpenDel, setDialogOpenDel] = React.useState(false);
  const [dialogOpenUsr, setDialogOpenUsr] = React.useState(false);

  const navItems = (localStorage.getItem("username") === "admin") ?
    [ 'ADD USER', 'SALES', 'ADD MACHINE', 'EDIT MACHINE', 'DELETE MACHINE', 'LOG OUT'] :
    [ 'SALES', 'ADD MACHINE', 'EDIT MACHINE', 'LOG OUT'];

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleOnItemClick = (item) => {
    if (item === "LOG OUT") {
      localStorage.setItem("isAuth", false);
      localStorage.setItem("username", "");
      props.setAuthenticated(false);

      refreshPage();
    } else {
      setDialogOpen(item === "ADD MACHINE");
      setDialogOpenEdit(item === "EDIT MACHINE");
      setDialogOpenDel(item === "DELETE MACHINE");
      setDialogOpenUsr(item === "ADD USER");
      setDisplayItem(item);
    }
  }

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{
          my: 2,
          fontFamily: 'monospace',
          fontWeight: 700,
          letterSpacing: '.3rem',
          color: 'inherit',
          textDecoration: 'none'
      }}>
        KRPOMAT
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton sx={{ textAlign: 'center' }}>
              <ListItemText primary={item} onClick={() => { handleOnItemClick(item) }}/>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  React.useEffect(() => {
    getSales({
      start_date : toDotDateFormat(startDate),
      end_date : toDotDateFormat(endDate),
    }).then((resp) => {
      setSales(resp);
    })
  });

  function getSalesData() {
    getSales({
      start_date : toDotDateFormat(startDate),
      end_date : toDotDateFormat(endDate),
    }).then((resp) => {
      setSales(resp)
    });
  }

  function filterCSVData(full_sales) {
    let machines = [];

    if (localStorage.getItem("username") !== "admin") {
      for (var i in full_sales) {
        if (full_sales[i].username === localStorage.getItem("username")) {
          machines.push(full_sales[i]);
        }
      }
    } else {
      machines = sales;
    }

    return machines;
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            KRPOMAT
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {navItems.map((item) => (
              <Button key={item} sx={{ color: '#fff' }} onClick={() => {
                  handleOnItemClick(item)
              }}>
                {item}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
      <Box component="main" sx={{ p: 3 }}>
        <Toolbar />
        <Box>
          {displayItem === "SALES" || displayItem === "ADD MACHINE" ||
           displayItem === "EDIT MACHINE" || displayItem === "DELETE MACHINE" ||
           displayItem === "ADD USER" ?
            <div>
              <Box sx={{ p: 3 }}>
                <Grid container justify="center"  direction="row" spacing={3} alignItems="center">
                  <Grid item>
                    <DateSelector name="Start Date" onSet={setStartDate}/>
                  </Grid>
                  <Grid item>
                    <DateSelector name="End Date" onSet={setEndDate}/>
                  </Grid>
                  <Grid item>
                    <Button variant="contained" onClick={getSalesData}>CONFIRM</Button>
                  </Grid>
                  <Grid item>
                    <CSVLink
                      data={filterCSVData(sales)}
                      filename={
                        "krpomat-sales-" + (new Date()).toISOString().split('T')[0] + ".csv"
                      }
                      target="_blank"
                    >
                      <Button variant="contained" endIcon={<FileDownloadIcon/>}>
                        DOWNLOAD CSV
                      </Button>
                    </CSVLink>
                  </Grid>
                  <Grid item>
                    <Grid container justify="center"  direction="row" spacing={3} alignItems="center">
                      <Grid item>
                        <FormControlLabel
                          control={<Checkbox defaultChecked/>}
                          label="By Machine"
                          onChange={(event) => {setShowByMachine(event.target.checked)}}
                        />
                      </Grid>
                      <Grid item>
                        <FormControlLabel
                          control={<Checkbox/>}
                          label="Full Record"
                          onChange={(event) => {setShowRecord(event.target.checked)}}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2} alignItems="top" columns={16}>
                  {showByMachine ? <Grid item xs={showRecord ? 8 : 16}>
                    {sales ? <SalesByMachine sales={sales}/> : <LinearIndeterminate/>}
                  </Grid> : <span/>}
                  {showRecord ? <Grid item marginLeft="auto" xs={showByMachine ? 8 : 16}>
                    {sales ? <Sales sales={sales}/> : <LinearIndeterminate/>}
                  </Grid> : <span/>}
                </Grid>
              </Box>
            </div>
            :
            <span/>}
          <AddMachine open={dialogOpen} setOpen={setDialogOpen}/>
          <EditMachine open={dialogOpenEdit} setOpen={setDialogOpenEdit}/>
          <AddUser open={dialogOpenUsr} setOpen={setDialogOpenUsr}/>
          {(localStorage.getItem("username") === "admin") &&
            <DeleteMachine open={dialogOpenDel} setOpen={setDialogOpenDel}/>}
          {displayItem === "LOG OUT" ? <span>LOG OUT</span> : <span/>}
        </Box>
      </Box>
    </Box>
  );
}

DrawerAppBar.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default DrawerAppBar;

