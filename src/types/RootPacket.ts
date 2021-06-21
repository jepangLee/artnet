export class RootPacket {
  protected buf: Buffer;

  constructor() {
    this.buf = Buffer.from([
      ...'Art-Net'.split('').map((e: string) => e.charCodeAt(0)),
      0x00,
    ]);
  }

  data = (): Buffer => {
    return this.buf;
  };

  length = (): number => {
    return this.buf.length;
  };
}
