// frontend/src/components/CreateReviewModal/index.js
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import ClickOutside from "./outsideClick";
import "./CreateReviewModal.css"; // Update with your CSS file

function CreateReviewModal({ showModal, setShowModal }) {
  const dispatch = useDispatch();
  const [reviewText, setReviewText] = useState("");
  const [reviewStars, setReviewStars] = useState(0); // You can initialize this to any default value

  const handleSubmit = (e) => {
    e.preventDefault();
    // Dispatch your review submission action here
    setShowModal(false); // Close the modal after submitting
  };

  const closeOnOutsideClick = () => {
    setShowModal(false); // Close the modal on outside click
  };

  return (
    <>
        <ClickOutside onClickOutside={closeOnOutsideClick}>
        <div className="CreateReviewModal">
        <h2 className="ReviewTitle">How was your stay?</h2>
        <form onSubmit={handleSubmit}>
            <div className="ReviewTextDiv">
            <textarea
                className="CreateReviewTextarea"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Tell us about your experience!"
                required
                rows={6}
            />
            </div>
            <div className="StarRatingDiv">
            {/* Implement your star rating input component here */}
            </div>
            <div className="CreateReviewSubmitButtonDiv">
            <button className="CreateReviewSubmitButton" type="submit">Submit Review</button>
            </div>
        </form>
        </div>
        </ClickOutside>
    </>
  );
}

export default CreateReviewModal;
