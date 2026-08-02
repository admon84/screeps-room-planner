# Screeps Room Planner

A web app for planning [Screeps](https://screeps.com) room layouts. Paint structures, resource objects, and terrain onto a 50x50 grid, rendered with the game's own WebGL renderer.

#### Hosted at [screeps-room-planner.vercel.app](https://screeps-room-planner.vercel.app)

![screeps-room-planner](https://github.com/user-attachments/assets/cf4c25de-7b04-4172-af8f-5f2440088f5c)

## Features

- Structure placement with per-RCL limits and tile stacking rules
- Import terrain and structures from live Screeps MMO rooms
- Edit and export room JSON in the [screeps-tools](https://github.com/screepers/screeps-tools) building planner format

## Development

Requires Node.js v20.19+ (or v22.12+).

```sh
npm i
npm run dev
```

`npm run build` writes a static site to `dist/`. Serve it with `npm run preview` or any static host.

## License

MIT. See the LICENSE file.
