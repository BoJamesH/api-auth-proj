// frontend/src/store/index.js
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import sessionReducer from './session';
import spotsReducer from './spots';
import reviewsReducer from './reviews'
import bookingsReducer from './bookings';

const rootReducer = combineReducers({
  session: sessionReducer,
  spotsState: spotsReducer,
  reviewsState: reviewsReducer,
  bookingsState: bookingsReducer
});

let enhancer;

if (process.env.NODE_ENV === 'production') {
  const logger = require('redux-logger').default;
  enhancer = applyMiddleware(thunk, logger);
  } else {
    const logger = require('redux-logger').default;
    const composeEnhancers =
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
    return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
