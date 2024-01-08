const { UNAUTHORIZED_STATUS } = require('../config/config');

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = UNAUTHORIZED_STATUS;
  }
}

module.exports = UnauthorizedError;