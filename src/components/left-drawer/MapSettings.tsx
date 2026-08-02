import * as Mui from '@mui/material';
import * as Icons from '@mui/icons-material';
import * as Helpers from '@/utils/helpers';
import { MAX_RCL, STRUCTURE_CONTROLLER } from '@/utils/constants';
import { useHistoryStore } from '@/stores/useHistoryStore';
import { useSettings } from '@/stores/Settings';

const MIN_RCL = 1;

// A number-input spinner: the two buttons stack into the height of the value they step, so the whole
// control stays as narrow as the chips on the brush rows instead of spreading across the row.
const StepButton = Mui.styled(Mui.IconButton)(({ theme }) => ({
  borderRadius: 2,
  height: 12,
  padding: 0,
  width: 18,
  '& .MuiSvgIcon-root': {
    fontSize: 14,
  },
  ':hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

export default function MapSettings() {
  const rcl = useSettings((state) => state.settings.rcl);
  const setRCL = useSettings((state) => state.setRCL);
  const commit = useHistoryStore((state) => state.commit);
  const controller = Helpers.getStructureBrushes(rcl).find((b) => b.key === STRUCTURE_CONTROLLER);

  // RCL is part of the history snapshot, so stepping it has to be its own entry -- otherwise undo
  // restores an unrelated earlier edit and silently drags the controller level back with it.
  const stepRCL = (next: number) => {
    commit();
    setRCL(next);
  };

  return (
    <Mui.Stack
      direction='row'
      sx={(theme) => ({
        alignItems: 'center',
        justifyContent: 'space-between',
        mx: 2,
        my: 1.5,
        // Brush labels sit inside the row button's 3px accent border and its own left padding. This
        // row has neither, so both are added back to put the label on the same vertical line.
        pl: `calc(3px + ${theme.spacing(1.5)})`,
      })}
    >
      <Mui.Typography variant='body2'>Controller Level</Mui.Typography>
      <Mui.Stack
        direction='row'
        spacing={0.75}
        sx={({ palette }) => ({
          alignItems: 'center',
          border: `1px solid ${palette.divider}`,
          borderRadius: 1,
          pl: 0.75,
          pr: 0.25,
          py: 0.25,
        })}
      >
        {controller && <Mui.Avatar alt={controller.name} src={controller.image} sx={{ width: 20, height: 20 }} />}
        <Mui.Typography variant='body2' sx={{ fontWeight: 500, textAlign: 'center', width: 14 }}>
          {rcl}
        </Mui.Typography>
        <Mui.Stack direction='column'>
          <StepButton aria-label='Increase controller level' disabled={rcl >= MAX_RCL} onClick={() => stepRCL(rcl + 1)}>
            <Icons.KeyboardArrowUp />
          </StepButton>
          <StepButton aria-label='Decrease controller level' disabled={rcl <= MIN_RCL} onClick={() => stepRCL(rcl - 1)}>
            <Icons.KeyboardArrowDown />
          </StepButton>
        </Mui.Stack>
      </Mui.Stack>
    </Mui.Stack>
  );
}
