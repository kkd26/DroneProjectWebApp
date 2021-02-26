import React, { Component } from 'react';
import './Menu.scss';

import VideoView from './VideoView';
import ControlView from './ControlView';
import MapView from './MapView';
import IconButton from '@material-ui/core/IconButton';

class Menu extends Component {
  constructor(props) {
    super(props);

    this.views = [VideoView, ControlView, MapView];
    this.changeView = props.changeView;
  }

  render() {
    var i = 0;
    return (
      <div className="menu">
        {this.views.map((view) => (
          <IconButton
            key={`view-${i++}`}
            color="primary"
            onClick={() => this.changeView(view)}
            component="span"
          >
            {new view().icon}
          </IconButton>
        ))}
      </div>
    );
  }
}

export default Menu;
