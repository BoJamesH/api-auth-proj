
// Action type constraints
export const LOAD_SPOTS = 'spots/LOAD_SPOTS'
export const RECEIVE_SPOT = 'spots/RECEIVE_SPOT'


// Action creators

export const loadSpots = (spots) => ({
    type: LOAD_SPOTS,
    spots,
})

export const receiveSpot = (spot) => ({
    type: RECEIVE_SPOT,
    spot,
})


// Thunk action creators

export const fetchSpots = () => async (dispatch) => {
    const response = await fetch('/api/spots');
    if (!response.ok) throw new Error('Failed to fetch all spots');
    const data = await response.json();
    const allSpots = data.Spots
    console.log('Spots', allSpots)
    dispatch(loadSpots(allSpots));
};

export const fetchSpot = (spotId) => async (dispatch) => {
    const response = await fetch(`/api/spots/${spotId}`);
    if (!response.ok) throw new Error('Failed to fetch spot')
    const spot = await response.json();
    console.log(spot)
    dispatch(receiveSpot(spot));
}

// Reducer

const initialState = { spots: [], isLoading: true };

const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_SPOTS:
      return {
        ...state,
        spots: action.spots, // Save all spots into the 'spots' array
        isLoading: false,
      };
    case RECEIVE_SPOT:
      return {
        ...state,
        spots: [...state.spots, action.spot], // Add the received spot to the 'spots' array
        isLoading: false,
      };
    default:
      return state;
  }
};

export default spotsReducer;
