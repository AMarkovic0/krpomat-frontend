import * as React from 'react';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';

export default function MachineAddAlert({ msg, severity, open, resetAlert }) {
  React.useEffect(() => {
  }, [open]);

  return (
    <Collapse in={open}>
      <Alert
        icon={<CheckIcon fontSize="inherit" />}
        severity={severity}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={() => {
              resetAlert();
            }}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
      >
        {msg}
      </Alert>
    </Collapse>
  );
}
