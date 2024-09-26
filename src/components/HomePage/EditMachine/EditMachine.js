import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { MuiTelInput } from 'mui-tel-input';

import { editMachine } from '../../../api';
import { refreshPage } from '../../../utils';

export default function EditMachine({ open, setOpen, machineData }) {
  const [phone, setPhone] = React.useState(machineData && machineData.phone_number || "")

  React.useEffect(() => {
    setPhone(machineData && machineData.phone_number || "")
  }, [open]);

  const handleClose = () => {
    setOpen(false);
  };

  const onPhoneChanged = (newPhone) => {
    setPhone(newPhone.replace(/\s/g, ''));
  }

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
            editMachine(
              machineData.machine_id,
              machine.name,
              machine.numOfProd,
              phone
            ).then((err) => {
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
            defaultValue={machineData && machineData.machine_name || ""}
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="numOfProd"
            name="numOfProd"
            label="Number of products"
            type="number"
            fullWidth
            variant="standard"
            InputProps={{
               inputProps: { min: 1 }
            }}
            defaultValue={machineData && machineData.num_of_prod || 3}
            onKeyPress={(event) => {
              if (event?.key === '-' || event?.key === '+') {
                event.preventDefault();
              }
            }}
          />
          <Box component="section" sx={{ mt: 2 }}>
            <MuiTelInput
              label="Phone Number"
              forceCallingCode
              defaultCountry="RS"
              continents={['EU']}
              value={phone}
              onChange={onPhoneChanged}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>CANCEL</Button>
          <Button type="submit">EDIT</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

