import * as Mui from '@mui/material';
import * as Icons from '@mui/icons-material';
import * as Helpers from '@/utils/helpers';
import { BrushType, BrushClass, MAX_RCL, STRUCTURE_CONTROLLER, TERRAIN_PLAIN } from '@/utils/constants';
import { useSettings } from '@/stores/Settings';
import { useStructurePositions } from '@/stores/StructurePositions';
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
  ':hover': {
    backgroundColor: theme.palette.grey[800],
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
  const structurePositions = useStructurePositions((state) => state.positions);

  const [settingsMenuExpanded, setSettingsMenuExpanded] = useState(true);
  const [structuresMenuExpanded, setStructuresMenuExpanded] = useState(true);
  const [objectsMenuExpanded, setObjectsMenuExpanded] = useState(true);
  const [terrainMenuExpanded, setTerrainMenuExpanded] = useState(true);
  const [actionsMenuExpanded, setActionsMenuExpanded] = useState(true);
  const structureBrushes = Helpers.getStructureBrushes(rcl);
  const controller = structureBrushes.find((b) => b.key === STRUCTURE_CONTROLLER);
  const width = 300;

  const getBrushTarget = (target: HTMLElement): string => {
    for (const brushClass of Object.values(BrushClass)) {
      if (target && target.classList.contains(brushClass)) {
        const brushType = (target as HTMLElement).dataset[brushClass];
        if (brushType) {
          return brushType;
        }
      }
    }
    return getBrushTarget(target.parentElement as HTMLElement);
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

        {/* Structures Menu */}
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
                {structureBrushes.map(({ key, image, total, name, anchor, description }) => {
                  const placed = structurePositions[key].length;
                  const disabled = !Helpers.structureCanBePlaced(key, rcl, TERRAIN_PLAIN, placed);
                  const error = total < placed;
                  const locked = !error && rcl < Helpers.getRequiredRCL(key);
                  return (
                    <StyledButton
                      className={BrushClass.Structure}
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
                              <Mui.Link href={`https://docs.screeps.com/api/#Structure${anchor}`} target='_blank'>
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
                        const newBrush = getBrushTarget(e.target as HTMLElement);
                        if (newBrush) {
                          if (brush === newBrush) {
                            resetBrush();
                          } else {
                            setBrush(newBrush);
                            setBrushType(BrushType.Structure);
                          }
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
                              locked
                                ? `RCL ${Helpers.getRequiredRCL(key)}`
                                : total === 2500
                                  ? placed
                                  : placed + ' / ' + total
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

        {/* Objects Menu */}
        <StyledAccordion expanded={objectsMenuExpanded} onChange={() => setObjectsMenuExpanded(!objectsMenuExpanded)}>
          <StyledAccordionSummary>
            <Mui.Typography>Objects</Mui.Typography>
          </StyledAccordionSummary>
          <StyledAccordionDetails>
            <Mui.Box display='flex' flexDirection='column' overflow='auto'>
              <Mui.Stack direction='column' sx={{ m: 2 }}>
                {Helpers.getObjectBrushes().map(({ key, image, name, anchor, description }) => {
                  return (
                    <StyledButton
                      className={BrushClass.Object}
                      data-object={key}
                      key={key}
                      endIcon={
                        <Mui.Tooltip
                          arrow
                          placement='right'
                          title={
                            <Mui.Box display='flex' flexDirection='column' justifyContent='center'>
                              <Mui.Typography variant='body2' sx={{ fontSize: '0.75rem' }}>
                                {description}
                              </Mui.Typography>
                              <Mui.Link href={`https://docs.screeps.com/api/#${anchor}`} target='_blank'>
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
                              opacity: 1,
                            }}
                          />
                        </Mui.Tooltip>
                      }
                      onMouseDown={(e) => {
                        const newBrush = getBrushTarget(e.target as HTMLElement);
                        if (newBrush) {
                          if (brush === newBrush) {
                            resetBrush();
                          } else {
                            setBrush(newBrush);
                            setBrushType(BrushType.Object);
                          }
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

        {/* Terrain Menu */}
        <StyledAccordion expanded={terrainMenuExpanded} onChange={() => setTerrainMenuExpanded(!terrainMenuExpanded)}>
          <StyledAccordionSummary>
            <Mui.Typography>Terrain</Mui.Typography>
          </StyledAccordionSummary>
          <StyledAccordionDetails>
            <Mui.Box display='flex' flexDirection='column' overflow='auto'>
              <Mui.Stack direction='column' sx={{ m: 2 }}>
                {Helpers.getTerrainBrushes().map(({ key, name, backgroundColor, boxShadow }) => {
                  return (
                    <StyledButton
                      className={BrushClass.Terrain}
                      data-terrain={key}
                      key={key}
                      endIcon={
                        <Mui.Box
                          sx={{
                            backgroundColor,
                            boxShadow,
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            height: iconSize,
                            width: iconSize,
                            opacity: 1,
                          }}
                        />
                      }
                      onMouseDown={(e) => {
                        const newBrush = getBrushTarget(e.target as HTMLElement);
                        if (newBrush) {
                          if (brush === newBrush) {
                            resetBrush();
                          } else {
                            setBrush(newBrush);
                            setBrushType(BrushType.Terrain);
                          }
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

        {/* Actions Menu */}
        <StyledAccordion expanded={actionsMenuExpanded} onChange={() => setActionsMenuExpanded(!actionsMenuExpanded)}>
          <StyledAccordionSummary>
            <Mui.Typography>Actions</Mui.Typography>
          </StyledAccordionSummary>
          <StyledAccordionDetails>
            <Mui.Box display='flex' flexDirection='column' overflow='auto'>
              <Mui.Stack direction='column' sx={{ m: 2 }} spacing={1}>
                <RoomActions />
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
