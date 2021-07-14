import * as express from 'express';
import { Request, Response } from 'express';
import * as logger from 'morgan';
import Artnet from '../../libs/Artnet';
import * as cors from 'cors';

const app = express();

const artnet = new Artnet({
  iFace: '192.168.1.200',
});

app.use(logger('dev'));
app.use(cors());

app.post('/:universe/:startChannel/:values', (req: Request, res: Response) => {
  const universe = parseInt(req.params.universe);
  const values = req.params.values.split(',').map((e: string) => parseInt(e));
  const startChannel = parseInt(req.params.startChannel);
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
