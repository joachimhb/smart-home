import '@babel/polyfill';

import React from 'react';
import {hot} from 'react-hot-loader';
import {Provider} from 'react-redux';
import {ConnectedRouter} from 'connected-react-router';

import App from './containers/App.jsx';
import store, {history} from './store';

const Root = function() {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
    </Provider>
  );
};

export default hot(module)(Root);
