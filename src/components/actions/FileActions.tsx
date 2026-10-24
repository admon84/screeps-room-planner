import * as Mui from '@mui/material';
import * as Icons from '@mui/icons-material';
import { useEffect, useRef, useState } from 'react';
import { applyRoomJsonText, saveRoomJson, saveRoomSvg } from '@/utils/roomFile';
import { useNotificationStore } from '@/stores/useNotificationStore';
import AppBarButton from './AppBarButton';

const PICTURE_FILLS = [
  { fill: 0, animate: false, label: 'Empty stores', detail: 'structures as built' },
  { fill: 0.5, animate: false, label: 'Half full', detail: 'energy, power and ghodium at 50 %' },
  { fill: 1, animate: false, label: 'Full', detail: 'every store at capacity' },
  {
    fill: 1,
    animate: true,
    label: 'Full, animated',
    detail: 'turrets and extractors turn, factory flashes, swamps drift, sources pulse',
  },
];

const isJsonFile = (file: File) => file.type === 'application/json' || file.name.toLowerCase().endsWith('.json');

/**
 * File-based exchange: open a room JSON file (picker, or drop it anywhere on the page), save the plan
 * as room JSON, or save a picture of it as SVG.
 */
export default function FileActions() {
  const notify = useNotificationStore((state) => state.notify);
  const inputRef = useRef<HTMLInputElement>(null);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

  const openFile = async (file: File) => {
    try {
      const error = applyRoomJsonText(await file.text());
      if (error) notify(`${file.name}: ${error}`, 'error');
      else notify(`Loaded ${file.name}`, 'success');
    } catch {
      notify(`Could not read ${file.name}`, 'error');
    }
  };

  // Drop a .json file anywhere on the page. dragover must be cancelled for drop to fire.
  useEffect(() => {
    const hasFiles = (event: DragEvent) => Array.from(event.dataTransfer?.types ?? []).includes('Files');
    const onDragOver = (event: DragEvent) => {
      if (hasFiles(event)) event.preventDefault();
    };
    const onDrop = (event: DragEvent) => {
      if (!hasFiles(event)) return;
      event.preventDefault();
      const file = Array.from(event.dataTransfer?.files ?? []).find(isJsonFile);
      if (file) void openFile(file);
      else notify('Drop a room .json file', 'error');
    };
    window.addEventListener('dragover', onDragOver);
    window.addEventListener('drop', onDrop);
    return () => {
      window.removeEventListener('dragover', onDragOver);
      window.removeEventListener('drop', onDrop);
    };
    // openFile only reads stores through getState(), so registering once is enough.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSaveSvg = async (fill: number, animate: boolean) => {
    setMenuAnchor(null);
    try {
      await saveRoomSvg(fill, animate);
    } catch (error) {
      notify(`SVG export failed: ${(error as Error).message}`, 'error');
    }
  };

  return (
    <>
      <AppBarButton icon={<Icons.FileOpenOutlined />} label='Open' onClick={() => inputRef.current?.click()} />
      <input
        ref={inputRef}
        type='file'
        accept='.json,application/json'
        hidden
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = ''; // the same file can be opened again
          if (file) void openFile(file);
        }}
      />
      <AppBarButton
        icon={<Icons.SaveAltOutlined />}
        label='Save'
        onClick={() => setMenuAnchor(document.activeElement as HTMLElement)}
      />
      <Mui.Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
        <Mui.MenuItem
          onClick={() => {
            setMenuAnchor(null);
            saveRoomJson();
          }}
        >
          <Mui.ListItemIcon>
            <Icons.DataObjectOutlined fontSize='small' />
          </Mui.ListItemIcon>
          <Mui.ListItemText primary='Room JSON' secondary='.json, opens here and in screeps-tools' />
        </Mui.MenuItem>
        <Mui.ListSubheader sx={{ lineHeight: 2.5 }}>Picture (.svg) in the game look</Mui.ListSubheader>
        {PICTURE_FILLS.map(({ fill, animate, label, detail }) => (
          <Mui.MenuItem key={label} onClick={() => void handleSaveSvg(fill, animate)}>
            <Mui.ListItemIcon>
              <Icons.ImageOutlined fontSize='small' />
            </Mui.ListItemIcon>
            <Mui.ListItemText primary={label} secondary={detail} />
          </Mui.MenuItem>
        ))}
      </Mui.Menu>
    </>
  );
}
