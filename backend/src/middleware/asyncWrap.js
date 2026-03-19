/**
 * Wraps an async route handler so that rejected promises
 * are forwarded to Express error middleware via next().
 */
export const asyncWrap = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
