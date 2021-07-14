import * as express from 'express';
import { Request, Response } from 'express';
import * as logger from 'morgan';
import { TokenIndexer } from 'morgan';
import Artnet from '../../libs/Artnet';
import * as cors from 'cors';

const app = express();

const artnet = new Artnet({
  iFace: '192.168.1.200',
});

app.use(logger((tokens: TokenIndexer, req: Request, res: Response) => [
  new Date().toISOString(),
  tokens.method(req, res),
  tokens.url(req, res),
  tokens.status(req, res),
  tokens.res(req, res, 'content-length'), '-',
  tokens['response-time'](req, res), 'ms',
].join(' ')));
app.use(cors());

app.post('/:universe/:startChannel/:values', ({ params }: Request, res: Response) => {
  const universe = parseInt(params.universe);
  const values = params.values.split(',').map((e: string) => parseInt(e));
  const startChannel = parseInt(params.startChannel);
  artnet.set(universe, startChannel, values, (error: Error, bytes: number) => {
    if (error) {
      console.log(error);
    }
    console.log(bytes);
  });
  res.send({
    startChannel,
    universe,
    values,
  });
});

app.listen(4000, () => {
  console.log('listen on 4000');
});
