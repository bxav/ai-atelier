import { Injectable } from '@nestjs/common';
const loading = require('loading-cli');

type Loader = {
  stop: () => void;
};

const pongFrames = [
  '▐⠂               ▌',
  '▐⠈               ▌',
  '▐ ⠂              ▌',
  '▐ ⠠              ▌',
  '▐  ⡀             ▌',
  '▐  ⠠             ▌',
  '▐   ⠂            ▌',
  '▐   ⠈            ▌',
  '▐    ⠂           ▌',
  '▐    ⠠           ▌',
  '▐     ⡀          ▌',
  '▐     ⠠          ▌',
  '▐      ⠂         ▌',
  '▐      ⠈         ▌',
  '▐       ⠂        ▌',
  '▐       ⠠        ▌',
  '▐        ⡀       ▌',
  '▐        ⠠       ▌',
  '▐         ⠂      ▌',
  '▐         ⠈      ▌',
  '▐          ⠂     ▌',
  '▐          ⠠     ▌',
  '▐           ⡀    ▌',
  '▐           ⠠    ▌',
  '▐            ⠂   ▌',
  '▐            ⠈   ▌',
  '▐             ⠂  ▌',
  '▐             ⠠  ▌',
  '▐              ⡀ ▌',
  '▐              ⠠ ▌',
  '▐               ⠂▌',
  '▐               ⠈▌',
  '▐              ⠠ ▌',
  '▐              ⡀ ▌',
  '▐             ⠠  ▌',
  '▐             ⠂  ▌',
  '▐            ⠈   ▌',
  '▐            ⠂   ▌',
  '▐           ⠠    ▌',
  '▐           ⡀    ▌',
  '▐          ⠠     ▌',
  '▐          ⠂     ▌',
  '▐         ⠈      ▌',
  '▐         ⠂      ▌',
  '▐        ⠠       ▌',
  '▐        ⡀       ▌',
  '▐       ⠠        ▌',
  '▐       ⠂        ▌',
  '▐      ⠈         ▌',
  '▐      ⠂         ▌',
  '▐     ⠠          ▌',
  '▐     ⡀          ▌',
  '▐    ⠠           ▌',
  '▐    ⠂           ▌',
  '▐   ⠈            ▌',
  '▐   ⠂            ▌',
  '▐  ⠠             ▌',
  '▐  ⡀             ▌',
  '▐ ⠠              ▌',
  '▐ ⠂              ▌',
  '▐⠈               ▌',
  '▐⠂               ▌',
];

@Injectable()
export class LoaderService {
  createLoader({ text }: { text: string }): Loader {
    return loading({
      text,
      color: 'yellow',
      interval: 80,
      stream: process.stdout,
      frames: pongFrames,
    }).start();
  }
}
