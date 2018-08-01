// TODO - add alias for graph.gl: import {JSONDeck} from 'graph.gl';
import {JSONDeck} from '@deck.gl/experimental-layers';
import mapboxgl from 'mapbox-gl';

import {JSON_TEMPLATES, LAYER_CATALOG} from './constants';
const INITIAL_JSON = Object.values(JSON_TEMPLATES)[0];

import ACE from 'ace-builds';
console.log(`ACE editor: v${ACE.version}`); // eslint-disable-line

export const deckgl = new JSONDeck({
  canvas: 'deck-canvas',
  mapContainer: 'map',
  mapboxgl,
  layerCatalog: LAYER_CATALOG,
  json: INITIAL_JSON
});

//
// trigger extension
// ace.require("ace/ext/language_tools");
// this.editor = ACE.edit('editor');
// this.editor.session.setMode('ace/mode/json');
// this.editor.setTheme('ace/theme/tomorrow');
//

//
// enable autocompletion and snippets
// this.editor.setOptions({
//   // enableSnippets: true,
//   enableBasicAutocompletion: true,
//   enableLiveAutocompletion: false
// });
//


/**
 * A simple mapbox-gl wrapper that works with deck props
 * Note: Caller is responsible for importing mapboxgl and passing it in as a prop:
 *   import mapboxgl from 'mapbox-gl';
 *   const map = new JSONMap({mapboxgl, ... });
 */

mapboxgl.accessToken = mapboxApiAccessToken || process.env.MapboxAccessToken; // eslint-disable-line

// INSTALL MAP STYLES
installStyleSheet('https://api.tiles.mapbox.com/mapbox-gl-js/v0.44.2/mapbox-gl.css');
installStyleSheet(`https://api.tiles.mapbox.com/mapbox-gl-js/v${mapboxgl.version}/mapbox-gl.css`);

const map = new mapboxgl.Map({
  container: 'map',
  interactive: false,
  style: 'mapbox://styles/mapbox/light-v9'
});


function setMapProps(props) {
  if ('map' in props) {
    map._container.style.visibility = props.visible ? 'visible' : 'hidden';
  }

  // Makes sure only geospatial (lng/lat) view states are set
  if ('viewState' in props && props.viewState.longitude && props.viewState.latitude) {
    const {viewState} = props;
    map.jumpTo({
      center: [viewState.longitude, viewState.latitude],
      zoom: viewState.zoom || 10,
      bearing: viewState.bearing || 0,
      pitch: viewState.pitch || 0
    });
  }
}

// Creating the deck object starts the application
export const jsonDeck = new JSONDeck({
  onJSONChange: setMapProps,
  onViewStateChange: setMapProps
});


// HELPERS

function installStyleSheet(url) {
  /* global document */
  const styles = document.createElement('link');
  styles.type = 'text/css';
  styles.rel = 'stylesheet';
  styles.href = url;
  document.head.appendChild(styles);

  document.body.style.margin = '0px';
}
