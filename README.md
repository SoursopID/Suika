# Suika

Suika is a WhatsApp bot for automation purposes.

## Table of Contents

- [Description](#description)
- [Installation](#installation)
- [Usage](#usage)
- [Scripts](#scripts)
- [Dependencies](#dependencies)
- [License](#license)

## Description

Something like that.

## Installation

To install the necessary dependencies, run:

```bash
npm install
```

## Usage

Example plugin on [ping.js](./plugins/cmd/ping.js) :
```javascript
import { formatElapse } from "../../src/utils.js";

/** @type {import('../../src/plugin.js').Plugin} */
export const on = { // must export with 'on' named variable
  cmds: ["ping", "p"],
  timeout: 120,
  checks: [
    (m) => { return m.fromMe; }
  ],

  /** @param {import('../../src/ctx.js').Ctx} [m] - context object */
  exec: (m) => {
    const start = Date.now();
    const est = Math.floor(start - m.timestamp);
    m.reply({ text: formatElapse(est) });
  }
};
```

You can read at [plugin.js](./src/plugin.js) and [ctx.js](./src/ctx.js) for more detail options.

To start the development server, use:

```bash
npm run dev
```

To start the production server, use:

```bash
npm start
```

## Scripts

- `dev`: Starts the development server with nodemon.
- `start`: Starts the production server.

## Dependencies

- `@google/generative-ai`: ^0.22.0
- `baileys`: github:WhiskeySockets/baileys#e254718
- `pino`: ^9.6.0
- `qrcode-terminal`: ^0.12.0

## License

This project is licensed under the Mozilla Public License 2.0. See the [LICENSE](./LICENSE) file for details.
