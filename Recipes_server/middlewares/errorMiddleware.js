const ApiError = require('../exceptions/apiError');

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  console.log(err);
  if (err instanceof ApiError) {
    console.log({ message: err.message, errors: err.errors });
    return res.status(err.status).json({ message: err.message, errors: err.errors });
  }
  return res.status(500).json({ message: 'Unexpected server error' });
};
