import * as Mui from '@mui/material';
import * as Icons from '@mui/icons-material';
import * as Helpers from '@/utils/helpers';
import { BrushType, BrushClass, MAX_OBJECTS, TERRAIN_PLAIN } from '@/utils/constants';
import { useSettings } from '@/stores/Settings';
import { countPlacedByType, useGameObjectStore } from '@/stores/useGameObjectsStore';
import { useMemo, useState } from 'react';
import MapSettings from './MapSettings';

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
  // The default Collapse duration scales with content height, so the tall Structures list expands
  // noticeably slower than the short sections; one fixed short duration keeps every section snappy.
  <Mui.Accordion disableGutters elevation={0} square slotProps={{ transition: { timeout: 150 } }} {...props} />
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

const filterBrushes = <T extends { name: string }>(brushes: T[], query: string): T[] => {
  const needle = query.trim().toLowerCase();
  if (!needle) return brushes;
  return brushes.filter(({ name }) => name.toLowerCase().includes(needle));
};

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
  // Objects and Terrain start collapsed: they hold a handful of brushes each, so keeping them shut
  // puts the much longer Structures list in reach without scrolling. A search expands them anyway.
  const [objectsMenuExpanded, setObjectsMenuExpanded] = useState(false);
  const [terrainMenuExpanded, setTerrainMenuExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const width = 300;

  const searching = query.trim().length > 0;
  const structureBrushes = useMemo(() => filterBrushes(Helpers.getStructureBrushes(rcl), query), [rcl, query]);
  const objectBrushes = useMemo(() => filterBrushes(Helpers.getObjectBrushes(), query), [query]);
  const terrainBrushes = useMemo(() => filterBrushes(Helpers.getTerrainBrushes(), query), [query]);
  const noResults = searching && !structureBrushes.length && !objectBrushes.length && !terrainBrushes.length;

  // Walks up from the clicked node to the brush row that carries the data attribute. Returns '' at
  // the document root: a click can land on a node outside any brush row (a tooltip portal, or a row
  // that unmounted under the pointer), and recursing past it dereferences a null parent.
  const getBrushTarget = (target: HTMLElement | null): string => {
    if (!target) return '';
    for (const brushClass of Object.values(BrushClass)) {
      if (target.classList.contains(brushClass)) {
        const brushType = target.dataset[brushClass];
        if (brushType) {
          return brushType;
        }
      }
    }
    return getBrushTarget(target.parentElement);
  };

  const drawer = (
    <>
      <Mui.Toolbar variant='dense' />
      <Mui.Box sx={{ overflowY: 'auto' }}>
        <Mui.Box sx={{ top: 0, p: 2 }}>
          <Mui.TextField
            fullWidth
            size='small'
            placeholder='Search'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <Mui.InputAdornment position='start'>
                    <Icons.Search fontSize='small' sx={{ color: 'text.disabled' }} />
                  </Mui.InputAdornment>
                ),
                endAdornment: searching ? (
                  <Mui.InputAdornment position='end'>
                    <Mui.IconButton aria-label='Clear search' edge='end' size='small' onClick={() => setQuery('')}>
                      <Icons.Clear fontSize='small' />
                    </Mui.IconButton>
                  </Mui.InputAdornment>
                ) : undefined,
              },
            }}
            sx={({ palette }) => ({
              fieldset: {
                border: `1px solid ${palette.divider}`,
              },
              input: {
                fontSize: '14px',
              },
            })}
          />
        </Mui.Box>

        {noResults && (
          <Mui.Box sx={({ palette }) => ({ borderTop: `1px solid ${palette.divider}` })}>
            <Mui.Typography variant='body2' sx={{ color: 'text.secondary', p: 2, textAlign: 'center' }}>
              No brushes match &quot;{query.trim()}&quot;
            </Mui.Typography>
          </Mui.Box>
        )}

        {!searching && (
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
                <Mui.Typography>Room</Mui.Typography>
              </Mui.Box>
            </StyledAccordionSummary>
            <StyledAccordionDetails>
              <MapSettings />
            </StyledAccordionDetails>
          </StyledAccordion>
        )}

        {/* Structures Menu */}
        {!!structureBrushes.length && (
          <StyledAccordion
            expanded={searching || structuresMenuExpanded}
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
                        </Mui.Box>
                      </StyledButton>
                    );
                  })}
                </Mui.Stack>
              </Mui.Box>
            </StyledAccordionDetails>
          </StyledAccordion>
        )}

        {/* Objects Menu */}
        {!!objectBrushes.length && (
          <StyledAccordion
            expanded={searching || objectsMenuExpanded}
            onChange={() => setObjectsMenuExpanded(!objectsMenuExpanded)}
          >
            <StyledAccordionSummary>
              <Mui.Typography>Objects</Mui.Typography>
            </StyledAccordionSummary>
            <StyledAccordionDetails>
              <Mui.Box sx={{ display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
                <Mui.Stack direction='column' sx={{ m: 2 }}>
                  {objectBrushes.map(({ key, image, name, anchor, description }) => {
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
                        </Mui.Box>
                      </StyledButton>
                    );
                  })}
                </Mui.Stack>
              </Mui.Box>
            </StyledAccordionDetails>
          </StyledAccordion>
        )}

        {/* Terrain Menu */}
        {!!terrainBrushes.length && (
          <StyledAccordion
            expanded={searching || terrainMenuExpanded}
            onChange={() => setTerrainMenuExpanded(!terrainMenuExpanded)}
          >
            <StyledAccordionSummary>
              <Mui.Typography>Terrain</Mui.Typography>
            </StyledAccordionSummary>
            <StyledAccordionDetails>
              <Mui.Box sx={{ display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
                <Mui.Stack direction='column' sx={{ m: 2 }}>
                  {terrainBrushes.map(({ key, name, backgroundColor, boxShadow }) => {
                    return (
                      <StyledButton
                        className={BrushClass.Terrain}
                        data-terrain={key}
                        key={key}
                        endIcon={
                          <Mui.Box
                            sx={({ palette }) => ({
                              backgroundColor,
                              boxShadow,
                              // Wall is near-black and plain is a mid grey, so both need an outline to
                              // read as swatches against the drawer rather than dissolving into it.
                              // Same divider color as the accordion and field borders -- enough to
                              // bound the swatch without the outline outshining the color it frames.
                              border: `1px solid ${palette.divider}`,
                              borderRadius: '2px',
                              // No CssBaseline in this app, so the border would otherwise grow the
                              // swatch past the icon size the other brush rows align to.
                              boxSizing: 'border-box',
                              backgroundPosition: 'center',
                              backgroundRepeat: 'no-repeat',
                              height: iconSize,
                              width: iconSize,
                              opacity: 1,
                            })}
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
        )}
      </Mui.Box>
    </>
  );

  return (
    <>
      <Mui.Drawer
        variant='temporary'
        open={mobileOpen}
        onClose={() => {
          // The mobile drawer is `keepMounted`, so a stale query would still be filtering the lists
          // the next time it opens -- with the field itself scrolled out of view.
          setQuery('');
          handleDrawerToggle();
        }}
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
