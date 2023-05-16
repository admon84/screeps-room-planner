import * as Mui from '@mui/material';
import { useStructurePositions } from '../contexts/StructurePositionsContext';
import { useSettings } from '../contexts/SettingsContext';

import HighlightCode from './HighlightCode';

export default function BottomDrawer() {
  const { settings, toggleCodeDrawer } = useSettings();
  const { codeDrawerOpen, rcl } = settings;
  const { structurePositions } = useStructurePositions();

  return (
    <Mui.Drawer
      anchor='bottom'
      open={codeDrawerOpen}
      onClose={toggleCodeDrawer}
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
              structures: structurePositions,
            })}
          </HighlightCode>
        </Mui.CardContent>
      </Mui.Card>
    </Mui.Drawer>
  );
}
