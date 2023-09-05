import { csrfFetch } from "./csrf";
import { loadReviews } from "./reviews"; // Make sure to import necessary actions

// Action types
export const LOAD_USER_BOOKINGS = 'bookings/LOAD_USER_BOOKINGS';
export const LOAD_SPOT_BOOKINGS = 'bookings/LOAD_SPOT_BOOKINGS';
export const CLEAR_BOOKINGS_STATE = '/spot/CLEAR_BOOKINGS_STATE'

// Action creators
export const loadUserBookings = (userBookings) => ({
    type: LOAD_USER_BOOKINGS,
    userBookings,
});

export const loadSpotBookings = (spotBookings) => ({
    type: LOAD_SPOT_BOOKINGS,
    spotBookings,
});

export const clearBookingsState = () => ({
    type: CLEAR_BOOKINGS_STATE,
  })

export const fetchUserBookings = (userId) => async (dispatch) => {
    try {
      const response = await csrfFetch(`/api/bookings/current`);
      const data = await response.json();

      if (response.status === 404) {
        dispatch(loadUserBookings([]));
        return;
      } else if (!response.ok) {
        throw new Error('Failed to fetch user bookings');
      } else {
        const userBookings = data; // Make sure the data structure matches
        dispatch(loadUserBookings(userBookings));
      }
    } catch (error) {
      console.error('Error fetching user bookings:', error);
    }
};

export const fetchSpotBookings = (spotId) => async (dispatch) => {
    try {
      const response = await csrfFetch(`/api/spots/${spotId}/bookings`);
      const data = await response.json();

      if (response.status === 404) {
        dispatch(clearBookingsState());
      } else if (!response.ok) {
        throw new Error('Failed to fetch user bookings');
      } else {
        const spotBookings = data; // Make sure the data structure matches
        dispatch(loadSpotBookings(spotBookings));
      }
    } catch (error) {
      console.error('Error fetching spot bookings:', error);
    }
};


const initialState = {
    userBookings: [],
    spotBookings: [],
    isLoading: true,
};

const bookingsReducer = (state = initialState, action) => {
    switch (action.type) {
      case LOAD_USER_BOOKINGS:
        return {
          ...state,
          userBookings: action.userBookings,
          isLoading: false,
        };
      case LOAD_SPOT_BOOKINGS:
        return {
          ...state,
          spotBookings: action.spotBookings,
          isLoading: false,
        };
    case CLEAR_BOOKINGS_STATE:
        return {
            initialState
        }
      default:
        return state;
    }
};

export default bookingsReducer;
