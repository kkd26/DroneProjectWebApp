import React, { Component } from 'react';
import './App.scss';

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
      <>
        <div className="view-title">{title}</div>
        <View />
        <Menu changeView={this.changeView.bind(this)} />
      </>
    );
  }
}

export default App;
