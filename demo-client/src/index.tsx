import { Component, ReactNode, CSSProperties } from 'react';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { Slider } from './Component/Slider';
import { render } from 'react-dom';

export class App extends Component {
  constructor(props: Record<string, never>) {
    super(props);
  }

  render(): ReactNode {
    const Sliders = [...Array(4).keys()].map((e: number) => (<>
      {`채널 ${e + 1}`}
      <Slider
        universe={1}
        channel={e + 1}
      />
    </>));

    return (
      <>
        <header style={styles.header}>
          {Sliders}
        </header>
      </>
    );
  }
}

const styles: Record<string, CSSProperties> = {
  header: {
    alignItems: 'center',
    background: '#282c34',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    minHeight: '100vh',
  },
};

render(<App/>, document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
