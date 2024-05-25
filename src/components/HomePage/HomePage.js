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

import { useNavigate } from "react-router-dom";

import SalesByMachine from "./Sales/SalesByMachine";
import Sales from "./Sales/Sales";
import LinearIndeterminate from "./LoadBar/LoadBar";
import DateSelector from "./DateSelector/DateSelector";
import AddMachine from "./AddMachine/AddMachine";

import { getSales } from '../../api';
import { TOKEN, refreshPage } from "../../utils";

const drawerWidth = 240;
const navItems = ['SALES', 'ADD MACHINE', 'LOG OUT'];

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
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [displayItem, setDisplayItem] = React.useState("SALES");
  const [sales, setSales] = React.useState([]);
  const [startDate, setStartDate] = React.useState("01.01.1980.");
  const [endDate, setEndDate] = React.useState(getDate());
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleOnItemClick = (item) => {
    if (item === "LOG OUT") {
      localStorage.setItem("isAuth", false);
      localStorage.setItem("username", "");
      props.setAuthenticated(false);

      refreshPage();

      //navigate("/login");
    } else {
      setDialogOpen(item === "ADD MACHINE");
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
      machine_id : 3
    }).then((resp) => {
      setSales(resp);
    })
  }, []);

  function getSalesData() {
    getSales({
      start_date : toDotDateFormat(startDate),
      end_date : toDotDateFormat(endDate),
      machine_id : 3
    }).then((resp) => {
      setSales(resp)
    });
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
          {displayItem === "SALES" || displayItem === "ADD MACHINE" ?
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
                </Grid>
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2} alignItems="top" columns={16}>
                  <Grid item xs={8}>
                    {sales ? <SalesByMachine sales={sales}/> : <LinearIndeterminate/>}
                  </Grid>
                  <Grid item marginLeft="auto" xs={8}>
                    {sales ? <Sales sales={sales}/> : <LinearIndeterminate/>}
                  </Grid>
                </Grid>
              </Box>
            </div>
            :
            <span/>}
          <AddMachine open={dialogOpen} setOpen={setDialogOpen}/>
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

