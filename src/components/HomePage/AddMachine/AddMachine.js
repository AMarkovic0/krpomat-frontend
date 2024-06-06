import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { addMachine } from '../../../api';
import MachineAddAlert from './Popup/Popup';
import { refreshPage } from '../../../utils';

export default function AddMachine({ open, setOpen }) {
  const [idErr, setIdError] = React.useState(false);
  const [openAlert, setOpenAlert] = React.useState(false);

  const resetAlert = () => {
    setOpenAlert(false);
    setIdError(false);
  }

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <MachineAddAlert
        msg={(idErr
          && "Machine Add failed - ID already exists")
          || "Successfully added a new machine"
        }
        severity={(idErr && "error") || "success"}
        open={openAlert}
        resetAlert={resetAlert}
      />
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const machine = Object.fromEntries(formData.entries());

            handleClose();
            addMachine(machine.id, machine.name, machine.user).then((err) => {
              if (typeof err.response === 'undefined') {
                setIdError(false);
              } else {
                if (err.response.status === 500) {
                  setIdError(true);
                }
              }

              setOpenAlert(true);
              refreshPage();
            });
          },
        }}
      >
        <DialogTitle>Add New Machine</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To add a new machine, please enter machine ID and name here.
            If successful, your machine will appear in the analityc section (tables).
          </DialogContentText>
          {localStorage.getItem("username") === "admin" ?
            <TextField
              autoFocus
              required
              margin="dense"
              id="user"
              name="user"
              label="User Name"
              type="text"
              fullWidth
              variant="standard"
            /> : <span/>
          }
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="name"
            label="Machine Name"
            type="text"
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="id"
            name="id"
            label="Machine ID"
            type="number"
            fullWidth
            variant="standard"
            onKeyPress={(event) => {
              if (event?.key === '-' || event?.key === '+') {
                event.preventDefault();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>CANCEL</Button>
          <Button type="submit">ADD</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

