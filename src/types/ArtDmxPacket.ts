import { RootPacket } from './RootPacket';

export class ArtDmxPacket extends RootPacket {
  constructor(data: number[][], universe: number, length: number) {
    super();

    if (length % 2) {
      length += 1;
    }

    const hUni = (universe >> 8) & 0xff;
    const lUni = universe & 0xff;

    const hLen = (length >> 8) & 0xff;
    const lLen = length & 0xff;

    const header = [0, 80, 0, 14, 0, 0, lUni, hUni, hLen, lLen];

    if (!data[universe]) {
      data[universe] = new Array(512).map(() => null);
    }

    this._data = Buffer.concat([
      this._data,
      Buffer.from(header.concat(data[universe].slice(0, (hLen * 256) + lLen))),
    ]);
  }
}
