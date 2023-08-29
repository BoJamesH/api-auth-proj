import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { fetchReviews } from '../../store/reviews';
import CreateReviewModal from '../CreateReviewModal';
import { useState } from 'react';
import './Reviews.css'
import ConfirmationReviewDeleteModal from './ConfirmationReviewDelete';

const ReviewsList = ({ spotId, spotOwnerId }) => {
  const dispatch = useDispatch();
  const reviews = useSelector((state) => state.reviewsState.reviews);
  const sessionUser = useSelector((state) => state.session.user);
  const [showModal, setShowModal] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);


  useEffect(() => {
    dispatch(fetchReviews(spotId));
  }, [dispatch, spotId]);

  // if (!reviews || reviews.length === 0) {
  //   return (
  //     <>
  //     <div className='PostReviewButtonDiv'>
  //       {(userAlreadyReviewed.length < 1 && !isOwner && sessionUser &&
  //       <button onClick={postReviewClickHandler} className='PostReviewButton'>Post Your Review</button>
  //     )}
  //     </div>
  //   <p className='NoReviews'>Be the first to post a review!</p>
  //   </>
  //   )
  // }

  const postReviewClickHandler = async () => {
    setShowModal(true)
  }

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteReviewModal = (reviewId) => {
    setReviewToDelete(reviewId);
    openDeleteModal();
  };

  const userAlreadyReviewed = reviews.filter((review) => review.userId === sessionUser?.id);
  const isOwner = sessionUser?.id === spotOwnerId;

  return (
      <>
      {showModal && (
        <CreateReviewModal showModal={showModal} setShowModal={setShowModal} spotId={spotId} />
      )}
          <div className='PostReviewButtonDiv'>
      {((userAlreadyReviewed.length < 1 && !isOwner) || (sessionUser && reviews.length < 1)) && (
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
            {sessionUser?.id === review.userId ? (
              <div className="ButtonContainer">
                <button className="UpdateReviewButton">Update</button>
                <button className="DeleteReviewButton" onClick={() => handleDeleteReviewModal(review.id)}>Delete</button>
              </div>
            ) : null}
          </div>
        ))}
        {isDeleteModalOpen && (
        <ConfirmationReviewDeleteModal
          onClose={closeDeleteModal}
          onDelete={() => {
            handleDeleteReviewModal(reviewToDelete);
          }}
          reviewToDelete={reviewToDelete}
          spotId={spotId}
        />
      )}
      </div>
    </>
    )
};

export default ReviewsList;
