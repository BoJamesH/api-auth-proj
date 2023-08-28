import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { fetchReviews } from '../../store/reviews';
import CreateReviewModal from '../CreateReviewModal';
import { useState } from 'react';
import './Reviews.css'

const ReviewsList = ({ spotId, spotOwnerId }) => {
  const dispatch = useDispatch();
  const reviews = useSelector((state) => state.reviewsState.reviews);
  const sessionUser = useSelector((state) => state.session.user);
  const [showModal, setShowModal] = useState(false); 


  useEffect(() => {

    dispatch(fetchReviews(spotId));
  }, [dispatch, spotId]);

  // If reviews is empty or undefined, return null or any other fallback content
  if (!reviews || reviews.length === 0) {
    return <p className='NoReviews'>Be the first to post a review!</p>;
  }

  const postReviewClickHandler = async () => {
    setShowModal(true)
  }

  const userAlreadyReviewed = reviews.filter((review) => review.userId === sessionUser?.id);
  const isOwner = sessionUser?.id === spotOwnerId;

  return (
    <>
      {showModal && (
        <CreateReviewModal showModal={showModal} setShowModal={setShowModal} />
      )}
      <div className='PostReviewButtonDiv'>
        {userAlreadyReviewed.length < 1 && !isOwner && sessionUser && (
        <button onClick={postReviewClickHandler} className='PostReviewButton'>Post Your Review</button>
      )}
      </div>
      <div className="ReviewsList">
        {reviews.map((review, index) => (
          <div key={review.id} className={`ReviewItem ${index % 2 === 0 ? 'EvenReview' : 'OddReview'}`}>
            <div className="ReviewUsername">{review.User.firstName}</div>
            <div className="ReviewDate">{new Date(review.createdAt).toLocaleString('default', { month: 'long', year: 'numeric' })}</div>
            <div className="ReviewStarRating">Star Rating: {review.stars}</div>
            <div className="ReviewText">{review.review}</div>
            {console.log(review.User)}
            {sessionUser.id === review.userId ? (
              <div className="ButtonContainer">
                <button className="UpdateButton">Update</button>
                <button className="DeleteButton">Delete</button>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </>
  );
};

export default ReviewsList;
