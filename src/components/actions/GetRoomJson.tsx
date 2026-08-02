import * as Mui from '@mui/material';
import * as Icons from '@mui/icons-material';
import { useState } from 'react';
import { MINERAL } from '@/utils/constants';
import { getShortForTile, getTileForPoint } from '@/utils/helpers';
import { GameObject } from '@/utils/gameObjects';
import { useGameObjectStore } from '@/stores/useGameObjectsStore';
import { useSettings } from '@/stores/Settings';
import StyledDialog from '../dialog/StyledDialog';
import DialogTitle from '../dialog/DialogTitle';
import HighlightCode from '../highlight-code/HighlightCode';

/**
 * Key an object is exported under. Minerals export as their resource letter rather than `mineral`
 * so the value feeds straight back into `createObjectFromType` on import.
 */
const getExportKey = (object: GameObject) =>
  object.type === MINERAL ? (object as { mineralType?: string }).mineralType : object.type;

const getExportedStructures = (objects: GameObject[]) =>
  objects.reduce<Record<string, string[]>>((structures, object) => {
    const key = getExportKey(object);
    if (!key) return structures;

    if (!structures[key]) structures[key] = [];
    structures[key].push(getShortForTile(getTileForPoint(object)));
    return structures;
  }, {});

export default function GetRoomJson() {
  const { palette } = Mui.useTheme();

  const rcl = useSettings((state) => state.settings.rcl);
  const objects = useGameObjectStore((state) => state.objects);

  const [modalOpen, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const code = JSON.stringify({ rcl, structures: getExportedStructures(objects) });

  return (
    <>
      <Mui.Button onClick={handleOpen} variant='outlined' startIcon={<Icons.SourceOutlined />}>
        Get Room Json
      </Mui.Button>
      <StyledDialog fullWidth maxWidth='sm' open={modalOpen} onClose={handleClose}>
        <DialogTitle onClose={handleClose}>Room Objects JSON</DialogTitle>
        <Mui.DialogContent dividers sx={{ backgroundColor: palette.divider }}>
          <Mui.Paper sx={{ p: 1, maxHeight: '350px', overflowY: 'auto' }}>
            <HighlightCode>{code}</HighlightCode>
          </Mui.Paper>
        </Mui.DialogContent>
        <Mui.DialogActions sx={{ backgroundColor: palette.divider, justifyContent: 'flex-end' }}>
          <Mui.Button
            variant='contained'
            onClick={() => {
              navigator.clipboard.writeText(code);
              handleClose();
            }}
            startIcon={<Icons.ContentCopy />}
          >
            Copy
          </Mui.Button>
        </Mui.DialogActions>
      </StyledDialog>
    </>
  );
}
