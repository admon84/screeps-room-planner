import * as Mui from '@mui/material';
import * as Icons from '@mui/icons-material';
import { useState } from 'react';
import { buildRoomJson, parseRoomJson } from '@/utils/roomJson';
import { MONO_FONT_FAMILY } from '@/utils/theme';
import { useSettings } from '@/stores/Settings';
import { useGameObjectStore } from '@/stores/useGameObjectsStore';
import { useHistoryStore } from '@/stores/useHistoryStore';
import { useNotificationStore } from '@/stores/useNotificationStore';
import StyledDialog from '../dialog/StyledDialog';
import DialogTitle from '../dialog/DialogTitle';

export default function EditRoomJson() {
  const { palette } = Mui.useTheme();

  const setRCL = useSettings((state) => state.setRCL);
  const setObjects = useGameObjectStore((state) => state.setObjects);
  const commit = useHistoryStore((state) => state.commit);
  const notify = useNotificationStore((state) => state.notify);

  const [modalOpen, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Seeded once per open so in-progress edits are never clobbered by a store change, and read through
  // getState() rather than a selector -- the plan is only needed at this instant, and subscribing
  // would re-serialize it on every paint stroke. Edits are discarded on close; reopening reseeds.
  const handleOpen = () => {
    setText(buildRoomJson(useGameObjectStore.getState().objects, useSettings.getState().settings.rcl));
    setFormError(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Atomic: every failure returns before commit(), so a rejected edit leaves the stores untouched.
  const handleApply = () => {
    const result = parseRoomJson(text);
    if (!result.ok) {
      setFormError(result.error);
      return;
    }

    commit(); // one snapshot covers objects and rcl, so the whole edit undoes in a single step
    setObjects(result.objects);
    if (result.rcl !== undefined) {
      setRCL(result.rcl);
    }

    handleClose();
  };

  // navigator.clipboard is undefined outside a secure context (dev reached over a plain-http LAN
  // address) and writeText rejects when the document is not focused -- neither may claim success.
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      notify('Copied JSON to clipboard', 'success');
    } catch {
      notify('Could not copy to clipboard', 'error');
    }
  };

  return (
    <>
      <Mui.Button onClick={handleOpen} variant='outlined' startIcon={<Icons.DataObject />}>
        Edit Room JSON
      </Mui.Button>
      <StyledDialog fullWidth maxWidth='sm' open={modalOpen} onClose={handleClose}>
        <DialogTitle onClose={handleClose}>Edit Room JSON</DialogTitle>
        <Mui.DialogContent dividers sx={{ backgroundColor: palette.divider }}>
          <Mui.FormLabel component='div' sx={{ mb: 2 }}>
            Edit the room plan as JSON. Positions use the &quot;x-y&quot; format. Applying replaces everything placed
            and sets the RCL if the JSON carries one; terrain is left alone.
          </Mui.FormLabel>
          <Mui.FormControl variant='outlined' fullWidth>
            <Mui.TextField
              error={!!formError}
              fullWidth
              label='JSON'
              maxRows={18}
              minRows={12}
              multiline
              onChange={(e) => {
                setFormError(null);
                setText(e.target.value);
              }}
              slotProps={{
                // Scoped to the textarea rather than the input root: the root's font also sizes the
                // outline's notch, which would then no longer match the floating label. Weight 500 is
                // the only JetBrains Mono weight main.tsx loads.
                input: {
                  sx: {
                    '& .MuiInputBase-input': {
                      fontFamily: MONO_FONT_FAMILY,
                      fontWeight: 500,
                      fontSize: 13,
                      lineHeight: 1.6,
                    },
                  },
                },
                htmlInput: { spellCheck: false },
              }}
              value={text}
            />
          </Mui.FormControl>
          {formError && (
            <Mui.Box sx={{ backgroundColor: palette.divider, mt: 2 }}>
              <Mui.Alert color='error' variant='outlined' sx={{ px: 1, py: 0 }}>
                {formError}
              </Mui.Alert>
            </Mui.Box>
          )}
        </Mui.DialogContent>
        <Mui.DialogActions sx={{ backgroundColor: palette.divider, justifyContent: 'space-between' }}>
          <Mui.Button variant='outlined' onClick={handleCopy} startIcon={<Icons.ContentCopy />}>
            Copy
          </Mui.Button>
          <Mui.Button variant='contained' onClick={handleApply} startIcon={<Icons.DataObject />}>
            Apply
          </Mui.Button>
        </Mui.DialogActions>
      </StyledDialog>
    </>
  );
}
