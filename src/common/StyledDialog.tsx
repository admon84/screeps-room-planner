import * as Mui from '@mui/material';

const StyledDialog = Mui.styled(Mui.Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1, 2),
  },
}));

export default StyledDialog;
