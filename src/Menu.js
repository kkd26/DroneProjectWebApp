import React, { Component } from 'react';
import './Menu.scss';

class Menu extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <nav className="menu">
          <ul>
            {this.props.items.map(item => <li>{item}</li>)}
          </ul>
        </nav>
        <main>
          {this.props.items.map(item => <section>{`Welcome to ${item}`}</section>)}
        </main>
      </>
    );
  };
}

export default Menu;