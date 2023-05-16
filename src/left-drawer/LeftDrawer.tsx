import * as Mui from '@mui/material';
import * as Icons from '@mui/icons-material';
import { MAX_RCL, STRUCTURE_CONTROLLER, TERRAIN_PLAIN } from '../utils/constants';
import { getRequiredRCL, getStructureBrushes, structureCanBePlaced } from '../utils/helpers';
import { StructureBrush } from '../utils/types';
import { useSettings } from '../contexts/SettingsContext';
import { useRoomStructures } from '../contexts/RoomStructuresContext';
import { useState } from 'react';
import RoomActions from './RoomActions';

export const drawerWidth = 300;
const iconSize = '1.5rem';

const StyledButton = Mui.styled(Mui.Button)<Mui.ButtonProps>(({ theme, variant }) => ({
  borderColor: 'transparent !important',
  color: '#eee',
  textTransform: 'capitalize',
  ':hover': {
    backgroundColor: variant === 'contained' ? theme.palette.primary.main : 'rgba(255,255,255,0.15)',
  },
}));

const StyledAccordion = Mui.styled((props: Mui.AccordionProps) => (
  <Mui.Accordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

const StyledAccordionSummary = Mui.styled((props: Mui.AccordionSummaryProps) => (
  <Mui.AccordionSummary expandIcon={<Icons.ArrowForwardIosSharp sx={{ fontSize: '0.9rem' }} />} {...props} />
))(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, .05)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const StyledAccordionDetails = Mui.styled(Mui.AccordionDetails)({
  padding: 0,
  borderTop: '1px solid rgba(0, 0, 0, .125)',
});

const StyledBadge = Mui.styled(Mui.Badge)<Mui.BadgeProps>(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: 15,
    top: 15,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));

export default function LeftDrawer() {
  const { settings, setRcl, setBrush, resetBrush, toggleCodeDrawer } = useSettings();
  const { roomStructures } = useRoomStructures();

  const [roomMenuExpanded, setRoomMenuExpanded] = useState(true);
  const [structuresMenuExpanded, setStructuresMenuExpanded] = useState(true);
  const [actionsMenuExpanded, setActionsMenuExpanded] = useState(true);
  const brushClass = 'brush';
  const structureBrushes = getStructureBrushes(settings.rcl);
  const controller = structureBrushes.find((b) => b.key === STRUCTURE_CONTROLLER);

  const getBrush = (target: HTMLElement): string => {
    if (target.classList.contains(brushClass)) {
      return (target as HTMLElement).dataset.structure!;
    }
    return getBrush(target.parentElement as HTMLElement);
  };

  return (
    <Mui.Drawer
      variant='permanent'
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          overflow: 'hidden',
        },
      }}
    >
      <Mui.Toolbar variant='dense' />
      <Mui.Box sx={{ overflowY: 'auto' }}>
        <StyledAccordion expanded={roomMenuExpanded} onChange={() => setRoomMenuExpanded(!roomMenuExpanded)}>
          <StyledAccordionSummary>
            <Mui.Box alignItems='center' display='flex' flexDirection='row' flexGrow={1} justifyContent='space-between'>
              <Mui.Typography>Room Controller Level</Mui.Typography>
              <Mui.Box>
                {controller && (
                  <StyledBadge badgeContent={settings.rcl} color='secondary'>
                    <Mui.Avatar alt={controller.name} src={controller.image} sx={{ width: 30, height: 30 }} />
                  </StyledBadge>
                )}
              </Mui.Box>
            </Mui.Box>
          </StyledAccordionSummary>
          <StyledAccordionDetails>
            <Mui.Box display='flex' flexDirection='column' overflow='auto'>
              <Mui.Stack direction='column' sx={{ m: 2 }}>
                <Mui.ToggleButtonGroup
                  color='primary'
                  exclusive
                  fullWidth
                  onChange={(_, value) => value && setRcl(value)}
                  size='small'
                  value={settings.rcl}
                >
                  {Array.from(Array(MAX_RCL), (_, i) => ++i).map((level) => (
                    <Mui.ToggleButton key={level} value={level}>
                      {level}
                    </Mui.ToggleButton>
                  ))}
                </Mui.ToggleButtonGroup>
              </Mui.Stack>
            </Mui.Box>
          </StyledAccordionDetails>
        </StyledAccordion>
        <StyledAccordion
          expanded={structuresMenuExpanded}
          onChange={() => setStructuresMenuExpanded(!structuresMenuExpanded)}
        >
          <StyledAccordionSummary>
            <Mui.Typography>Structures</Mui.Typography>
          </StyledAccordionSummary>
          <StyledAccordionDetails>
            <Mui.Box display='flex' flexDirection='column' overflow='auto'>
              <Mui.Stack direction='column' sx={{ m: 2 }}>
                {structureBrushes.map(({ key, image, total, name }) => {
                  const placed = roomStructures[key]?.length || 0;
                  const disabled = !structureCanBePlaced(key, settings.rcl, placed, TERRAIN_PLAIN);
                  const error = total < placed;
                  const locked = !error && settings.rcl < getRequiredRCL(key);
                  return (
                    <StyledButton
                      className={brushClass}
                      data-structure={key}
                      key={key}
                      disabled={disabled}
                      endIcon={
                        <Mui.Box
                          sx={{
                            backgroundImage: `url(${image})`,
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: 'contain',
                            height: iconSize,
                            width: iconSize,
                            opacity: disabled ? 0.2 : 1,
                          }}
                        />
                      }
                      onMouseDown={(e) => {
                        const brush = getBrush(e.target as HTMLElement);
                        if (settings.brush === brush) {
                          resetBrush();
                        } else {
                          setBrush(brush);
                        }
                      }}
                      sx={{
                        justifyContent: 'space-between',
                        '&& .MuiTouchRipple-rippleVisible': {
                          animationDuration: '200ms',
                        },
                      }}
                      variant={settings.brush === key ? 'contained' : 'outlined'}
                    >
                      <Mui.Box
                        alignItems='center'
                        display='flex'
                        flexDirection='row'
                        justifyContent='space-between'
                        flexGrow='1'
                      >
                        <Mui.Typography variant='body2'>{name}</Mui.Typography>
                        <Mui.Tooltip title={`${total - placed} Remaining`}>
                          <Mui.Chip
                            color={error ? 'error' : 'default'}
                            icon={locked ? <Icons.Lock /> : <></>}
                            label={locked ? `RCL ${getRequiredRCL(key)}` : placed + ' / ' + total}
                            disabled={disabled}
                            size='small'
                            sx={{
                              ...(settings.brush === key &&
                                !disabled && { borderColor: ({ palette }) => palette.text.primary }),
                              cursor: 'pointer',
                              fontSize: '.7rem',
                              fontWeight: 300,
                              transition: 'border-color 250ms ease',
                            }}
                            variant='outlined'
                          />
                        </Mui.Tooltip>
                      </Mui.Box>
                    </StyledButton>
                  );
                })}
              </Mui.Stack>
            </Mui.Box>
          </StyledAccordionDetails>
        </StyledAccordion>
        <StyledAccordion expanded={actionsMenuExpanded} onChange={() => setActionsMenuExpanded(!actionsMenuExpanded)}>
          <StyledAccordionSummary>
            <Mui.Typography>Actions</Mui.Typography>
          </StyledAccordionSummary>
          <StyledAccordionDetails>
            <Mui.Box display='flex' flexDirection='column' overflow='auto'>
              <Mui.Stack direction='column' sx={{ m: 2 }} spacing={1}>
                <RoomActions />

                <Mui.Button onMouseDown={toggleCodeDrawer} variant='outlined' endIcon={<Icons.DataObject />}>
                  Generate Map JSON
                </Mui.Button>
              </Mui.Stack>
            </Mui.Box>
          </StyledAccordionDetails>
        </StyledAccordion>
      </Mui.Box>
    </Mui.Drawer>
  );
}
