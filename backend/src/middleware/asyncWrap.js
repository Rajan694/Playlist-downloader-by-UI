'use strict';

/**
 * Wraps an async route handler so that rejected promises
 * are forwarded to Express error middleware via next().
 */
function asyncWrap(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = { asyncWrap };
