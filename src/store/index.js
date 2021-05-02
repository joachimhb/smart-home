import logger from 'redux-logger';
import thunk from 'redux-thunk';

import {createHashHistory} from 'history';
import {connectRouter, routerMiddleware} from 'connected-react-router';
import {
  applyMiddleware,
  combineReducers,
  compose,
  createStore
} from 'redux';

import * as reducers from '../reducers';

import connectWebsocket from '../lib/connectWebsocket';

export const history = createHashHistory({
  basename: '',
  hashType: 'slash',
});

const rootReducer = combineReducers({
  router: connectRouter(history),
  ...reducers,
});

const middlewares = [
  thunk,
  // logger,
  routerMiddleware(history),
];

const store = createStore(rootReducer, compose(applyMiddleware(...middlewares)));

connectWebsocket({store});

export default store;
