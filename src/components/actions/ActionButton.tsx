import * as React from 'react';
import * as Mui from '@mui/material';

type Props = {
  buttonText: string;
  dialogMessage: string;
  dialogTitle?: string;
  cancelText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  onClick?: () => void;
};

export default function ActionButton({
  buttonText,
  dialogTitle = 'Confirmation',
  dialogMessage,
  cancelText = 'Cancel',
  startIcon,
  endIcon,
  onClick,
}: Props) {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Mui.Button variant='outlined' onClick={handleOpen} startIcon={startIcon} endIcon={endIcon}>
        {buttonText}
      </Mui.Button>
      <Mui.Dialog open={open} keepMounted onClose={handleClose}>
        <Mui.DialogTitle>{dialogTitle}</Mui.DialogTitle>
        <Mui.DialogContent>
          <Mui.DialogContentText>{dialogMessage}</Mui.DialogContentText>
        </Mui.DialogContent>
        <Mui.DialogActions>
          <Mui.Button onClick={handleClose}>{cancelText}</Mui.Button>
          <Mui.Button
            onClick={() => {
              handleClose();
              onClick?.();
            }}
            variant='outlined'
            startIcon={startIcon}
            endIcon={endIcon}
          >
            {buttonText}
          </Mui.Button>
        </Mui.DialogActions>
      </Mui.Dialog>
    </React.Fragment>
  );
}
