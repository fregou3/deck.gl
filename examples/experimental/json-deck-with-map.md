# JSONDeckWithMapWithMap (Experimental)

> NOTE: This component is only intended to support **official deck.gl API props** via JSON. In particular, it is not intended to evolve an implementation of alternate JSON schemas. Support for such schemas should be developed indenpendently, perhaps using the source code of this component as a base. See the [JSON Layers RFC](https://github.com/uber/deck.gl/blob/master/dev-docs/RFCs/v6.1/json-layers-rfc.md) for more on this.

Creates a `Deck` instance from a JSON description.


## Usage

```js
import {JSONDeckWithMap} from '@deck.gl/json';
import mapboxgl from 'mapbox-gl';

import json from './us-map.json';

export const deckgl = new JSONDeckWithMap({
  canvas: 'deck-canvas',
  mapContainer: 'map',
  mapboxgl,
  layerCatalog: require('@deck.gl/layers'),
  json
});
```


## Properties

All the properties of `JSONDeck` with the following additions:


### mapboxgl : MapboxGL

Optionally lets application import mapbox-gl and supply it. Most Mapbox-gl versions should be compatible.


### `mapboxApiAccessToken` : String

Can be specified as a top level prop, or in JSON (the latter takes precedence).



## JSON Properties

All properties in `prop.json` are passed directly to `JSONDeck`, with the following exceptions:


### `json.mapboxApiAccessToken` : String

Passed to mapbox-gl, takes precedence over `props.mapboxApiAccessToken`/

