import * as Mui from '@mui/material';
import * as Icons from '@mui/icons-material';

export default function DialogTitle(props: Mui.DialogTitleProps & { onClose?: () => void }) {
  const { children, onClose, ...otherProps } = props;

  return (
    <Mui.DialogTitle sx={{ m: 0, p: 2 }} {...otherProps}>
      {children}
      {onClose ? (
        <Mui.IconButton
          aria-label='close'
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Icons.Close />
        </Mui.IconButton>
      ) : null}
    </Mui.DialogTitle>
  );
}
