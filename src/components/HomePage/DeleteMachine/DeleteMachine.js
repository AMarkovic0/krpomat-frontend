import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { deleteMachine } from '../../../api';
import { refreshPage } from '../../../utils';

export default function DeleteMachine({ open, setOpen }) {
  // eslint-disable-next-line
  const [idErr, setIdError] = React.useState(false);

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
            deleteMachine(machine.id).then((err) => {
              if (typeof err.response === 'undefined') {
                setIdError(false);
              } else {
                if (err.response.status === 500) {
                  setIdError(true);
                }
              }

              refreshPage();
            });
          },
        }}
      >
        <DialogTitle>Edit Machine Name</DialogTitle>
        <DialogContent>
          <DialogContentText
            type="text"
            fullWidth
            variant="standard"
          >
            To delete machine, please enter exiting machine ID.
          </DialogContentText>
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
          <Button type="submit">DELETE</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

