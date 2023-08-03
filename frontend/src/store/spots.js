import { csrfFetch } from "./csrf";

// Action type constraints
export const LOAD_SPOTS = 'spots/LOAD_SPOTS'
export const LOAD_SINGLE_SPOT = 'spots/LOAD_SINGLE_SPOT';
export const CREATE_SPOT = '/spots/CREATE_SPOT'
export const LOAD_CURRENT_SPOTS = '/spots/LOAD_CURRENT_SPOTS'
export const DESTROY_SPOT = '/spots/DESTROY_SPOT'


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

export const destroySpot = (spotId) => ({
  type: DESTROY_SPOT,
  spotId
})

// export const loadCurrentSpots = (spots) => ({
//   type: LOAD_SPOTS,
//   spots,
// })


// Thunk action creators
export const postSpot = (spot) => async (dispatch) => {
  try {
    const response = await csrfFetch('/api/spots', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(spot),
    });

    if (response.ok) {
      const newSpot = await response.json();
      dispatch(createSpot(newSpot)); // Dispatch createSpot with the newly created spot
      dispatch(fetchSpot(newSpot.id)); // Assuming your API returns the created spot's ID in the response
      return newSpot
    } else {
      const errors = await response.json()
      console.log(errors)
      return errors;
    }
  } catch (error) {
    const errors = await error.json()
    console.log(errors)
    return errors;
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

export const fetchCurrentSpots = () => async (dispatch) => {
  const response = await csrfFetch('/api/spots/current');
  console.log(response)
  if (!response.ok) throw new Error ('Failed to fetch your properties')
  const data = await response.json();
  const currentSpots = data.Spots
  console.log(currentSpots)
  dispatch(loadSpots(currentSpots))
}

export const deleteSpot = (spotId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete spot');
    }
    dispatch(destroySpot(spotId));
  } catch (error) {
    console.error('Error deleting spot:', error);
  }
};



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
      case DESTROY_SPOT:
          return {
            ...state,
            spots: state.spots.filter((spot) => spot.id !== action.spotId),
          };
      default:
        return state;
    }
  };


export default spotsReducer;
