import * as Mui from '@mui/material';
import * as Icons from '@mui/icons-material';
import { useState } from 'react';
import StyledDialog from '../../dialog/StyledDialog';
import { useStructurePositions } from '@/stores/StructurePositions';
import DialogTitle from '../../dialog/DialogTitle';
import { useTheme } from '@mui/material';
import { getPointForShort } from '@/utils/helpers';
import HighlightCode from '../../highlight-code/HighlightCode';
import { useSettings } from '@/stores/Settings';

export default function GetRoomJson() {
  const { palette } = useTheme();

  const rcl = useSettings((state) => state.settings.rcl);
  const structurePositions = useStructurePositions((state) => state.positions);

  const [modalOpen, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const code = JSON.stringify({
    rcl,
    structures: Object.fromEntries(
      Object.entries(structurePositions)
        .map(([structure, positions]) => [structure, positions.map(getPointForShort)])
        .filter(([_, positions]) => positions.length)
    ),
  });

  return (
    <>
      <Mui.Button onMouseDown={handleOpen} variant='outlined' endIcon={<Icons.SourceOutlined />}>
        Get Room Json
      </Mui.Button>
      <StyledDialog fullWidth maxWidth='sm' open={modalOpen} onClose={handleClose}>
        <DialogTitle onClose={handleClose}>Room Objects Json</DialogTitle>
        <Mui.DialogContent dividers sx={{ backgroundColor: palette.divider }}>
          <Mui.Paper sx={{ p: 1, maxHeight: '350px', overflowY: 'auto' }}>
            <HighlightCode>{code}</HighlightCode>
          </Mui.Paper>
        </Mui.DialogContent>
        <Mui.DialogActions sx={{ backgroundColor: palette.divider, justifyContent: 'flex-end' }}>
          <Mui.Button
            variant='outlined'
            onClick={() => {
              navigator.clipboard.writeText(code);
              handleClose();
            }}
          >
            Copy to Clipboard
          </Mui.Button>
        </Mui.DialogActions>
      </StyledDialog>
    </>
  );
}
