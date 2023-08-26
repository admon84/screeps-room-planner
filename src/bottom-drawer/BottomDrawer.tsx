import * as Mui from '@mui/material';
import { useStructurePositions } from '../state/StructurePositions';
import { useSettings } from '../state/Settings';
import { getPointFromString } from '../utils/helpers';
import HighlightCode from './HighlightCode';

export default function BottomDrawer() {
  const rcl = useSettings((state) => state.rcl);
  const codeDrawerOpen = useSettings((state) => state.codeDrawerOpen);
  const toggleCodeDrawer = useSettings((state) => state.toggleCodeDrawer);
  const structurePositions = useStructurePositions((state) => state.positions);

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
              structures: Object.fromEntries(
                Object.entries(structurePositions)
                  .map(([structure, positions]) => [structure, positions.map(getPointFromString)])
                  .filter(([_, positions]) => positions.length)
              ),
            })}
          </HighlightCode>
        </Mui.CardContent>
      </Mui.Card>
    </Mui.Drawer>
  );
}
