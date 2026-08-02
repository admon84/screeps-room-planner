import * as Mui from '@mui/material';
import { useNotificationStore } from '@/stores/useNotificationStore';

const AUTO_HIDE_MS = 3000;

export default function Notifications() {
  const notification = useNotificationStore((state) => state.notification);
  const dismiss = useNotificationStore((state) => state.dismiss);

  if (!notification) return null;

  return (
    <Mui.Snackbar
      key={notification.key}
      open
      autoHideDuration={AUTO_HIDE_MS}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      // Clickaway fires on every canvas paint stroke, which would dismiss a warning the moment it
      // appears.
      onClose={(_, reason) => reason !== 'clickaway' && dismiss()}
    >
      <Mui.Alert severity={notification.severity} variant='filled' onClose={dismiss}>
        {notification.message}
      </Mui.Alert>
    </Mui.Snackbar>
  );
}
