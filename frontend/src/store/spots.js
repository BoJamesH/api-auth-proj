import { csrfFetch } from "./csrf";

// Action type constraints
export const LOAD_SPOTS = 'spots/LOAD_SPOTS'
export const LOAD_SINGLE_SPOT = 'spots/LOAD_SINGLE_SPOT';
export const CREATE_SPOT = '/spots/CREATE_SPOT'


// Action creators

export const loadSpots = (spots) => ({
    type: LOAD_SPOTS,
    spots,
})

export const loadSingleSpot = (spot) => ({
    type: LOAD_SINGLE_SPOT,
    spot,
});

export const createSpot = (spot) => ({
  type: CREATE_SPOT,
  spot
})


// Thunk action creators
export const postSpot = (spot) => async (dispatch) => {
  try {
    const response = await csrfFetch('/api/spots', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(spot),
    });

    if (!response.ok) {
      // Handle the error
      throw new Error('Failed to list new property');
    }

    const newSpot = await response.json();
    console.log(newSpot)
    dispatch(createSpot(newSpot));
    return newSpot;
  } catch (error) {
    // Handle the error
    console.error('Error creating new spot:', error.message);
    // You can also show an error message to the user
  }
};

export const fetchSpots = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots');
    if (!response.ok) throw new Error('Failed to fetch all properties');
    const data = await response.json();
    const allSpots = data.Spots
    console.log('Spots', allSpots)
    dispatch(loadSpots(allSpots));
};

export const fetchSpot = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`);
    if (!response.ok) throw new Error('Failed to fetch property')
    const spot = await response.json();
    console.log(spot)
    dispatch(loadSingleSpot(spot));
}


// Reducer

const initialState = {
    spots: [],
    singleSpot: null, // New slice of state to hold the single spot information
    isLoading: true,
  };

  const spotsReducer = (state = initialState, action) => {
    switch (action.type) {
      case LOAD_SPOTS:
        return {
          ...state,
          spots: action.spots,
          isLoading: false,
        };
      case LOAD_SINGLE_SPOT:
        return {
          ...state,
          singleSpot: action.spot, // Store the single spot in the new slice of state
          isLoading: false,
        };
      case CREATE_SPOT:
        return {
          ...state,
          spots: [...state.spots, action.spot], // Add the new spot to the list of spots
          singleSpot: action.spot, // Set the newly created spot as the singleSpot
          isLoading: false,
        };
      default:
        return state;
    }
  };


export default spotsReducer;
