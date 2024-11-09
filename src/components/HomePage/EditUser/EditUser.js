import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Autocomplete from '@mui/material/Autocomplete';

import Password from "../../Password/Password";
import { addUser, getUsers, editUsername, editPassword } from '../../../api';
import { refreshPage } from "../../../utils";

let existingUsers = [];

export default function EditUser({ open, setOpen, action }) {
  const [editUnameChecked, setUnameChecked] = React.useState(true);
  const [editPassChecked, setPassChecked] = React.useState(false);

  const handleUnameChecked = (event) => {
    setUnameChecked(event.target.checked);
    setPassChecked(!event.target.checked);
  }

  const handlePassChecked = (event) => {
    setPassChecked(event.target.checked);
    setUnameChecked(!event.target.checked);
  }

  const isActionAdd = () => {
    return action === "add";
  }

  const handleClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    if (localStorage.getItem("username") === "admin") {
      getUsers().then((users) => {existingUsers = users});
    }
  });

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();

            handleClose();
	    if (isActionAdd()) {
              const formData = new FormData(event.currentTarget);
              const user = Object.fromEntries(formData.entries());

              addUser(user.new_name, user.password).then(() => {});
	    } else {
	      if (editUnameChecked) {
                const old_user = event.target[2].value;
                const new_user = event.target[6].value;

	        editUsername(old_user, new_user).then(() => {refreshPage()});
	      } else if (editPassChecked) {
                const user = event.target[2].value;
                const password = event.target[6].value;

	        editPassword(user, password).then(() => {});
	      }
	    }
          },
        }}
      >
	{isActionAdd() ?
	  <DialogTitle>Add User</DialogTitle>
	  :
	  <DialogTitle>Edit User Data</DialogTitle>
	}
        <DialogContent>
	  <Box sx={{ p: 1 }}>
	  {isActionAdd() ?
            <DialogContentText>
	      To add a user, please enter a new username and assigned password.
            </DialogContentText>
	    :
            <DialogContentText>
	      To edit user data, please select component to edit and enter values.
            </DialogContentText>
	  }
	  </Box>
	  {!isActionAdd() ?
	    <FormGroup>
              <FormControlLabel
	        control={
		  <Checkbox
		    checked={editUnameChecked}
                    onChange={handleUnameChecked}
		  />
		}
	      label="Edit Username"
	      />
              <FormControlLabel
	        control={
		  <Checkbox
	            checked={editPassChecked}
                    onChange={handlePassChecked}
		  />
		}
		label="Edit Password"
	      />
            </FormGroup>
	    :
	    <span/>
	  }
          <Autocomplete
            fullWidth
            margin="normal"
            options={existingUsers}
            renderInput={(params) =>
	      <TextField
	        {...params}
                id="name"
                label={editUnameChecked ? "Old User Name" : "User Name"}
              />
	  }/>
          {(!isActionAdd() && editUnameChecked) ?
            <TextField
              margin="normal"
              required
              fullWidth
              id="new_name"
              label="User Name"
              name="name"
              autoFocus
              inputProps={{
                autoComplete: "new-password"
              }}
            />
	    :
	    <span/>
	  }
	  {(isActionAdd() || editPassChecked) ?
	    <Password
              label="password"
	      autoComplete="new-password"
            />
	    :
	    <span/>
	  }
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>CANCEL</Button>
	  {isActionAdd() ? <Button type="submit">ADD</Button> : <Button type="submit">EDIT</Button>}
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

