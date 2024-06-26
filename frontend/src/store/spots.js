import { csrfFetch } from "./csrf";


export const LOAD_SPOTS = 'spots/LOAD_SPOTS'
export const LOAD_SINGLE_SPOT = 'spots/LOAD_SINGLE_SPOT';
export const CREATE_SPOT = '/spots/CREATE_SPOT'
export const LOAD_CURRENT_SPOTS = '/spots/LOAD_CURRENT_SPOTS'
export const DESTROY_SPOT = '/spots/DESTROY_SPOT'
export const UPDATE_SPOT = '/spots/UPDATE_SPOT'
export const ADD_SPOT_IMAGES = '/spots/ADD_SPOT_IMAGES'
export const CLEAR_SPOT_STATE = '/spot/CLEAR_SPOT_STATE'


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
  spot,
})

export const destroySpot = (spotId) => ({
  type: DESTROY_SPOT,
  spotId,
})

export const loadCurrentSpots = (spots) => ({
  type: LOAD_CURRENT_SPOTS,
  spots,
})

export const editSpot = (spot) => ({
  type: UPDATE_SPOT,
  spot,
})

export const addSpotImages = (spotId, images) => ({
  type: ADD_SPOT_IMAGES,
  images
})

export const clearSpotState = () => ({
  type: CLEAR_SPOT_STATE,
})



export const postSpot = (spotImages, spot) => async (dispatch) => {
  if (spotImages.length < 1) return 'You must submit at least one image.'
  try {
    const response = await csrfFetch('/api/spots', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(spot),
    });

    if (response.ok) {
      const newSpot = await response.json();
      dispatch(postSpotImages(spotImages, newSpot.id))
      await dispatch(createSpot(newSpot));
      await dispatch(fetchSpot(newSpot.id));
      return newSpot
    }
  } catch (error) {
    const errors = await error.json()
    console.log(errors)
    return errors;
  }
};

export const postSpotImages = (spotImages, spotId) => async (dispatch) => {
  try {
    for (let spotImage of spotImages) {
      const response = await csrfFetch(`/api/spots/${spotId}/images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(spotImage),
      });
      // Handle response here if needed
    }
    await dispatch(fetchSpot(spotId));
  } catch (error) {
    console.error('Error updating or creating spot images:', error);
  }
};


export const fetchSpots = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots');
    if (!response.ok) throw new Error('Failed to fetch all properties');
    const data = await response.json();
    const allSpots = data.Spots
    await dispatch(loadSpots(allSpots));
};

export const fetchSpot = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`);
    if (!response.ok) throw new Error('Failed to fetch property')
    const spot = await response.json();
    await dispatch(loadSingleSpot(spot));
}

export const fetchCurrentSpots = () => async (dispatch) => {
  const response = await csrfFetch('/api/spots/current');
  if (!response.ok) throw new Error ('Failed to fetch your properties')
  const data = await response.json();
  const currentSpots = data.Spots
  await dispatch(loadCurrentSpots(currentSpots))
}

export const deleteSpot = (spotId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete spot');
    }
    await dispatch(destroySpot(spotId));
  } catch (error) {
    console.error('Error deleting spot:', error);
  }
};

export const updateSpot = (spotId, spot, spotImages) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(spot),
    });
    if (response.ok) {
      const newSpot = await response.json();
      await dispatch(postSpotImages(spotImages, spotId))
      await dispatch(fetchSpot(spotId))
      return newSpot
    }
    } catch (error) {
    const errors = await error.json()
    return errors;
  }
}

const initialState = {
  spots: [],
  currentSpots: [],
  singleSpot: null,
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
        singleSpot: action.spot,
        isLoading: false,
      };
    case CREATE_SPOT:
      return {
        ...state,
        spots: [...state.spots, action.spot],
        singleSpot: action.spot, 
        isLoading: false,
      };
    case LOAD_CURRENT_SPOTS:
      return {
        ...state,
        currentSpots: action.spots,
        isLoading: false,
      };
    case DESTROY_SPOT:
        return {
          ...state,
          spots: state.spots.filter((spot) => spot.id !== action.spotId),
          currentSpots: state.currentSpots.filter((spot) => spot.id !== action.spotId)
        };
    case UPDATE_SPOT:
      return {
        ...state,
      }
    case CLEAR_SPOT_STATE:
      return {
        initialState
      }
    default:
      return state;
  }
};


export default spotsReducer;
