import React, { Component, ReactNode, ReactElement } from 'react';
import { Range } from 'react-range';
import { IThumbProps, ITrackProps } from 'react-range/lib/types';
import axios, { AxiosResponse } from 'axios';

export class Slider extends Component {
  state: Readonly<{
    channel: number[],
  }>;
  props: { channel: number };

  constructor(props: { channel: number }) {
    super(props);
    this.state = {
      channel: [0],
    };
    this.props = props;
  }


  renderThumb = ({ props }: { props: IThumbProps }): ReactElement => (
    <div
      {...props}
      style={{
        ...props.style,
        backgroundColor: '#999',
        height: '20px',
        width: '20px',
      }}
    />
  );

  renderTrack = ({ props, children }: {
    props: ITrackProps;
    children: React.ReactNode;
  }): ReactElement => (
    <div
      {...props}
      style={{
        ...props.style,
        backgroundColor: '#ccc',
        height: '6px',
        width: '100px',
      }}>
      {children}
    </div>
  );

  render = (): ReactNode => (
    <Range
      onChange={(event: number[]) => this.change(this.props.channel, event)}
      renderThumb={this.renderThumb}
      renderTrack={this.renderTrack}
      values={this.state.channel}/>
  );

  change = async (channel: number, numbers: number[]): Promise<void> => {
    const value = Math.round(numbers[0] * 2.55);
    const res: AxiosResponse = await axios.post(
      `http://localhost:4000/0/${channel}/${value}`,
    );
    this.setState({ ...this.state, channel: numbers });
    console.log(res.data);
  };
}
