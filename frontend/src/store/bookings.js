import { csrfFetch } from "./csrf";
import { loadReviews } from "./reviews";
import { fetchSpot } from "./spots";

// Action types
export const LOAD_USER_BOOKINGS = 'bookings/LOAD_USER_BOOKINGS';
export const LOAD_SPOT_BOOKINGS = 'bookings/LOAD_SPOT_BOOKINGS';
export const CLEAR_BOOKINGS_STATE = '/spot/CLEAR_BOOKINGS_STATE';
export const POST_BOOKING = 'bookings/POST_BOOKING';

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

export const postBooking = () => ({
  type: POST_BOOKING
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
        const userBookings = data;
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
        const spotBookings = data; 
        dispatch(loadSpotBookings(spotBookings));
      }
    } catch (error) {
      console.error('Error fetching spot bookings:', error);
    }
};

export const createBooking = (booking, spotId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking)
    })

    if (response.ok) {
      const newReview = await response.json();
      dispatch(fetchSpotBookings(spotId));
      await dispatch(fetchSpot(spotId))
      return newReview;
    }
  } catch (error) {
    const errors = await error.json()
    console.log(errors);
    return errors;
  }
}


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
