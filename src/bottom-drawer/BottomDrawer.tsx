import * as Mui from '@mui/material';
import { useRoomStructures } from '../contexts/RoomStructuresContext';
import { useSettings } from '../contexts/SettingsContext';

import HighlightCode from './HighlightCode';

export default function BottomDrawer() {
  const { settings, updateSettings } = useSettings();
  const { codeDrawerOpen, rcl } = settings;
  const { roomStructures } = useRoomStructures();

  return (
    <Mui.Drawer
      anchor='bottom'
      open={codeDrawerOpen}
      onClose={() => updateSettings({ type: 'open_code_drawer' })}
      sx={{
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          boxSizing: 'border-box',
        },
      }}
    >
      <Mui.Card sx={{ borderRadius: 0, maxHeight: '50vh', overflowY: 'auto' }}>
        <Mui.CardContent>
          <HighlightCode>
            {JSON.stringify({
              rcl,
              structures: roomStructures,
            })}
          </HighlightCode>
        </Mui.CardContent>
      </Mui.Card>
    </Mui.Drawer>
  );
}
