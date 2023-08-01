
// Action type constraints
export const LOAD_SPOTS = 'spots/LOAD_SPOTS'
export const LOAD_SINGLE_SPOT = 'spots/LOAD_SINGLE_SPOT';


// Action creators

export const loadSpots = (spots) => ({
    type: LOAD_SPOTS,
    spots,
})

export const loadSingleSpot = (spot) => ({
    type: LOAD_SINGLE_SPOT,
    spot,
  });


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
      default:
        return state;
    }
  };


export default spotsReducer;
