export class RootPacket {
  protected _data: Buffer;

  constructor() {
    this._data = Buffer.from([
      ...'Art-Net'.split('').map((e: string) => e.charCodeAt(0)),
      0x00,
    ]);
  }

  data = (): Buffer => {
    return this._data;
  };

  length = (): number => {
    return this._data.length;
  };
}