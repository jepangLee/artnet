import { Component, ReactNode, ReactElement, CSSProperties } from 'react';
import { Range } from 'react-range';
import { IThumbProps, ITrackProps } from 'react-range/lib/types';
import axios, { AxiosResponse } from 'axios';

export class Slider extends Component {
  state: SliderState;
  props: SliderProps;

  constructor(props: SliderProps) {
    super(props);
    this.state = {
      channel: [0],
    };
    this.props = props;
  }

  renderThumb = ({ props }: { props: IThumbProps }): ReactElement => (
    <div {...props} style={{ ...props.style, ...styles.thumb }}/>
  );

  renderTrack = ({ props, children }: { props: ITrackProps; children: ReactNode; }): ReactElement => (
    <div {...props} style={{ ...props.style, ...styles.track }}> {children} </div>
  );

  change = async (universe: number, channel: number, numbers: number[]): Promise<void> => {
    const value = Math.round(numbers[0] * 2.55);
    const res: AxiosResponse = await axios.post(
      `http://localhost:4000/${universe}/${channel}/${value}`,
    );
    this.setState({ ...this.state, channel: numbers });
    console.log(res.data);
  };

  render = (): ReactNode => (
    <Range
      onChange={(event: number[]) => this.change(this.props.universe, this.props.channel, event)}
      renderThumb={this.renderThumb}
      renderTrack={this.renderTrack}
      values={this.state.channel}/>
  );
}

type SliderProps = {
  channel: number,
  universe: number,
}

type SliderState = {
  channel: number[],
};

const styles: Record<string, CSSProperties> = {
  thumb: {
    backgroundColor: '#999',
    height: '20px',
    width: '20px',
  },
  track: {
    backgroundColor: '#ccc',
    height: '6px',
    width: '100px',
  },
};
