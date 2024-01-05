const ERROR_NOT_FOUND = 404;
const ERROR_INTERNAL_SERVER = 500;
const ERROR_FORBIDDEN_ERROR = 403;

module.exports = {
  ERROR_NOT_FOUND,
  ERROR_INTERNAL_SERVER,
  ERROR_FORBIDDEN_ERROR,
};

module.exports = class ERROR_INACCURATE_DATA extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
};