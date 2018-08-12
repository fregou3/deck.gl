import React, {PureComponent} from 'react';
import JSONDeckWithMap from './json-deck-with-map';

export default class ReactJSONDeck extends PureComponent {
  componentDidMount() {
    this.jsonDeck = new JSONDeckWithMap(Object.assign({}, this.props, {
      canvas: 'deck-canvas',
      mapContainer: 'map',
      layerCatalog: this.props.layerCatalog,
      json: this.props.json
    }));
  }

  componentWillUnmount() {
    if (this.jsonDeck) {
      this.jsonDeck.finalize();
    }
  }

  setProps(props) {
    if (this.jsonDeck) {
      this.jsonDeck.setProps(props);
      this.forceUpdate();
    }
  }

  render() {
    // TODO - too expensive to update on every render?
    if (this.props.updateOnRender) {
      this.jsonDeck.setProps(this.props);
    }

    return (
      <div>
        <div
          id="map"
          style={{position: 'absolute', width: '100%', height: '100%', margin: 0}}
        />
        <canvas
          id="deck-canvas"
          style={{position: 'absolute', width: '100%', height: '100%', margin: 0}}
        />
      </div>
    );
  }
}
