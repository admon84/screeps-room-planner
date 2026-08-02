import * as Mui from '@mui/material';
import * as Icons from '@mui/icons-material';
import * as Helpers from '@/utils/helpers';
import { BrushType, BrushClass, MAX_OBJECTS, TERRAIN_PLAIN } from '@/utils/constants';
import { useSettings } from '@/stores/Settings';
import { countPlacedByType, useGameObjectStore } from '@/stores/useGameObjectsStore';
import { useMemo, useState } from 'react';
import MapSettings from './MapSettings';
import RoomActions from './RoomActions';

const iconSize = '1.5rem';

const StyledButton = Mui.styled(Mui.Button, {
  shouldForwardProp: (prop) => prop !== 'inactive',
})<Mui.ButtonProps & { inactive?: boolean }>(({ theme, variant, inactive }) => {
  const selected = variant === 'contained';
  return {
    borderColor: 'transparent !important',
    // Text stays light in every state. A selected row is marked by a tint and an edge bar rather
    // than a solid fill, so readability never depends on the fill color being applied.
    color: selected ? theme.palette.primary.light : theme.palette.text.primary,
    backgroundColor: selected ? Mui.alpha(theme.palette.primary.main, 0.12) : 'transparent',
    borderLeft: `3px solid ${selected ? theme.palette.primary.main : 'transparent'}`,
    borderRadius: 4,
    justifyContent: 'space-between',
    paddingLeft: theme.spacing(1.5),
    transition: theme.transitions.create(['background-color', 'border-left-color'], { duration: 150 }),
    // Brush labels come from lowercase structure keys, so these opt out of the theme's `none`.
    textTransform: 'capitalize',
    fontWeight: selected ? 500 : 400,
    ':hover': {
      backgroundColor: theme.palette.action.hover,
    },
    // A `disabled` button swallows pointer events, which kills the tooltip on its icon. Structures at
    // their RCL cap are styled as disabled and made inert here instead, so the tooltip still fires.
    ...(inactive && {
      color: theme.palette.text.disabled,
      cursor: 'default',
      ':hover': {
        backgroundColor: 'transparent',
      },
    }),
  };
});

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
  backgroundColor: theme.palette.secondary.main,
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper': {
    color: theme.palette.text.secondary,
  },
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
  '& .MuiTypography-root': {
    fontSize: '0.8125rem',
    fontWeight: 600,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
  },
  ':hover': {
    backgroundColor: theme.palette.secondary.light,
  },
}));

const StyledAccordionDetails = Mui.styled(Mui.AccordionDetails)(({ theme }) => ({
  padding: 0,
  borderTop: `1px solid ${theme.palette.divider}`,
}));

type Props = {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
};

export default function LeftDrawer({ mobileOpen, handleDrawerToggle }: Props) {
  const brush = useSettings((state) => state.settings.brush);
  const rcl = useSettings((state) => state.settings.rcl);
  const setBrush = useSettings((state) => state.setBrush);
  const setBrushType = useSettings((state) => state.setBrushType);
  const resetBrush = useSettings((state) => state.resetBrush);
  const objects = useGameObjectStore((state) => state.objects);
  const placedCounts = useMemo(() => countPlacedByType(objects), [objects]);

  const [settingsMenuExpanded, setSettingsMenuExpanded] = useState(true);
  const [structuresMenuExpanded, setStructuresMenuExpanded] = useState(true);
  const [objectsMenuExpanded, setObjectsMenuExpanded] = useState(true);
  const [terrainMenuExpanded, setTerrainMenuExpanded] = useState(true);
  const [actionsMenuExpanded, setActionsMenuExpanded] = useState(true);
  const structureBrushes = Helpers.getStructureBrushes(rcl);
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

  const drawer = (
    <>
      <Mui.Toolbar variant='dense' />
      <Mui.Box sx={{ overflowY: 'auto' }}>
        <StyledAccordion
          expanded={settingsMenuExpanded}
          onChange={() => setSettingsMenuExpanded(!settingsMenuExpanded)}
        >
          <StyledAccordionSummary>
            <Mui.Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'row',
                flexGrow: 1,
                justifyContent: 'space-between',
              }}
            >
              <Mui.Typography>Map Settings</Mui.Typography>
            </Mui.Box>
          </StyledAccordionSummary>
          <StyledAccordionDetails>
            <MapSettings />
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
            <Mui.Box sx={{ display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
              <Mui.Stack direction='column' sx={{ m: 2 }}>
                {structureBrushes.map(({ key, image, total, name, anchor, description }) => {
                  const placed = placedCounts[key] ?? 0;
                  const disabled = !Helpers.structureCanBePlaced(key, rcl, TERRAIN_PLAIN, placed);
                  const error = total < placed;
                  const locked = !error && rcl < Helpers.getRequiredRCL(key);
                  return (
                    <StyledButton
                      className={BrushClass.Structure}
                      data-structure={key}
                      key={key}
                      inactive={disabled}
                      disableRipple={disabled}
                      endIcon={
                        <Mui.Tooltip
                          arrow
                          placement='right'
                          title={
                            <Mui.Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
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
                      onMouseDown={(e: React.MouseEvent<HTMLButtonElement>) => {
                        if (disabled) return;
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
                        sx={{
                          alignItems: 'center',
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          flexGrow: '1',
                        }}
                      >
                        <Mui.Typography variant='body2'>{name}</Mui.Typography>
                        <Mui.Tooltip arrow hidden={placed === 0} placement='left' title={`${total - placed} remaining`}>
                          <Mui.Chip
                            color={error ? 'error' : 'default'}
                            // Chip clones this element to inject its own className, and a Fragment
                            // accepts no className -- so the empty case has to be undefined.
                            icon={locked ? <Icons.Lock /> : undefined}
                            label={
                              locked
                                ? `RCL ${Helpers.getRequiredRCL(key)}`
                                : total === 2500
                                  ? placed
                                  : placed + ' / ' + total
                            }
                            size='small'
                            sx={({ palette }) => ({
                              ...(brush === key &&
                                !disabled && {
                                  borderColor: palette.primary.main,
                                  color: palette.primary.light,
                                }),
                              ...(disabled && { opacity: palette.action.disabledOpacity }),
                              cursor: 'pointer',
                              fontSize: '.7rem',
                              fontWeight: 500,
                              transition: 'border-color 250ms ease',
                            })}
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
            <Mui.Box sx={{ display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
              <Mui.Stack direction='column' sx={{ m: 2 }}>
                {Helpers.getObjectBrushes().map(({ key, image, name, anchor, description }) => {
                  const storedType = Helpers.getObjectTypeForBrush(key);
                  const placed = placedCounts[storedType] ?? 0;
                  const total = MAX_OBJECTS[storedType];
                  const disabled = !Helpers.objectCanBePlaced(key, placed);
                  return (
                    <StyledButton
                      className={BrushClass.Object}
                      data-object={key}
                      key={key}
                      inactive={disabled}
                      disableRipple={disabled}
                      endIcon={
                        <Mui.Tooltip
                          arrow
                          placement='right'
                          title={
                            <Mui.Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
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
                              opacity: disabled ? 0.2 : 1,
                            }}
                          />
                        </Mui.Tooltip>
                      }
                      onMouseDown={(e: React.MouseEvent<HTMLButtonElement>) => {
                        if (disabled) return;
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
                        sx={{
                          alignItems: 'center',
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          flexGrow: '1',
                        }}
                      >
                        <Mui.Typography variant='body2'>{name}</Mui.Typography>
                        <Mui.Tooltip arrow placement='left' title={`${total - placed} remaining`}>
                          <Mui.Chip
                            label={`${placed} / ${total}`}
                            size='small'
                            sx={({ palette }) => ({
                              ...(brush === key &&
                                !disabled && {
                                  borderColor: palette.primary.main,
                                  color: palette.primary.light,
                                }),
                              ...(disabled && { opacity: palette.action.disabledOpacity }),
                              cursor: 'pointer',
                              fontSize: '.7rem',
                              fontWeight: 300,
                              transition: 'border-color 250ms ease',
                            })}
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

        {/* Terrain Menu */}
        <StyledAccordion expanded={terrainMenuExpanded} onChange={() => setTerrainMenuExpanded(!terrainMenuExpanded)}>
          <StyledAccordionSummary>
            <Mui.Typography>Terrain</Mui.Typography>
          </StyledAccordionSummary>
          <StyledAccordionDetails>
            <Mui.Box sx={{ display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
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
                      onMouseDown={(e: React.MouseEvent<HTMLButtonElement>) => {
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
                        sx={{
                          alignItems: 'center',
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          flexGrow: '1',
                        }}
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
            <Mui.Box sx={{ display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
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
        slotProps={{
          root: {
            keepMounted: true,
          },
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
