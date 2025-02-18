import { handler } from "../../src/hand.js";

handler.add({
  cmds: ["ping", "p"],
  check: (m) => { return m.fromMe },
  exec: (m) => {
    m.reply({ text: "Pong!" });
  }
})
