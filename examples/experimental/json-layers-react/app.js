import React, {Component} from 'react';
import {render} from 'react-dom';

import {StaticMap} from 'react-map-gl';
import AceEditor from 'react-ace';
import ReactJSONDeck from './react-json-deck';

import 'brace/mode/json';
import 'brace/theme/github';

import {JSON_TEMPLATES, LAYER_CATALOG} from '../json-layers/constants';

export default class Root extends Component {
  constructor(props) {
    super(props);

    this._onTemplateChange = this._onTemplateChange.bind(this);
    this._onEditorChange = this._onEditorChange.bind(this);
    this._onViewStateChange = this._onViewStateChange(this);

    const INITIAL_JSON = Object.values(JSON_TEMPLATES)[0];
    this.state = {
      json: INITIAL_JSON
    };
  }

  componentDidMount() {
    this._setEditorText(this.state.json);
  }

  _prettyPrintJSON(text) {
    try {
      // Parse JSON, while capturing and ignoring exceptions
      const json = text && JSON.parse(text);
      // Pretty print JSON with tab size 2
      text = JSON.stringify(json, null, 2);
    } catch (error) {
      // ignore error
    }
    return text;
  }

  // NOTE: setting text triggers onEditorChange, which does the actual update of JSON state
  _setEditorText(text) {
    if (this.ace) {
      this.ace.editor.setValue(this._prettyPrintJSON(text));
    }
  }

  _onEditorChange(text, event) {
    this.setState({json: text});
  }

  _onTemplateChange(event) {
    const value = event && event.target && event.target.value;
    const json = JSON_TEMPLATES[value];
    if (json) {
      this._setEditorText(json);
    }
  }

  _renderJsonSelector() {
    return (
      <select name="JSON templates" onChange={this._onTemplateChange}>
        {Object.entries(JSON_TEMPLATES).map(([key, value]) => (
          <option key={key} value={key}>
            {key}
          </option>
        ))}
      </select>
    );
  }

  render() {
    return (
      <div>
        <div>
          <div style={{position: 'absolute', width: '100%', height: '100%', margin: 0}}>
            <div id="map" style={{position: 'absolute', width: '100%', height: '100%', margin: 0}}/>
            <StaticMap viewState={this.state.viewState}/>
            <ReactJSONDeck
              canvas="deck-canvas"
              layerCatalog={LAYER_CATALOG}
              json={this.state.json}
              onViewStateChange={this._onViewStateChange}
              />
          </div>
          <div style={{position: 'absolute', top: '5%', width: '40%', left: '55%', margin: 0}}>
            {this._renderJsonSelector()}
            <AceEditor
              mode="json"
              theme="github"
              onChange={this._onEditorChange}
              name="UNIQUE_ID_OF_DIV"
              editorProps={{$blockScrolling: true}}
              ref={instance => {
                this.ace = instance;
              }} // Let's put things into scope
            />
          </div>
        </div>
      </div>
    );
  }
}

/* global document */
render(<Root />, document.body.appendChild(document.createElement('div')));
