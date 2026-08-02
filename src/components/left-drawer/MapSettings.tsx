import * as Mui from '@mui/material';
import * as Helpers from '@/utils/helpers';
import { MAX_RCL, STRUCTURE_CONTROLLER } from '@/utils/constants';
import { useSettings } from '@/stores/Settings';

const StyledBadge = Mui.styled(Mui.Badge)<Mui.BadgeProps>(() => ({
  '& .MuiBadge-badge': {
    right: 12,
    top: 12,
    background: 'transparent',
    border: 'none',
    padding: 0,
    fontSize: '0.6rem',
  },
}));

export default function MapSettings() {
  const rcl = useSettings((state) => state.settings.rcl);
  const setRCL = useSettings((state) => state.setRCL);
  const controller = Helpers.getStructureBrushes(rcl).find((b) => b.key === STRUCTURE_CONTROLLER);

  return (
    <Mui.Stack direction='column' spacing={1} sx={{ m: 2 }}>
      <Mui.Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'row',
          flexGrow: 1,
          justifyContent: 'space-between',
        }}
      >
        <Mui.Typography variant='body2'>Room Controller Level</Mui.Typography>
        <Mui.Box>
          {controller && (
            <StyledBadge badgeContent={rcl} color='secondary'>
              <Mui.Avatar alt={controller.name} src={controller.image} sx={{ width: 24, height: 24 }} />
            </StyledBadge>
          )}
        </Mui.Box>
      </Mui.Box>
      <Mui.ToggleButtonGroup
        color='primary'
        exclusive
        fullWidth
        onChange={(_, value) => value && setRCL(value)}
        size='small'
        value={rcl}
      >
        {Array.from(Array(MAX_RCL), (_, i) => ++i).map((level) => (
          <Mui.ToggleButton key={level} value={level}>
            {level}
          </Mui.ToggleButton>
        ))}
      </Mui.ToggleButtonGroup>
    </Mui.Stack>
  );
}
