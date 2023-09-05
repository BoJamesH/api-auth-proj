// frontend/src/components/CreateReviewModal/UpdateReviewModal.js
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ClickOutside from "./outsideClick";
import { editReview } from "../../store/reviews";
import "./CreateReviewModal.css"; // Update with your CSS file

function UpdateReviewModal({ showModal, setShowModal, reviewIdToUpdate, spotId }) {
  const dispatch = useDispatch();
  const reviews = useSelector(state => state.reviewsState.reviews);
  const reviewToUpdate = reviews.find(review => review.id === reviewIdToUpdate);
  const [reviewText, setReviewText] = useState(reviewToUpdate.review);
  const [starsSelected, setStarsSelected] = useState(true);
  const [selectedStars, setSelectedStars] = useState(reviewToUpdate.stars);
  const [starsNotSelected, setStarsNotSelected] = useState(false)

  useEffect(() => {
    setSelectedStars(reviewToUpdate.stars); // Set the initial selected stars
    handleClick(reviewToUpdate.stars - 1); // Trigger handleClick to populate stars
  }, [reviewToUpdate.stars]); // Add reviewToUpdate.stars as a dependency


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!starsSelected) {
      setStarsNotSelected(true)
      return;
    }
    const newReview = {
      review: reviewText,
      stars: selectedStars,
    }
    try {
      const response = await dispatch(editReview(reviewIdToUpdate, spotId, newReview))
    } catch (error) {
      console.log(error)
    }
    setShowModal(false);
  };

  const closeOnOutsideClick = () => {
    setShowModal(false);
  };


  const handleMouseOver = (starId) => {
    const stars = document.querySelectorAll(".ReviewFormStar");
    stars.forEach((star, index) => {
      if (index < selectedStars) {
        star.innerHTML = "★";
      } else if (index <= starId) {
        star.innerHTML = "★";
      } else {
        star.innerHTML = "☆";
      }
    });
  };

  const handleMouseOut = () => {
    // Reset the stars on mouseout
    const stars = document.querySelectorAll(".ReviewFormStar");
    stars.forEach((star, index) => {
      if (index < selectedStars) {
        star.innerHTML = "★";
      } else {
        star.innerHTML = "☆";
      }
    });
  };

  const handleClick = (starId) => {
    setStarsSelected(true)
    setStarsNotSelected(false)
    setSelectedStars(starId + 1);
    const stars = document.querySelectorAll(".ReviewFormStar");
    stars.forEach((star, index) => {
      if (index <= starId) {
        star.innerHTML = "★";
        star.classList.add("selected");
      } else {
        star.innerHTML = "☆";
        star.classList.remove("selected");
      }
    });
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
            <div className="CreateReviewStarRatingDiv">
                <p className="CreateReviewStarP">
                <span
                    className="ReviewFormStar"
                    id="star1"
                    onMouseOver={() => handleMouseOver(0)}
                    onMouseOut={handleMouseOut}
                    onClick={() => handleClick(0)}
                >
                    ☆
                </span>
                <span
                    className="ReviewFormStar"
                    id="star2"
                    onMouseOver={() => handleMouseOver(1)}
                    onMouseOut={handleMouseOut}
                    onClick={() => handleClick(1)}
                >
                    ☆
                </span>
                <span
                    className="ReviewFormStar"
                    id="star3"
                    onMouseOver={() => handleMouseOver(2)}
                    onMouseOut={handleMouseOut}
                    onClick={() => handleClick(2)}
                >
                    ☆
                </span>
                <span
                    className="ReviewFormStar"
                    id="star4"
                    onMouseOver={() => handleMouseOver(3)}
                    onMouseOut={handleMouseOut}
                    onClick={() => handleClick(3)}
                >
                    ☆
                </span>
                <span
                    className="ReviewFormStar"
                    id="star5"
                    onMouseOver={() => handleMouseOver(4)}
                    onMouseOut={handleMouseOut}
                    onClick={() => handleClick(4)}
                >
                    ☆
                </span>
                {" "}
                Stars
                </p>
            </div>
            {starsNotSelected && (
              <p className="starsError">Star rating is required.</p>
            )}
            <div className="CreateReviewSubmitButtonDiv">
                <button className="CreateReviewSubmitButton" type="submit">Update Review</button>
            </div>
        </form>
        </div>
        </ClickOutside>
    </>
  );
}

export default UpdateReviewModal;
