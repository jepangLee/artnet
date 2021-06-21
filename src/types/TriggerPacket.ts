import { RootPacket } from './RootPacket';

export class triggerPacket extends RootPacket {
  constructor(oem: number, key: number, subKey: number) {
    super();
    const hOem = (oem >> 8) & 0xff;
    const lOem = oem & 0xff;

    const header = [0, 153, 0, 14, 0, 0, hOem, lOem, key, subKey];

    this._data = Buffer.concat([
      this._data,
      Buffer.from(header.concat(new Array(512).map(() => null))),
    ]);
  }
}
