'use strict';

const _ = require('lodash');

const registerRoutes = async function(app, params, routes, path) {
  const {logger} = params;

  for(const [key, value] of Object.entries(routes)) {
    if(_.isPlainObject(value)) {
      await registerRoutes(app, params, value, (path ? `${path}/` : '') + key);

      continue;
    }

    const route = await value(params);
    const functions = [];

    if(typeof route.fn !== 'function') {
      throw new Error(`routes[${key}] is not a function`);
    }

    functions.push(route.fn);

    let finalUrl = '/api';

    if(route.path) {
      finalUrl += route.path;
    } else {
      finalUrl += (path ? `/${path}` : '');
    }

    app[route.method](finalUrl, functions);

    logger.debug(`Registered route ${route.method} - ${finalUrl}`);
  }
};

module.exports = registerRoutes;
