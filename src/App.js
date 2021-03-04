import React, { Component } from 'react';
import './App.scss';
import { ROSContextProvider } from './ROSContext';

import Menu from './Menu';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      View: props.view,
    };
  }

  changeView(view) {
    this.setState({ View: view });
  }

  render() {
    const View = this.state.View;
    const { title, buttons } = new View();
    return (
      <ROSContextProvider>
        <div className="view-title">{title}</div>
        <div className="view-body">
          <View />
        </div>
        <Menu changeView={this.changeView.bind(this)} />
      </ROSContextProvider>
    );
  }
}

export default App;
