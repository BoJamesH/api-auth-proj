import { csrfFetch } from "./csrf";
import { fetchSpot } from "./spots";

export const LOAD_REVIEWS = 'reviews/LOAD_REVIEWS'
export const CREATE_REVIEW = 'reviews/CREATE_REVIEW'
export const DELETE_REVIEW = 'reviews/DELETE_REVIEW'
export const UPDATE_REVIEW = 'reviews/UPDATE_REVIEW'
export const LOAD_USER_REVIEWS = 'reviews/LOAD_USER_REVIEWS'

export const loadReviews = (reviews) => ({
    type: LOAD_REVIEWS,
    reviews,
})

export const createReview = (review) => ({
  type: CREATE_REVIEW,
  review
})

export const deleteReview = (reviewId) => ({
  type: DELETE_REVIEW,
  reviewId
})

export const updateReview = (reviewId) => ({
  type: UPDATE_REVIEW,
  reviewId
})

export const loadUserReviews = (reviews) => ({
  type: LOAD_USER_REVIEWS,
  reviews
})

export const fetchReviews = (spotId) => async (dispatch) => {
    try {
      const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
      const data = await response.json();

      if (response.status === 404) {
        dispatch(loadReviews([]));
      } else if (!response.ok) {
        throw new Error('Failed to fetch the reviews for this property');
      } else {
        const spotReviews = data.Reviews.reverse();
        dispatch(loadReviews(spotReviews));
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
};

export const addReview = (review, spotId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review)
    })

    if (response.ok) {
      const newReview = await response.json();
      dispatch(fetchReviews(spotId));
      await dispatch(fetchSpot(spotId))
      return newReview;
    }
  } catch (error) {
    const errors = await error.json()
    console.log(errors);
    return errors;
  }
}

export const destroyReview = (reviewId, spotId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      const deletedReview = await response.json();
      dispatch(fetchReviews(spotId))
      await dispatch(fetchSpot(spotId))
      return deletedReview;
    }
  } catch (error) {
    const errors = await error.json();
    console.log(errors);
    return errors
  }
}

export const editReview = (reviewId, spotId, review) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(review)
    });

    if (response.ok) {
      const updatedReview = await response.json();
      dispatch(fetchReviews(spotId));
      await dispatch(fetchSpot(spotId))
      return updatedReview;
    }
  } catch (error) {
    const errors = await error.json();
    console.log(errors);
    return errors
  }
}

export const fetchUserReviews = (userId) => async (dispatch) => {
  try {
    const response = await csrfFetch('/api/reviews/current')
    const data = await response.json();

    if (response.status === 404) {
      dispatch(loadReviews([]));
    } else if (!response.ok) {
      throw new Error('Failed to fetch user reviews.');
    } else {
      const userReviews = data.Reviews;
      dispatch(loadUserReviews(userReviews));
    }
  } catch (error) {
    console.error('Error fetching reviews:', error);
  }
}


const initialState = {
    reviews: [],
    userReviews: [],
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
        case LOAD_USER_REVIEWS:
          return {
            ...state,
            userReviews: action.reviews,
            isLoading: false,
          };

      default:
        return state;
    }
}

export default reviewsReducer;
