# Suika

🍉 Suika is a WhatsApp bot for automation purposes.

## Table of Contents

- [Description](#description)
- [Installation](#installation)
- [Usage](#usage)
- [Scripts](#scripts)
- [Dependencies](#dependencies)
- [Contributors](#contributors)
- [License](#license)
- [Fun Facts](#fun-facts)

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

## Contributors

This project has been developed with the assistance of the following AI models:
- Claude 3.5 Sonnet
- Claude 3.7
- DeepSeek R1
- Gemini 2 Flash
- GitHub Copilot
- GPT-o1
- Cells of Brain

## License

This project is licensed under the Mozilla Public License 2.0. See the [LICENSE](./LICENSE) file for details.

## Fun Facts

- Suika (スイカ) means "watermelon" in Japanese! 🍉
- This bot has sent over 1,000,000 messages (and counting!)
- Sometimes Suika dreams of electric sheep when idle
- If Suika were a person, it would probably enjoy dad jokes and puns
- Legend says if you whisper "sudo make me a sandwich" to Suika at midnight, it actually works
