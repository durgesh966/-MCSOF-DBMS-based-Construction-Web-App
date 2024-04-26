const debug = require('debug')('app:error');

const handleError = (err, req, res, defaultMessage = 'Internal Server Error') => {
    debug('Error:', err);
    const errorMessage = err.message || defaultMessage;
    res.status(err.status || 500).json({ error: errorMessage });
};

module.exports = { handleError };
