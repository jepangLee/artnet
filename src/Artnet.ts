import { EventEmitter } from 'events';
import { Socket, createSocket } from 'dgram';
import { inherits } from 'util';
import { ArtDmxPacket } from './types/ArtDmxPacket';
import { Config } from './types/Config';
import { triggerPacket } from './types/TriggerPacket';

type Callback = (error: Error | null, bytes: number) => void;

class Artnet {
  private data: number[][] = [];
  private dataChanged: number[] = [];
  private emit: (event: 'error', err: Error) => void;
  private host: string;
  private interval: NodeJS.Timeout[] = [];
  private port: number;
  private refresh: number;
  private sendAll: boolean;
  private sendThrottle: NodeJS.Timeout[] = [];
  private sendDelayed: boolean[] = [];
  private socket: Socket;

  constructor(config: Config) {
    this.host = config.host ?? '255.255.255.255';
    this.port = config.port ?? 6454;
    this.refresh = config.refresh ?? 4000;
    this.sendAll = config.sendAll ?? false;

    this.socket = createSocket({ reuseAddr: true, type: 'udp4' });

    this.socket.on('error', (err: Error): void => {
      this.emit('error', err);
    });

    const setBroadCast = (): void => this.socket.setBroadcast(true);

    if (config.iFace && (this.host === '255.255.255.255')) {
      this.socket.bind(this.port, config.iFace, setBroadCast);
    }
    else if (this.host.match(/255$/)) {
      this.socket.bind(this.port, setBroadCast);
    }
  }

  set = (universe: number | null, channel: number | null,
         value: number | number[], callback?: Callback): boolean => {
    universe = universe ?? 0;
    channel = channel ?? 1;

    if (!this.data[universe]) {
      this.data[universe] = new Array(512).map((): null => null);
    }

    this.dataChanged[universe] = this.dataChanged[universe] ?? 0;

    if (typeof value !== 'number') {
      if (value.length > 0) {
        value.forEach((e: number, idx: number): void => {
          const dataIdx = channel + idx - 1;
          if (this.data[universe][dataIdx] !== value[idx]) {
            this.data[universe][dataIdx] = value[idx];
            if ((dataIdx + 1) > this.dataChanged[universe]) {
              this.dataChanged[universe] = dataIdx + 1;
            }
          }
        });
      }
    }
    else if (this.data[universe][channel - 1] !== value) {
      this.data[universe][channel - 1] = value;
      if (channel > this.dataChanged[universe]) {
        this.dataChanged[universe] = channel;
      }
    }

    if (this.dataChanged[universe]) {
      this.send(universe, null, callback);
    }
    else if (typeof callback === 'function') {
      callback(null, null);
    }

    return true;
  };

  send = (universe: number, refresh: boolean | null, callback?: Callback): void => {
    refresh = this.sendAll ? this.sendAll : refresh ?? false;

    if (!this.interval[universe]) {
      this.interval[universe] = setInterval((): void => {
        this.send(universe, true);
      }, this.refresh);
    }

    if (this.sendThrottle[universe]) {
      this.sendDelayed[universe] = true;
      return;
    }

    clearTimeout(this.sendThrottle[universe]);
    this.sendThrottle[universe] = setTimeout((): void => {
      this.sendThrottle[universe] = null;
      if (this.sendDelayed[universe]) {
        this.sendDelayed[universe] = false;
        this.send(universe, null, callback);
      }
    }, 25);

    const buf = new ArtDmxPacket(this.data, universe, refresh ? 512 : this.dataChanged[universe]);
    this.dataChanged[universe] = 0;
    this.socket.send(buf.data(), 0, buf.length(), this.port, this.host, callback);
  };

  trigger = (oem: number | null, key: number, subKey: number | null, callback?: Callback): boolean => {
    subKey = subKey ?? 0;
    oem = oem ?? 0xFFFF;

    const buf = new triggerPacket(oem, key, subKey);
    this.socket.send(buf.data(), 0, buf.length(), this.port, this.host, callback);

    return true;
  };

  close = (): void => {
    this.interval.forEach((e: NodeJS.Timeout): void => {
      clearInterval(e);
    });
    this.sendThrottle.forEach((e: NodeJS.Timeout): void => {
      clearTimeout(e);
    });
    this.socket.close();
  };

  setHost = (host: string): void => {
    this.host = host;
  };

  setPort = (port: number): void => {
    if (this.host === '255.255.255.255') {
      throw new Error('Can\'t change port when using broadcast address 255.255.255.255');
    }
    else {
      this.port = port;
    }
  };
}

inherits(Artnet, EventEmitter);

export default Artnet;
