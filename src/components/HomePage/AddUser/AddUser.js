import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import Password from "../../Password/Password";
import { addUser } from '../../../api';

export default function AddUser({ open, setOpen }) {

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
            const user = Object.fromEntries(formData.entries());

            handleClose();
            addUser(user.name, user.password).then(() => {});
          },
        }}
      >
        <DialogTitle>Edit Machine Name</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To edit machine name, please enter exiting machine ID and a new name.
          </DialogContentText>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="User Name"
            name="name"
            autoFocus
            inputProps={{
              autoComplete: "new-password"
            }}
          />
          <Password
            label="password"
            autoComplete="new-password"
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

