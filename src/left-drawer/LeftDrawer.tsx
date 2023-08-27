import * as Mui from '@mui/material';
import * as Icons from '@mui/icons-material';
import { BrushType, MAX_RCL, STRUCTURE_CONTROLLER, TERRAIN_PLAIN } from '../utils/constants';
import { getRequiredRCL, getStructureBrushes, getObjectBrushes, structureCanBePlaced } from '../utils/helpers';
import { useSettings } from '../state/Settings';
import { useStructurePositions } from '../state/StructurePositions';
import { useState } from 'react';
import RoomActions from './RoomActions';

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
    right: 12,
    top: 12,
    background: 'transparent',
    border: 'none',
    padding: 0,
    fontSize: '0.6rem',
  },
}));

type Props = {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
};

export default function LeftDrawer({ mobileOpen, handleDrawerToggle }: Props) {
  const zoom = useSettings((state) => state.settings.zoom);
  const brush = useSettings((state) => state.settings.brush);
  const rcl = useSettings((state) => state.settings.rcl);
  const setBrush = useSettings((state) => state.setBrush);
  const setBrushType = useSettings((state) => state.setBrushType);
  const resetBrush = useSettings((state) => state.resetBrush);
  const setRCL = useSettings((state) => state.setRCL);
  const setZoom = useSettings((state) => state.setZoom);
  const toggleCodeDrawer = useSettings((state) => state.toggleCodeDrawer);
  const structurePositions = useStructurePositions((state) => state.positions);

  const [settingsMenuExpanded, setSettingsMenuExpanded] = useState(true);
  const [structuresMenuExpanded, setStructuresMenuExpanded] = useState(true);
  const [objectsMenuExpanded, setObjectsMenuExpanded] = useState(true);
  const [actionsMenuExpanded, setActionsMenuExpanded] = useState(true);
  const brushClass = 'brush';
  const objectClass = 'object';
  const structureBrushes = getStructureBrushes(rcl);
  const controller = structureBrushes.find((b) => b.key === STRUCTURE_CONTROLLER);
  const width = 300;

  const getStructureBrush = (target: HTMLElement): string => {
    if (target.classList.contains(brushClass)) {
      return (target as HTMLElement).dataset.structure!;
    }
    return getStructureBrush(target.parentElement as HTMLElement);
  };

  const getObjectBrush = (target: HTMLElement): string => {
    if (target.classList.contains(objectClass)) {
      return (target as HTMLElement).dataset.object!;
    }
    return getObjectBrush(target.parentElement as HTMLElement);
  };

  const updateZoom = (_: any, value: number | number[]) => setZoom(Array.isArray(value) ? value[0] : value);

  const drawer = (
    <>
      <Mui.Toolbar variant='dense' />
      <Mui.Box sx={{ overflowY: 'auto' }}>
        <StyledAccordion
          expanded={settingsMenuExpanded}
          onChange={() => setSettingsMenuExpanded(!settingsMenuExpanded)}
        >
          <StyledAccordionSummary>
            <Mui.Box alignItems='center' display='flex' flexDirection='row' flexGrow={1} justifyContent='space-between'>
              <Mui.Typography>Settings</Mui.Typography>
            </Mui.Box>
          </StyledAccordionSummary>
          <StyledAccordionDetails>
            <Mui.Stack direction='column' spacing={{ xs: 0, md: 2 }} sx={{ m: 2 }}>
              <Mui.Stack direction='column' spacing={1} sx={{ display: { xs: 'none', md: 'block' } }}>
                <Mui.Box
                  alignItems='center'
                  display='flex'
                  flexDirection='row'
                  flexGrow={1}
                  justifyContent='space-between'
                >
                  <Mui.Typography variant='body2'>Map Zoom</Mui.Typography>
                  <Mui.Typography variant='body2'>{zoom * 25 + 50}%</Mui.Typography>
                </Mui.Box>
                <Mui.Paper variant='outlined' sx={{ px: 2.4, pt: 0.8 }}>
                  <Mui.Slider
                    marks={false}
                    max={2}
                    min={0}
                    step={0.1}
                    value={zoom}
                    onChange={updateZoom}
                    onChangeCommitted={updateZoom}
                    sx={{
                      '& .MuiSlider-track': {
                        border: 'none',
                      },
                      '& .MuiSlider-thumb': {
                        '&:before': {
                          boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
                        },
                        '&:hover, &.Mui-focusVisible, &.Mui-active': {
                          boxShadow: 'none',
                        },
                      },
                    }}
                  />
                </Mui.Paper>
              </Mui.Stack>
              <Mui.Stack direction='column' spacing={1}>
                <Mui.Box
                  alignItems='center'
                  display='flex'
                  flexDirection='row'
                  flexGrow={1}
                  justifyContent='space-between'
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
            </Mui.Stack>
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
                {structureBrushes.map(({ key, image, total, name, object, description }) => {
                  const placed = structurePositions[key].length;
                  const disabled = !structureCanBePlaced(key, rcl, placed, TERRAIN_PLAIN);
                  const error = total < placed;
                  const locked = !error && rcl < getRequiredRCL(key);
                  return (
                    <StyledButton
                      className={brushClass}
                      data-structure={key}
                      key={key}
                      disabled={disabled}
                      endIcon={
                        <Mui.Tooltip
                          arrow
                          placement='right'
                          title={
                            <Mui.Box display='flex' flexDirection='column' justifyContent='center'>
                              <Mui.Typography variant='body2' sx={{ fontSize: '0.75rem' }}>
                                {description}
                              </Mui.Typography>
                              <Mui.Link href={'https://docs.screeps.com/api/#Structure' + object} target='_blank'>
                                View Documentation
                              </Mui.Link>
                            </Mui.Box>
                          }
                        >
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
                        </Mui.Tooltip>
                      }
                      onMouseDown={(e) => {
                        const newBrush = getStructureBrush(e.target as HTMLElement);
                        if (brush === newBrush) {
                          resetBrush();
                        } else {
                          setBrush(newBrush);
                          setBrushType(BrushType.Structure);
                        }
                      }}
                      sx={{
                        justifyContent: 'space-between',
                        '&& .MuiTouchRipple-rippleVisible': {
                          animationDuration: '200ms',
                        },
                      }}
                      variant={brush === key ? 'contained' : 'outlined'}
                    >
                      <Mui.Box
                        alignItems='center'
                        display='flex'
                        flexDirection='row'
                        justifyContent='space-between'
                        flexGrow='1'
                      >
                        <Mui.Typography variant='body2'>{name}</Mui.Typography>
                        <Mui.Tooltip arrow placement='left' title={`${total - placed} remaining`}>
                          <Mui.Chip
                            color={error ? 'error' : 'default'}
                            icon={locked ? <Icons.Lock /> : <></>}
                            label={
                              locked ? `RCL ${getRequiredRCL(key)}` : total === 2500 ? placed : placed + ' / ' + total
                            }
                            disabled={disabled}
                            size='small'
                            sx={{
                              ...(brush === key && !disabled && { borderColor: ({ palette }) => palette.text.primary }),
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

        <StyledAccordion expanded={objectsMenuExpanded} onChange={() => setObjectsMenuExpanded(!objectsMenuExpanded)}>
          <StyledAccordionSummary>
            <Mui.Typography>Objects</Mui.Typography>
          </StyledAccordionSummary>
          <StyledAccordionDetails>
            <Mui.Box display='flex' flexDirection='column' overflow='auto'>
              <Mui.Stack direction='column' sx={{ m: 2 }}>
                {getObjectBrushes().map(({ key, image, name }) => {
                  return (
                    <StyledButton
                      className={objectClass}
                      data-object={key}
                      key={key}
                      endIcon={
                        <Mui.Box
                          sx={{
                            backgroundImage: `url(${image})`,
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: 'contain',
                            height: iconSize,
                            width: iconSize,
                            opacity: 1,
                          }}
                        />
                      }
                      onMouseDown={(e) => {
                        const newBrush = getObjectBrush(e.target as HTMLElement);
                        if (brush === newBrush) {
                          resetBrush();
                        } else {
                          setBrush(newBrush);
                          setBrushType(BrushType.Object);
                        }
                      }}
                      sx={{
                        justifyContent: 'space-between',
                        '&& .MuiTouchRipple-rippleVisible': {
                          animationDuration: '200ms',
                        },
                      }}
                      variant={brush === key ? 'contained' : 'outlined'}
                    >
                      <Mui.Box
                        alignItems='center'
                        display='flex'
                        flexDirection='row'
                        justifyContent='space-between'
                        flexGrow='1'
                      >
                        <Mui.Typography variant='body2'>{name}</Mui.Typography>
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
    </>
  );

  return (
    <>
      <Mui.Drawer
        variant='temporary'
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          width,
          '& .MuiDrawer-paper': { width, boxSizing: 'border-box', backgroundImage: 'none' },
        }}
      >
        {drawer}
      </Mui.Drawer>
      <Mui.Drawer
        variant='permanent'
        sx={{
          display: { xs: 'none', md: 'block' },
          flexShrink: 0,
          width,
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width, overflow: 'hidden' },
        }}
        open
      >
        {drawer}
      </Mui.Drawer>
    </>
  );
}
