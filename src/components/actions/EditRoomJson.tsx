import * as Mui from '@mui/material';
import * as Icons from '@mui/icons-material';
import { useState } from 'react';
import { MAX_RCL } from '@/utils/constants';
import { buildRoomJson, parseRoomJson } from '@/utils/roomJson';
import { isValidRoomName, normalizeRoomName } from '@/utils/screepsApi';
import { MONO_FONT_FAMILY } from '@/utils/theme';
import { useSettings } from '@/stores/Settings';
import { useGameObjectStore } from '@/stores/useGameObjectsStore';
import { useHistoryStore } from '@/stores/useHistoryStore';
import { useNotificationStore } from '@/stores/useNotificationStore';
import { useTerrainStore } from '@/stores/useTerrainStore';
import StyledDialog from '../dialog/StyledDialog';
import DialogTitle from '../dialog/DialogTitle';
import AppBarButton from './AppBarButton';

type EditTab = 'properties' | 'json';

const RCL_OPTIONS = Array.from({ length: MAX_RCL }, (_, index) => index + 1);

export default function EditRoomJson() {
  const { palette } = Mui.useTheme();

  const setBlockEdges = useSettings((state) => state.setBlockEdges);
  const setPlayerName = useSettings((state) => state.setPlayerName);
  const setRCL = useSettings((state) => state.setRCL);
  const setRoom = useSettings((state) => state.setRoom);
  const setShard = useSettings((state) => state.setShard);
  const setObjects = useGameObjectStore((state) => state.setObjects);
  const setTerrain = useTerrainStore((state) => state.setTerrain);
  const commit = useHistoryStore((state) => state.commit);
  const notify = useNotificationStore((state) => state.notify);

  const [modalOpen, setOpen] = useState(false);
  const [tab, setTab] = useState<EditTab>('properties');
  const [text, setText] = useState('');
  const [form, setForm] = useState({ room: '', shard: '', rcl: MAX_RCL, playerName: '', blockEdges: true });
  const [formError, setFormError] = useState<string | null>(null);

  // Seeded once per open so in-progress edits are never clobbered by a store change, and read through
  // getState() rather than a selector -- the plan is only needed at this instant, and subscribing
  // would re-serialize it on every paint stroke. Edits are discarded on close; reopening reseeds.
  const handleOpen = () => {
    const { blockEdges, playerName, rcl, room, shard } = useSettings.getState().settings;
    setText(buildRoomJson(useGameObjectStore.getState().objects, useTerrainStore.getState().terrain, rcl, room, shard));
    setForm({ room, shard, rcl, playerName, blockEdges });
    setFormError(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const setFormField = <K extends keyof typeof form>(field: K, value: (typeof form)[K]) => {
    setFormError(null);
    setForm((current) => ({ ...current, [field]: value }));
  };

  // Atomic: every failure returns before commit(), so a rejected edit leaves the stores untouched.
  const handleApplyJson = () => {
    const result = parseRoomJson(text);
    if (!result.ok) {
      setFormError(result.error);
      return;
    }

    commit(); // one snapshot covers objects, terrain and rcl, so the whole edit undoes in a single step
    setObjects(result.objects);
    if (result.terrain !== undefined) {
      setTerrain(result.terrain);
    }
    if (result.rcl !== undefined) {
      setRCL(result.rcl);
    }

    handleClose();
  };

  const handleApplyProperties = () => {
    const roomName = normalizeRoomName(form.room);
    if (!isValidRoomName(roomName)) {
      setFormError('Invalid room name (examples: W1N1, E12S34)');
      return;
    }
    const shardName = form.shard.trim();
    if (!shardName) {
      setFormError('Shard is required');
      return;
    }
    const playerName = form.playerName.trim();
    if (!playerName) {
      setFormError('Player name is required');
      return;
    }

    // RCL is part of the history snapshot, so a change gets its own entry (same rule as MapSettings);
    // the other properties are not snapshotted, so an unchanged RCL commits nothing.
    if (form.rcl !== useSettings.getState().settings.rcl) {
      commit();
      setRCL(form.rcl);
    }
    setRoom(roomName);
    setShard(shardName);
    setPlayerName(playerName);
    setBlockEdges(form.blockEdges);
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
      <AppBarButton icon={<Icons.EditNote />} label='Edit' onClick={handleOpen} />
      <StyledDialog fullWidth maxWidth='sm' open={modalOpen} onClose={handleClose}>
        <DialogTitle onClose={handleClose}>Edit Room</DialogTitle>
        <Mui.DialogContent dividers sx={{ backgroundColor: palette.divider }}>
          <Mui.ToggleButtonGroup
            exclusive
            fullWidth
            size='small'
            value={tab}
            onChange={(_event, value: EditTab | null) => {
              if (value) {
                setFormError(null);
                setTab(value);
              }
            }}
            sx={{ mb: 2 }}
          >
            <Mui.ToggleButton value='properties'>Properties</Mui.ToggleButton>
            <Mui.ToggleButton value='json'>JSON</Mui.ToggleButton>
          </Mui.ToggleButtonGroup>
          {tab === 'json' && (
            <>
              <Mui.FormLabel component='div' sx={{ mb: 2 }}>
                Applying replaces everything placed and sets the RCL if the JSON carries one. Terrain is replaced when
                the JSON includes room features.
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
            </>
          )}
          {tab === 'properties' && (
            <>
              <Mui.FormLabel component='div' sx={{ mb: 2 }}>
                Room name, shard and RCL are written into the exported JSON. The player name picks the badge drawn on
                owned structures.
              </Mui.FormLabel>
              <Mui.Grid container rowSpacing={2} columnSpacing={2}>
                <Mui.Grid size={6}>
                  <Mui.TextField
                    fullWidth
                    label='Room Name'
                    value={form.room}
                    onChange={(e) => setFormField('room', e.target.value)}
                  />
                </Mui.Grid>
                <Mui.Grid size={6}>
                  <Mui.TextField
                    fullWidth
                    label='Shard'
                    value={form.shard}
                    onChange={(e) => setFormField('shard', e.target.value)}
                  />
                </Mui.Grid>
                <Mui.Grid size={6}>
                  <Mui.TextField
                    fullWidth
                    select
                    label='RCL'
                    value={form.rcl}
                    onChange={(e) => setFormField('rcl', Number(e.target.value))}
                  >
                    {RCL_OPTIONS.map((level) => (
                      <Mui.MenuItem key={level} value={level}>
                        {level}
                      </Mui.MenuItem>
                    ))}
                  </Mui.TextField>
                </Mui.Grid>
                <Mui.Grid size={6}>
                  <Mui.TextField
                    fullWidth
                    label='Player Name'
                    value={form.playerName}
                    onChange={(e) => setFormField('playerName', e.target.value)}
                  />
                </Mui.Grid>
                <Mui.Grid size={12}>
                  <Mui.FormControlLabel
                    control={
                      <Mui.Switch
                        checked={form.blockEdges}
                        onChange={(e) => setFormField('blockEdges', e.target.checked)}
                      />
                    }
                    label='Block room edges'
                  />
                </Mui.Grid>
              </Mui.Grid>
            </>
          )}
          {formError && (
            <Mui.Box sx={{ backgroundColor: palette.divider, mt: 2 }}>
              <Mui.Alert color='error' variant='outlined' sx={{ px: 1, py: 0 }}>
                {formError}
              </Mui.Alert>
            </Mui.Box>
          )}
        </Mui.DialogContent>
        <Mui.DialogActions sx={{ backgroundColor: palette.divider, justifyContent: 'space-between' }}>
          <Mui.Box>
            {tab === 'json' && (
              <Mui.Button variant='outlined' onClick={handleCopy} startIcon={<Icons.ContentCopy />}>
                Copy
              </Mui.Button>
            )}
          </Mui.Box>
          <Mui.Button
            variant='contained'
            onClick={tab === 'json' ? handleApplyJson : handleApplyProperties}
            startIcon={<Icons.DataObject />}
          >
            Apply
          </Mui.Button>
        </Mui.DialogActions>
      </StyledDialog>
    </>
  );
}
