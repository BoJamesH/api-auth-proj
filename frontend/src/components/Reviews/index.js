import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { fetchReviews } from '../../store/reviews';

const ReviewsList = ({ spotId, spotOwnerId }) => {
  const dispatch = useDispatch();
  const reviews = useSelector((state) => state.reviewsState.reviews);
  const sessionUser = useSelector((state) => state.session.user);

  useEffect(() => {

    dispatch(fetchReviews(spotId));
  }, [dispatch, spotId]);

  // If reviews is empty or undefined, return null or any other fallback content
  if (!reviews || reviews.length === 0) {
    return <p>Be the first to post a review!</p>;
  }

  const postReviewClickHandler = async () => {
  }

  const userAlreadyReviewed = reviews.filter((review) => review.userId === sessionUser?.id);
  const isOwner = sessionUser?.id === spotOwnerId; // Replace 'spotOwnerId' with the ID of the spot owner

  return (
    <>
        <div className='PostReviewButton'>
            {/* Render the "Port Your Review" button conditionally */}
      {!userAlreadyReviewed && !isOwner && sessionUser && (
        <button onClick={postReviewClickHandler}>Post Your Review</button>
      )}
        </div>
      <div className="reviews-list">
        {reviews.map((review) => (
          <div key={review.id} className="review-item">
            <p className="user-name">{review.User.firstName}</p>
            <p className="review-date">{new Date(review.createdAt).toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
            <p className="star-rating">Star Rating: {review.stars}</p>
            <p className="review-text">{review.review}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default ReviewsList;
