import React, {PureComponent} from 'react';
import {JSONDeck} from '@deck.gl/json';

export default class ReactJSONDeck extends PureComponent {
  componentDidMount() {
    this.jsonDeck = new JSONDeck(Object.assign(this.props, {
      canvas: 'deck-canvas',
    }));
  }

  componentWillUnmount() {
    if (this.jsonDeck) {
      this.jsonDeck.finalize();
    }
  }

  render() {
    // TODO - expensive to update on every render?
    this.jsonDeck.setProps(this.props);
    return <canvas id='deck-canvas'/>
  }
}
