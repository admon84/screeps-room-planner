import * as Mui from '@mui/material';
import * as Icons from '@mui/icons-material';
import * as Helpers from '@/utils/helpers';
import { MAX_RCL, STRUCTURE_CONTROLLER } from '@/utils/constants';
import { useSettings } from '@/stores/Settings';

const MIN_RCL = 1;

const stepButtonSx = {
  borderRadius: 1,
  padding: 0.25,
};

export default function MapSettings() {
  const rcl = useSettings((state) => state.settings.rcl);
  const setRCL = useSettings((state) => state.setRCL);
  const controller = Helpers.getStructureBrushes(rcl).find((b) => b.key === STRUCTURE_CONTROLLER);

  return (
    <Mui.Stack direction='row' sx={{ alignItems: 'center', justifyContent: 'space-between', mx: 2, my: 1.5 }}>
      <Mui.Typography variant='body2'>Controller Level</Mui.Typography>
      <Mui.Stack direction='row' spacing={0.5} sx={{ alignItems: 'center' }}>
        <Mui.IconButton
          aria-label='Decrease controller level'
          disabled={rcl <= MIN_RCL}
          onClick={() => setRCL(rcl - 1)}
          size='small'
          sx={stepButtonSx}
        >
          <Icons.Remove fontSize='small' />
        </Mui.IconButton>
        {controller && <Mui.Avatar alt={controller.name} src={controller.image} sx={{ width: 20, height: 20 }} />}
        <Mui.Typography variant='body2' sx={{ fontWeight: 500, textAlign: 'center', width: 14 }}>
          {rcl}
        </Mui.Typography>
        <Mui.IconButton
          aria-label='Increase controller level'
          disabled={rcl >= MAX_RCL}
          onClick={() => setRCL(rcl + 1)}
          size='small'
          sx={stepButtonSx}
        >
          <Icons.Add fontSize='small' />
        </Mui.IconButton>
      </Mui.Stack>
    </Mui.Stack>
  );
}
