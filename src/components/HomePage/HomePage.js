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

import { SalesByMachine, displayProduct } from "./Sales/SalesByMachine";
import Sales from "./Sales/Sales";
import LinearIndeterminate from "./LoadBar/LoadBar";
import DateSelector from "./DateSelector/DateSelector";
import AddMachine from "./AddMachine/AddMachine";
import EditMachine from "./EditMachine/EditMachine";
import EditUser from "./EditUser/EditUser";

import { getSales } from '../../api';
import { refreshPage } from "../../utils";

const drawerWidth = 240;

function DrawerAppBar(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [displayItem, setDisplayItem] = React.useState("SALES");
  const [sales, setSales] = React.useState([]);
  const [showByMachine, setShowByMachine] = React.useState(true);
  const [showRecord, setShowRecord] = React.useState(false);

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialogOpenEdit, setDialogOpenEdit] = React.useState(false);
  const [dialogOpenUsr, setDialogOpenUsr] = React.useState(false);
  const [machineData, setSettingsMachineData] = React.useState();

  const navItems = (localStorage.getItem("username") === "admin") ?
    [ 'ADD USER', 'EDIT USER','ADD MACHINE', 'LOG OUT'] :
    [ 'ADD MACHINE', 'LOG OUT'];

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
      setDialogOpenUsr(item === "ADD USER" || item === "EDIT USER");
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

  const processForCSV = (sales) => {
    sales.map((sale) => {
      sale.p1 = displayProduct(sale.p1, sale.num_of_prod, 0);
      sale.p2 = displayProduct(sale.p2, sale.num_of_prod, 1);
      sale.p3 = displayProduct(sale.p3, sale.num_of_prod, 2);
      sale.p4 = displayProduct(sale.p4, sale.num_of_prod, 3);
      sale.p5 = displayProduct(sale.p5, sale.num_of_prod, 4);
    });

    return sales;
  };

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
          {displayItem === "SALES" ||
	   displayItem === "ADD MACHINE" ||
	   displayItem === "ADD USER" ||
	   displayItem === "EDIT USER" ?
            <div>
              <Box sx={{ p: 3 }}>
                <Grid container justify="center"  direction="row" spacing={3} alignItems="center">
		  <Grid item>
		    <DateSelector setData={setSales} getData={getSales}/>
		  </Grid>
                  <Grid item>
                    <CSVLink
                      data={processForCSV(sales)}
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
                    {sales ?
                      <SalesByMachine
                        sales={sales}
                        openSettings={setDialogOpenEdit}
                        setSettingsMachineData={setSettingsMachineData}
                      /> : <LinearIndeterminate/>
                    }
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
          <EditMachine
            open={dialogOpenEdit}
            setOpen={setDialogOpenEdit}
            machineData={machineData}
          />
          <EditUser
	    open={dialogOpenUsr}
	    setOpen={setDialogOpenUsr}
	    action={displayItem === "ADD USER" ? "add" : "edit"}
	  />
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

