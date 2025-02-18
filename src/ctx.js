function extactTextContext(m) {
  let resp = {
    text: "",
    contextInfo: null
  }

  if (typeof m !== 'object' || m === null) return resp;

  for (let key in m) {

    if (m[key] === null || m[key] === undefined) { continue; }
    if (key === 'conversation') {
      if (m[key].length > 0) { resp.text = m[key]; continue; }
    }

    if (typeof m[key] === 'object') {
      if (m[key].caption?.length > 0) { resp.text = m[key].caption; console.log("caption", m[key].caption) }
      if (m[key].text?.length > 0) {
        resp.text = m[key].text;
      }
      if (m[key].contextInfo) { resp.contextInfo = m[key].contextInfo; }
    }
  }

  return resp;
}

export class Ctx {
  constructor(sock, event) {
    this.sock = sock;
    this.update = event;
    this.key = this.update.key;

    this.parse();
  }

  parse() {
    const m = this.update.message;
    this.message = m;


    this.id = this.key?.id;
    this.chat = this.key?.remoteJid;
    this.sender = this.key?.participant;
    this.fromMe = this.key?.fromMe;

    const ext = extactTextContext(m)

    // console.log(ext);

    this.text = ext.text;
    this.contextInfo = ext.contextInfo;

    this.pattern = this.text.split(' ')[0];
    this.args = this.text.split(' ').slice(1);

    this.quoted = this.contextInfo?.quotedMessage;
    const qext = extactTextContext(this.quoted)
    this.quotedText = qext.text;
    this.quotedId = this.contextInfo?.stanzaId;
    this.participant = this.contextInfo?.participant;
    this.expiration = this.contextInfo?.expiration;

  }

  reply(m) {
    if (this.expiration) {
      if (m.contextInfo === undefined || m.contextInfo === null) m.contextInfo = {};
      m.contextInfo.expiration = this.expiration;
    }

    this.send(this.chat, m);
  }

  send(to, m) {
    this.sock.sendMessage(to, m);
  }
}
