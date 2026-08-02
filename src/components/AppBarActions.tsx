import * as Mui from '@mui/material';
import ImportRoom from './actions/ImportRoom';
import EditRoomJson from './actions/EditRoomJson';
import ResetRoom from './actions/ResetRoom';

/** Room-wide commands, placed next to the wordmark so they read as primary actions. */
export default function AppBarActions() {
  return (
    <Mui.Box sx={{ alignItems: 'center', display: 'flex', gap: 0.5, ml: { xs: 0.5, sm: 2 } }}>
      <ImportRoom />
      <EditRoomJson />
      <ResetRoom />
    </Mui.Box>
  );
}
