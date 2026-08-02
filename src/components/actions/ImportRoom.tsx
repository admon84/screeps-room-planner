import * as Mui from '@mui/material';
import * as Icons from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { MAX_RCL, STRUCTURE_CONTROLLER } from '@/utils/constants';
import {
  SCREEPS_SERVERS,
  ScreepsServer,
  fetchRoomObjects,
  fetchRoomTerrain,
  fetchShards,
  isValidRoomName,
  normalizeRoomName,
  terrainTilesFromEncoded,
} from '@/utils/screepsApi';
import { createExampleBunkerObjects, createObjectsFromApi } from '@/utils/gameObjects';
import { useSettings } from '@/stores/Settings';
import { useGameObjectStore } from '@/stores/useGameObjectsStore';
import { useHistoryStore } from '@/stores/useHistoryStore';
import { useTerrainStore } from '@/stores/useTerrainStore';
import StyledDialog from '../dialog/StyledDialog';
import DialogTitle from '../dialog/DialogTitle';

type ImportSource = 'world' | 'bunker';

export default function ImportRoom() {
  const { palette } = Mui.useTheme();

  const server = useSettings((state) => state.settings.server);
  const shard = useSettings((state) => state.settings.shard);
  const room = useSettings((state) => state.settings.room);
  const setServer = useSettings((state) => state.setServer);
  const setShard = useSettings((state) => state.setShard);
  const setRoom = useSettings((state) => state.setRoom);
  const setRCL = useSettings((state) => state.setRCL);
  const setObjects = useGameObjectStore((state) => state.setObjects);
  const setTerrain = useTerrainStore((state) => state.setTerrain);
  const resetTerrain = useTerrainStore((state) => state.reset);
  const commit = useHistoryStore((state) => state.commit);

  const [source, setSource] = useState<ImportSource>('world');
  const [includeStructuresChecked, setIncludeStructuresChecked] = useState(true);
  const [includeTerrainChecked, setIncludeTerrainChecked] = useState(true);
  // Both results are tagged with the server they came from, so switching servers invalidates them
  // by derivation instead of a synchronous reset inside the effect.
  const [shards, setShards] = useState<{ server: ScreepsServer; names: string[] } | null>(null);
  const [shardsError, setShardsError] = useState<{ server: ScreepsServer; message: string } | null>(null);
  const [modalOpen, setOpen] = useState(false);
  const [formError, setFormError] = useState<Error | null>(null);

  const shardOptions = shards?.server === server ? shards.names : [];
  const shardsLoading = modalOpen && shards?.server !== server && shardsError?.server !== server;

  const handleOpen = () => {
    setFormError(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // The shard list is fetched per server (memoized in fetchShards), and the stored shard is read
  // through getState() so picking a shard does not re-run the effect.
  useEffect(() => {
    if (!modalOpen || shards?.server === server) {
      return;
    }
    let cancelled = false;
    fetchShards(server)
      .then((names) => {
        if (cancelled) return;
        setShards({ server, names });
        setShardsError(null);
        if (names.length && !names.includes(useSettings.getState().settings.shard)) {
          setShard(names[0]);
        }
      })
      .catch((error: Error) => {
        if (!cancelled) setShardsError({ server, message: error.message });
      });
    return () => {
      cancelled = true;
    };
  }, [modalOpen, server, shards, setShard]);

  const handleLoadBunker = () => {
    commit();
    resetTerrain();
    setRCL(MAX_RCL);
    setObjects(createExampleBunkerObjects());
  };

  const handleImportFromApi = async () => {
    const roomName = normalizeRoomName(room);
    if (!isValidRoomName(roomName)) {
      setFormError(new Error('Invalid room name (examples: W1N1, E12S34)'));
      return false;
    }
    const shardName = shard.trim();
    if (!shardName.length) {
      setFormError(new Error('Shard is required'));
      return false;
    }
    setRoom(roomName);

    let terrainData;
    let objectsData;
    try {
      [terrainData, objectsData] = await Promise.all([
        includeTerrainChecked ? fetchRoomTerrain(server, shardName, roomName) : null,
        fetchRoomObjects(server, shardName, roomName),
      ]);
    } catch (error) {
      setFormError(error as Error);
      return false;
    }

    commit();
    if (terrainData) {
      setTerrain(terrainTilesFromEncoded(terrainData.terrain[0].terrain));
    }
    setObjects(createObjectsFromApi(objectsData.objects, includeStructuresChecked));

    // Unowned and reserved controllers report level 0, which leaves the current RCL alone.
    const controller = objectsData.objects.find((object) => object.type === STRUCTURE_CONTROLLER);
    if (controller?.level) {
      setRCL(controller.level);
    }
    return true;
  };

  const handleSubmit = async () => {
    setFormError(null);
    if (source === 'bunker') {
      handleLoadBunker();
      handleClose();
      return;
    }
    if (await handleImportFromApi()) {
      handleClose();
    }
  };

  return (
    <>
      <Mui.Button onClick={handleOpen} variant='outlined' startIcon={<Icons.TravelExploreOutlined />}>
        Import Room
      </Mui.Button>
      <StyledDialog fullWidth maxWidth='sm' open={modalOpen} onClose={handleClose}>
        <DialogTitle onClose={handleClose}>Import Room</DialogTitle>
        <Mui.DialogContent dividers sx={{ backgroundColor: palette.divider }}>
          <Mui.ToggleButtonGroup
            exclusive
            fullWidth
            size='small'
            value={source}
            onChange={(_event, value: ImportSource | null) => {
              if (value) {
                setFormError(null);
                setSource(value);
              }
            }}
            sx={{ mb: 2 }}
          >
            <Mui.ToggleButton value='world'>Screeps World</Mui.ToggleButton>
            <Mui.ToggleButton value='bunker'>Example Bunker</Mui.ToggleButton>
          </Mui.ToggleButtonGroup>
          <Mui.FormLabel component='div' sx={{ mb: 2 }}>
            {source === 'world'
              ? 'Import terrain and objects from a live room.'
              : 'Load the example bunker layout at RCL 8. Replaces all structures and resets the terrain.'}
          </Mui.FormLabel>
          {source === 'world' && (
            <Mui.Grid container rowSpacing={2} columnSpacing={2}>
              <Mui.Grid size={4}>
                <Mui.TextField
                  fullWidth
                  select
                  label='Server'
                  value={server}
                  onChange={(e) => {
                    setFormError(null);
                    setServer(e.target.value as ScreepsServer);
                  }}
                >
                  {Object.entries(SCREEPS_SERVERS).map(([key, { label }]) => (
                    <Mui.MenuItem key={key} value={key}>
                      {label}
                    </Mui.MenuItem>
                  ))}
                </Mui.TextField>
              </Mui.Grid>
              <Mui.Grid size={4}>
                <Mui.Autocomplete
                  disableClearable
                  freeSolo
                  options={shardOptions}
                  loading={shardsLoading}
                  inputValue={shard}
                  onInputChange={(_event, value) => {
                    setFormError(null);
                    setShard(value);
                  }}
                  renderInput={(params) => <Mui.TextField {...params} label='Shard' />}
                />
              </Mui.Grid>
              <Mui.Grid size={4}>
                <Mui.TextField
                  fullWidth
                  label='Room'
                  defaultValue={room}
                  onChange={(e) => {
                    setFormError(null);
                    setRoom(e.target.value);
                  }}
                />
              </Mui.Grid>
            </Mui.Grid>
          )}
          {source === 'world' && shardsError?.server === server && (
            <Mui.Box sx={{ backgroundColor: palette.divider, mt: 2 }}>
              <Mui.Alert color='warning' variant='outlined' sx={{ px: 1, py: 0 }}>
                Could not load the shard list -- enter a shard name manually. ({shardsError.message})
              </Mui.Alert>
            </Mui.Box>
          )}
          {formError && (
            <Mui.Box sx={{ backgroundColor: palette.divider, mt: 2 }}>
              <Mui.Alert color='error' variant='outlined' sx={{ px: 1, py: 0 }}>
                {formError.message}
              </Mui.Alert>
            </Mui.Box>
          )}
        </Mui.DialogContent>
        <Mui.DialogActions sx={{ backgroundColor: palette.divider, justifyContent: 'space-between' }}>
          <Mui.Box>
            {source === 'world' && (
              <>
                <Mui.FormControlLabel
                  label='Structures'
                  control={
                    <Mui.Checkbox
                      checked={includeStructuresChecked}
                      onChange={(e) => setIncludeStructuresChecked(e.target.checked)}
                    />
                  }
                />
                <Mui.FormControlLabel
                  label='Terrain'
                  control={
                    <Mui.Checkbox
                      checked={includeTerrainChecked}
                      onChange={(e) => setIncludeTerrainChecked(e.target.checked)}
                    />
                  }
                />
              </>
            )}
          </Mui.Box>
          <Mui.Button variant='contained' onClick={handleSubmit} startIcon={<Icons.TravelExploreOutlined />}>
            {source === 'world' ? 'Import Room' : 'Load Bunker'}
          </Mui.Button>
        </Mui.DialogActions>
      </StyledDialog>
    </>
  );
}
