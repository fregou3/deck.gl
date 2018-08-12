import {JSONDeck} from '@deck.gl/json';
import JSONMap from './json-map';

const DEFAULT_MAPBOX_STYLE = 'mapbox://styles/mapbox/light-v9';

export default class JSONDeckWithMap extends JSONDeck {
  constructor(props) {
    super(props);

    // Create map if requested (props.mapboxgl is supplied)
    this.map = this._createMap(this.props);
    const json = this.props.json;
    if (json) {
      this._setMapProps(json);
    }
  }

  finalize() {
    super.finalize();

    if (this.map) {
      this.map.finalize();
      this.map = null;
    }
  }

  setProps(props) {
    super.setProps(props);
    this._setMapProps(props.json);
  }

  // PRIVATE
  _onViewStateChange({viewState}) {
    this.setProps({viewState});
    this.map.setProps({viewState});
  }

  // Creates the base mapbox map
  // TODO - map should only be created once and made visible or invisible based on json settings
  // TODO - support base map in multiple views / multiple base maps?
  _createMap(props) {
    const mapboxApiAccessToken = props.mapboxApiAccessToken || props.mapboxApiAccessToken;
    const style = props.style || props.style || DEFAULT_MAPBOX_STYLE;

    const map =
      props.mapboxgl &&
      new JSONMap({
        mapboxgl: props.mapboxgl,
        container: props.mapContainer,
        mapboxApiAccessToken,
        style,
        reuseMap: true
      });

    return map;
  }

  _setMapProps(json) {
    if (!this.map || !json) {
      return;
    }

    this.map.setProps(json);
  }
}
