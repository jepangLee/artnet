import React, { Component, ReactNode } from 'react';
import '../Style/App.css';
import { Slider } from './Slider';

export class App extends Component {
  timeId?: NodeJS.Timeout;
  canvas?: HTMLCanvasElement;

  constructor(props: Record<string, never>) {
    super(props);
  }

  fillTwoChar = (data: number): string => data < 10 ? `0${data}` : data + '';

  render(): ReactNode {
    const Sliders = [...Array(4).keys()].map((e:number) => (<>
        채널 {e + 1}
        <Slider channel={e + 1}/>
      </>))

    return (
      <div className="App">
        <header className="App-header">
          {Sliders}
        </header>
      </div>
    );
  }
}
