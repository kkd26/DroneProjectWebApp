import React, { Component } from 'react';
import './Menu.scss';

import VideoView from './VideoView';
import ControlView from './ControlView';
import MapView from './MapView';

class Menu extends Component {
  constructor(props) {
    super(props);

    this.views = [VideoView, ControlView, MapView];
    this.changeView = props.changeView;
  }

  render() {
    return (
      <div className="menu">
        {this.views.map((view) => (
          <button onClick={() => this.changeView(view)}>
            {new view().title}
          </button>
        ))}
      </div>
    );
  }
}

export default Menu;
