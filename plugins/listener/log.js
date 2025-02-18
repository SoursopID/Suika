import { handler } from "../../src/hand.js";

handler.add({
  check: (m) => { return m !== undefined },
  exec: (m) => {

    let snippet = "";
    if (m.args) {
      m.args?.forEach(arg => {
        if (snippet.length > 30) return false;
        snippet += arg + " ";

      })
    };

    snippet = snippet.replaceAll("\n", " ");


    console.log(
      m.id,
      m.update.pushName, "on", m.update.key?.remoteJid,
      m.pattern, snippet);
  }
})
