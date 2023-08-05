import { csrfFetch } from "./csrf";

export const LOAD_REVIEWS = 'reviews/LOAD_REVIEWS'

export const loadReviews = (reviews) => ({
    type: LOAD_REVIEWS,
    reviews,
})

export const fetchReviews = (spotId) => async (dispatch) => {
    try {
      const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
      const data = await response.json();

      if (response.status === 404) {
        // If the response status is 404, it means there are no reviews for this spot
        // In this case, we update the state with an empty reviews array
        dispatch(loadReviews([]));
      } else if (!response.ok) {
        // If the response status is not 404 but there's an error, throw an error to handle it
        throw new Error('Failed to fetch the reviews for this property');
      } else {
        // If the response is successful and has reviews, dispatch the reviews to the state
        const spotReviews = data.Reviews;
        dispatch(loadReviews(spotReviews));
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
};


const initialState = {
    reviews: [],
    isLoading: true,
};

const reviewsReducer = (state = initialState, action) => {
    switch (action.type) {
      case LOAD_REVIEWS:
        return {
          ...state,
          reviews: action.reviews,
          isLoading: false,
        };
      default:
        return state;
    }
}

export default reviewsReducer;
