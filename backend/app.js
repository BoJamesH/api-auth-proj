const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const routes = require('./routes');
const { ValidationError } = require('sequelize');

const { environment } = require('./config');
const isProduction = environment === 'production';

const app = express();

// Logging middleware, print info about requests
app.use(morgan('dev'));
// Allows us to access CSRF/JWTs
app.use(cookieParser());
app.use(express.json());

if (!isProduction) {
    app.use(cors());
};

// Ensures a variety of headers is added to our application
app.use(
    helmet.crossOriginResourcePolicy({
        policy: 'cross-origin'
    })
);

// More web security stuff
app.use(
    csurf({
        cookie: {
            secure: isProduction,
            sameSite: isProduction && "Lax",
            httpOnly: true,
        }
    })
);

app.use(routes); // Connect all the routes

// Catch unhandled requests (404 errors) and forward to error handler.
app.use((_req, _res, next) => {
    const err = new Error("The requested resource couldn't be found.");
    err.title = "Resource Not Found";
    err.errors = { message: "The requested resource couldn't be found." };
    err.status = 404;
    next(err);
});

// Process sequelize errors
app.use((err, _req, _res, next) => {
    // check if error is a Sequelize error:
    if (err instanceof ValidationError) {
      let errors = {};
      for (let error of err.errors) {
        errors[error.path] = error.message;
      }
      err.title = 'Validation error';
      err.errors = errors;
    }
    next(err);
});

app.use((err, _req, res, _next) => {
    // Catch all errors //assigns 'server error' if it doesn't have a status
    res.status(err.status || 500);
    console.error(err);
    // Responds to client with relevant error
    res.json({
      title: err.title || 'Server Error',
      message: err.message,
      errors: err.errors,
      stack: isProduction ? null : err.stack
    });
});

module.exports = app;
