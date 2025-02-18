import { handler } from "../../src/hand.js";

handler.add({
  cmds: ["!"],
  noprefix: true,
  check: (m) => { return m.fromMe },
  exec: (m) => {
    const args = m.args ? m.args.join(" ") : "";
    const resp = eval(args);
    // console.log(resp);

    m.reply({ text: String(resp), quote: m.msg });
  }
})
