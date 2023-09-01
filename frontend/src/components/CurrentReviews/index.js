import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserReviews } from "../../store/reviews";
import { useHistory } from "react-router-dom";
import '../CurrentBookings/CurrentBookings.css'

const CurrentReviews = () => {
  const history = useHistory()
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user)
  const userReviews = useSelector((state) => state.reviewsState.userReviews);
  // const userId = useSelector((state) => state.session.user.id);
  const isLoading = useSelector((state) => state.spotsState.isLoading);
  console.log(userReviews)

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [spotToDelete, setSpotToDelete] = useState(null);


  useEffect(() => {

    if (!sessionUser) {
      return; // Don't make the request if the user is not logged in
    }
    const userId = sessionUser.id;

    dispatch(fetchUserReviews(parseInt(userId)));
  }, [dispatch, isLoading]);

  const handleUpdate = () => {
    console.log("Update button clicked");
  };

  if (userReviews && (userReviews.length < 1)) {
    return (
      <p>You have no bookings at this time.</p>
    )
  }

  if (!sessionUser) {
    return (
      <p className='NoUser'>You must be logged in to view your bookings.</p>
    )
  }

  return (
    <div>
      <h2 className="UserBookingsTitle">Manage Your Reviews</h2>
      {/* <button className="CreateUserBookingButton">Create New Booking</button> */}
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
                <li className="UserBookingLi">Address: <span className="UserBookingLiPopulated">{review.Spot.address}</span></li>
                <li className="UserBookingLi">Location: <span className="UserBookingLiPopulated">{review.Spot.city}, {review.Spot.state}</span></li>
                <span className="UserBookingButtonsSpan">
                  <button className="UserBookingUpdateButton">Update Review</button>
                  <button className="UserBookingDeleteButton">Delete Review</button>

                </span>
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CurrentReviews;
