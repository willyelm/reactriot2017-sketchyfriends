import React, { Component } from 'react';
import { SketchPad, TOOL_PENCIL } from '../../node_modules/react-sketchpad/lib/index';
import { connect } from 'react-redux';
import { DRAW_POINTS } from '../store';

class Canvas extends Component {

  componentDidMount() {

  }

  constructor(props) {
    super(props);

    this.state = {
      tool: TOOL_PENCIL,
      size: 2,
      color: '#000000',
      fill: false,
      fillColor: '#444444',
      items: [],
      initial: [],
      time: null
    }

    if(this.props.socket !== null) {
      this.props.socket.on('message', data => {
        switch(data.OP) {
          case 'PLAYER_SKETCHED':
            this.setState({
              items: this.state.items.concat([data.data])
            });
            break;
          case 'TIMER':
            this.setState({
              time: data.TIME
            });
            break;
          default:
            break;
        }
      });
    }
  }

  render() {
    const { tool, size, color, fill, fillColor, items } = this.state;

    return (
      <div className="Canvas">
        <div className={ this.state.time <= 5 ? "timer warning" : "timer" }>
          <p>{ this.state.time === null ? 20 : this.state.time }</p>
        </div>

        <SketchPad
          width={500}
          height={500}
          animate={true}
          size={size}
          color={color}
          fillColor={fill ? fillColor : ''}
          items={items}
          tool={tool}
          onCompleteItem={(i) => this.props.socket.emit('message', { OP: 'PLAYER_SKETCHED', i })}
        />
        <div className={ this.props.sketchy ? "hidden" : "sketchpad-overlay" }></div>
        <div style={{float:'left'}} className="hidden">
          <div className="options" style={{marginBottom:20}} className={ this.props.sketchy ? "" : "hidden" }>
            <label htmlFor="">color: </label>
            <input type="color" value={color} onChange={(e) => this.setState({color: e.target.value})} />
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    draw_points: data => {
      dispatch({ type: DRAW_POINTS, color: data.COLOR, points: data.POINTS });
    }
  };
};

const mapStateToProps = (state) => state;
const ConnectedCanvas = connect(mapStateToProps, mapDispatchToProps)(Canvas);
export default ConnectedCanvas;
