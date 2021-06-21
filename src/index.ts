import Artnet from './Artnet';

(async (): Promise<void> => {
  const artNetCli: Artnet = new Artnet({});

  artNetCli.set(null, null, [0, 1, 2]);
  artNetCli.setHost('192.168.0.189');
  artNetCli.setPort(1098);
  artNetCli.trigger(null, 123, null);
  artNetCli.close();
})();
