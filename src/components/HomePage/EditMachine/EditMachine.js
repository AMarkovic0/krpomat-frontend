import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { editMachine } from '../../../api';
import { refreshPage } from '../../../utils';

export default function AddMachine({ open, setOpen }) {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
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
            editMachine(machine.id, machine.name).then((err) => {
              refreshPage();
            });
          },
        }}
      >
        <DialogTitle>Edit Machine Name</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To edit machine name, please enter exiting machine ID and a new name.
          </DialogContentText>
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
          <Button type="submit">EDIT</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

