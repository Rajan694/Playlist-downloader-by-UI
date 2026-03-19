/**
 * Global Express error-handling middleware.
 * Returns a consistent JSON error shape for all uncaught errors.
 */
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, _next) => {
  console.error('[ERROR]', err.message || err);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: true,
    message: err.message || 'Internal server error',
  });
};
