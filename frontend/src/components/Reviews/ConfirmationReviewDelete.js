import React from "react";
import { useDispatch } from "react-redux";
import { destroyReview } from "../../store/reviews";
import '../CurrentSpots/DeleteModal/DeleteModal.css'

const ConfirmationReviewDeleteModal = ({ onClose, onDelete, reviewToDelete, spotId }) => {
  const dispatch = useDispatch();

  const handleDeleteReview = () => {
    dispatch(destroyReview(reviewToDelete, spotId));
  };

  return (
    <div className="confirmationModal">
      <p>Are you sure you want to delete this review?</p>
      <div className="modalButtons">
        <button className="YesButton"
          onClick={() => {
            handleDeleteReview(); // Call the handleDeleteSpot function to trigger the thunk
            onClose(); // Close the modal
          }}
        >
          Yes
        </button>
        <button className="NoButton" onClick={onClose}>No</button>
      </div>
    </div>
  );
};

export default ConfirmationReviewDeleteModal;
