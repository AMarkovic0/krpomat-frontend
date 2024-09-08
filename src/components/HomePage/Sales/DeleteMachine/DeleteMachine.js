import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import IconButton from '@mui/material/IconButton';

import { deleteMachine } from '../../../../api';
import { refreshPage } from '../../../../utils';

export function DeleteMachine(props) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleDelete = () => {
    deleteMachine(props.machine_id).then((err) => {
      refreshPage();
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <IconButton
        aria-label="DeleteMachine"
        onClick={handleClickOpen}
      >
        <DeleteRoundedIcon color="primary"/>
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="delete-machine-dialog"
        aria-describedby="confirms-you-want-to-delete-machine"
      >
        <DialogTitle id="delete-machine-alter-dialog">
          {"Delete Machine"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-delete-machine">
            You are about to delete machine. Please confirm to
            continue.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleDelete} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
