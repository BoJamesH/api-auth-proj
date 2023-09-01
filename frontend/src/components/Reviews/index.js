import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { fetchReviews } from '../../store/reviews';
import CreateReviewModal from '../CreateReviewModal';
import { useState } from 'react';
import './Reviews.css'
import ConfirmationReviewDeleteModal from './ConfirmationReviewDelete';
import UpdateReviewModal from '../CreateReviewModal/UpdateReviewModal.js'

const ReviewsList = ({ spotId, spotOwnerId }) => {
  const dispatch = useDispatch();
  const reviews = useSelector((state) => state.reviewsState.reviews);
  const sessionUser = useSelector((state) => state.session.user);
  const [showModal, setShowModal] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [reviewIdToUpdate, setReviewIdToUpdate] = useState(null)


  useEffect(() => {
    dispatch(fetchReviews(spotId));
  }, [dispatch, spotId]);

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

  const openUpdateModal = () => {
    setIsUpdateModalOpen(true);
  }

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
  }

  const handleUpdateReviewModal = (reviewId) => {
    setReviewIdToUpdate(reviewId);
    openUpdateModal();
  }



  const userAlreadyReviewed = reviews.filter((review) => review.userId === sessionUser?.id);
  const isOwner = sessionUser?.id === spotOwnerId;
  console.log(isOwner)

  return (
      <>
      {showModal && (
        <CreateReviewModal showModal={showModal} setShowModal={setShowModal} spotId={spotId} />
      )}
          <div className='PostReviewButtonDiv'>
          {(sessionUser === null) ? (
              <p className='NoLogin'>You must be logged in to create a review.</p>
            ) : (
              ((userAlreadyReviewed.length < 1 && !isOwner) || (reviews.length < 1 && !isOwner)) && (
                <button onClick={postReviewClickHandler} className='PostReviewButton'>Post Your Review</button>
              )
            )}
      </div>
        <div className="ReviewsList">
          {reviews.map((review, index) => (
            <div key={review.id} className={`ReviewItem ${index % 2 === 0 ? 'EvenReview' : 'OddReview'}`}>
              <div className="ReviewUsername">{review.User.firstName}</div>
              <div className="ReviewDate">{new Date(review.createdAt).toLocaleString('default', { month: 'long', year: 'numeric' })}</div>
              <div className="ReviewStarRating">
                Star Rating:
                {' '}
                {Array.from({ length: review.stars }).map((_, i) => (
                  <span key={i} className="StarIcon">★</span>
                ))}
              </div>
              <div className="ReviewText">{review.review}</div>
              {sessionUser?.id === review.userId ? (
                <div className="ButtonContainer">
                  <button className="UpdateReviewButton" onClick={() => handleUpdateReviewModal(review.id)}>Update</button>
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
                {isUpdateModalOpen && (
          <UpdateReviewModal
          showModal={isUpdateModalOpen}
          setShowModal={setIsUpdateModalOpen}
          reviewIdToUpdate={reviewIdToUpdate}
          spotId={spotId}
        />
        )}
      </div>
    </>
    )
};

export default ReviewsList;
