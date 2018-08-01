/**
 * A simple mapbox-gl wrapper that works with deck props
 * Note: Caller is responsible for importing mapboxgl and passing it in as a prop:
 *   import mapboxgl from 'mapbox-gl';
 *   const map = new JSONMap({mapboxgl, ... });
 */

import JSONDeck from './json-deck';

const DEFAULT_MAPBOX_STYLE = 'mapbox://styles/mapbox/light-v9';
const DEFAULT_STYLESHEET = 'https://api.tiles.mapbox.com/mapbox-gl-js/v0.44.2/mapbox-gl.css';

export default class JSONDeckWithMap extends JSONDeck {
  constructor(props) {
    super(props);

    this.map = this._createMap(this.props);
    this._setMapProps(props);
  }

  finalize() {
    super.finalize();

    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }

  setProps(props) {
    super.setProps(props);

    if ('visible' in props) {
      this._container.style.visibility = props.visible ? 'visible' : 'hidden';
    }

    // Makes sure only geospatial (lng/lat) view states are set
    if ('viewState' in props && props.viewState.longitude && props.viewState.latitude) {
      const {viewState} = props;
      this.map.jumpTo({
        center: [viewState.longitude, viewState.latitude],
        zoom: viewState.zoom || 10,
        bearing: viewState.bearing || 0,
        pitch: viewState.pitch || 0
      });
    }
  }

  // PRIVATE
  _onViewStateChange({viewState}) {
    this.setProps({viewState});
  }

  // Creates the base mapbox map
  // TODO - map should only be created once and made visible or invisible based on json settings
  // TODO - support base map in multiple views / multiple base maps?
  _createMap(props) {
    const {mapboxgl, mapboxApiAccessToken} = props;

    mapboxgl.accessToken = mapboxApiAccessToken || process.env.MapboxAccessToken; // eslint-disable-line

    const css = `https://api.tiles.mapbox.com/mapbox-gl-js/v${mapboxgl.version}/mapbox-gl.css`;
    this._setStyleSheet(css);

    this.map = new mapboxgl.Map(
      Object.assign({}, props, {
        mapboxgl: props.mapboxgl,
        container: props.mapContainer,
        style: props.style || DEFAULT_MAPBOX_STYLE,
        interactive: false,
        reuseMap: true
      })
    );

    this._container = this.map._container;

    this.setProps(props);
  }

  _setMapProps(props) {
    // Note: pros.json has now merged been into props
    if (this.map) {
      const mapProps = {visible: props.map};
      if (props.map) {
        Object.assign(mapProps, props);
      }
      this.map.setProps(mapProps);
    }
  }

  _setStyleSheet(props) {
    // Make sure we don't break under Node.js
    if (typeof document === 'undefined') {
      return;
    }

    const url = props.stylesheet || DEFAULT_STYLESHEET;

    /* global document */
    const styles = document.createElement('link');
    styles.type = 'text/css';
    styles.rel = 'stylesheet';
    styles.href = url;
    document.head.appendChild(styles);

    if (!props.keepMargin) {
      document.body.style.margin = '0px';
    }
  }
}

