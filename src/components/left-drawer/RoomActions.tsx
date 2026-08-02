import * as Mui from '@mui/material';
import ImportRoom from '../actions/ImportRoom';
import EditRoomJson from '../actions/EditRoomJson';
import ResetRoom from '../actions/ResetRoom';

export default function RoomActions() {
  return (
    <Mui.Stack direction='column' spacing={1}>
      <ImportRoom />
      <EditRoomJson />
      <ResetRoom />
    </Mui.Stack>
  );
}
