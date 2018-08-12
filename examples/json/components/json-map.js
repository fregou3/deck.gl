/**
 * A simple mapbox-gl wrapper that works with deck props
 * Note: Caller is responsible for importing mapboxgl and passing it in as a prop:
 *   import mapboxgl from 'mapbox-gl';
 *   const map = new JSONMap({mapboxgl, ... });
 */
const DEFAULT_STYLESHEET = 'https://api.tiles.mapbox.com/mapbox-gl-js/v0.44.2/mapbox-gl.css';

export default class JSONMap {
  constructor(props) {
    const {mapboxgl, mapboxApiAccessToken, container} = props;

    mapboxgl.accessToken = mapboxgl.accessToken ||
      mapboxApiAccessToken || process.env.MapboxAccessToken; // eslint-disable-line

    this._setStyleSheet(props);

    this.map = new mapboxgl.Map(
      Object.assign({}, props, {
        container,
        interactive: false
      })
    );

    this._container = this.map._container;

    this.setProps(props);
  }

  /* eslint-disable complexity */
  setProps(props) {
    if ('map' in props || 'mapStyle' in props) {
      const visible = props.mapStyle || props.map;
      this._container.style.visibility = visible ? 'visible' : 'hidden';
    }

    if ('mapStyle' in props) {
      this.map.setStyle(props.mapStyle);
    }

    if ('initialViewState' in props) {
      this.setProps({viewState: props.initialViewState})
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
  /* eslint-enable complexity */

  finalize() {
    this.map.remove();
  }

  _setStyleSheet(props) {
    // Make sure we don't break under Node.js
    if (typeof document === 'undefined') {
      return;
    }

    const url = props.stylesheet || DEFAULT_STYLESHEET;

    if (!props.keepMargin) {
      document.body.style.margin = '0px';
    }
    /* global document */
    const styles = document.createElement('link');
    styles.type = 'text/css';
    styles.rel = 'stylesheet';
    styles.href = url;
    document.head.appendChild(styles);
  }
}