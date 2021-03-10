import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import Map from './Map';
import { map, locate, sendPath, undo } from './map-utils';
import ExploreIcon from '@material-ui/icons/Explore';
import { ROSContext } from './ROSContext';

export default class MapView extends Component {
  static contextType = ROSContext;
  title = 'Map View';
  icon = (<ExploreIcon />);

  state = { draggable: true };

  toggleDraggable = () => {
    const draggable = !this.state.draggable;
    this.setState({ draggable });
    map.setOptions({ draggable });
  };

  render() {
    return (
      <>
        <div className="view-buttons">
          <Button id="locate" onClick={() => locate(this.context.droneLocation)}>
            Locate Drone
          </Button>
          <Button id="drawToggle" onClick={this.toggleDraggable}>
            {this.state.draggable ? 'Draw' : 'Drag'}
          </Button>
          <Button id="sendPath" onClick={sendPath}>
            Send path
          </Button>
          <Button id="undo" onClick={undo}>
            Undo
          </Button>
        </div>
        <Map />
      </>
    );
  }
}
