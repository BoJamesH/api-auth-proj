// backend/utils/validation.js

// Importing the validationResult function from the express-validator package
const { validationResult } = require('express-validator');

// Middleware for formatting errors from express-validator middleware
const handleValidationErrors = (req, _res, next) => {
  // Retrieve the validation errors from the request
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    const errors = {};
    // Format the validation errors into a key-value pair object
    validationErrors.array().forEach(error => {
      errors[error.path] = error.msg;
    });
    // Create an error object for bad request
    const err = Error('Bad request.');
    err.errors = errors;
    err.status = 400;
    err.title = 'Bad request.';
    next(err); // Pass the error to the next middleware
  }
  next();
};

// Export the handleValidationErrors middleware
module.exports = {
  handleValidationErrors
};
