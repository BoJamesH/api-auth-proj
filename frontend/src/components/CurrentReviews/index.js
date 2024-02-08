import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserReviews } from "../../store/reviews";
import { useHistory } from "react-router-dom";
import ConfirmationReviewDeleteModal from "../Reviews/ConfirmationReviewDelete";
import UpdateReviewModal from "../CreateReviewModal/UpdateReviewModal";
import '../CurrentBookings/CurrentBookings.css'

const CurrentReviews = () => {
  const history = useHistory()
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user)
  const userReviews = useSelector((state) => state.reviewsState.userReviews);
  const isLoading = useSelector((state) => state.spotsState.isLoading);
  const [showModal, setShowModal] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [reviewIdToUpdate, setReviewIdToUpdate] = useState(null)
  const [spotId, setSpotId] = useState(null)


  useEffect(() => {

    if (!sessionUser) {
      return;
    }
    const userId = sessionUser.id;

    dispatch(fetchUserReviews(parseInt(userId)));
  }, [dispatch, isLoading]);

  const handleUpdate = () => {
    console.log("Update button clicked");
  };

  if (userReviews && (userReviews.length < 1)) {
    return (
      <p>You have no reviews at this time.</p>
    )
  }

  if (!sessionUser) {
    return (
      <p className='NoUser'>You must be logged in to view your reviews.</p>
    )
  }

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteReviewModal = (reviewId, spotId) => {
    setReviewToDelete(reviewId);
    openDeleteModal();
    setSpotId(spotId);
  };

  const openUpdateModal = () => {
    setIsUpdateModalOpen(true);
  }

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
  }

  const handleUpdateReviewModal = (reviewId, spotId) => {
    setReviewIdToUpdate(reviewId);
    openUpdateModal();
    setSpotId(spotId);
  };

  return (
    <div>
      <h2 className="UserBookingsTitle">Manage Your Reviews</h2>
      <div className="AllUserBookingsDiv">
        {userReviews && userReviews.map(review => (
          <div key={review.id} className="UserBookingCardDiv">
            <h3>{review.Spot.name} Review</h3>
            <div className="UserBookingContent">
              <img className="UserBookingPreviewImg" src={review.Spot.previewImage} alt="Spot Preview" />
              <ul className="UserBookingUl">
                <li className="UserBookingLi">Created: <span className="UserBookingLiPopulated">{new Date(review.createdAt).toLocaleDateString()}</span></li>
                <li className="UserBookingLi">Stars: <span className="UserBookingLiPopulated">{review.stars}</span></li>
                <li className="UserBookingLi">Review: <span className="UserBookingLiPopulated">{review.review}</span></li>
                <span className="UserBookingButtonsSpan">
                    <button
                    className="UpdateReviewButton"
                    disabled={true}
                    onClick={() => handleUpdateReviewModal(review.id, review.Spot.id)}
                    >
                    Update
                    </button>
                    <button
                    className="DeleteReviewButton"
                    onClick={() => handleDeleteReviewModal(review.id, review.Spot.id)}
                    >
                    Delete
                    </button>
                </span>
              </ul>
            </div>
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
    </div>
  );
}

export default CurrentReviews;
