import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserBookings } from "../../store/bookings";
import { useHistory } from "react-router-dom";
import './CurrentBookings.css'

const CurrentBookings = () => {
  const history = useHistory()
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user)
  const userBookings = useSelector((state) => state.bookingsState.userBookings.Bookings);
  // const userId = useSelector((state) => state.session.user.id);
  const isLoading = useSelector((state) => state.spotsState.isLoading);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [spotToDelete, setSpotToDelete] = useState(null);

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };


  useEffect(() => {

    if (!sessionUser) {
      return; // Don't make the request if the user is not logged in
    }
    const userId = sessionUser.id;
    dispatch(fetchUserBookings(parseInt(userId)));
  }, [dispatch, isLoading, sessionUser.id]);

  const handleUpdate = () => {
    console.log("Update button clicked");
  };

  if (userBookings && (userBookings.length < 1)) {
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
      <h2 className="UserBookingsTitle">Manage Your Bookings</h2>
      {/* <button className="CreateUserBookingButton">Create New Booking</button> */}
      <div className="AllUserBookingsDiv">
        {userBookings && userBookings.map(booking => (
          <div key={booking.id} className="UserBookingCardDiv">
            <h3>{booking.Spot.name} Booking</h3>
            <div className="UserBookingContent">
              <img className="UserBookingPreviewImg" src={booking.Spot.previewImage} alt="Spot Preview" />
              <ul className="UserBookingUl">
                <li className="UserBookingLi">Start Date: <span className="UserBookingLiPopulated">{new Date(booking.startDate).toLocaleDateString()}</span></li>
                <li className="UserBookingLi">End Date: <span className="UserBookingLiPopulated">{new Date(booking.endDate).toLocaleDateString()}</span></li>
                <li className="UserBookingLi">Place: <span className="UserBookingLiPopulated">{booking.Spot.name}</span></li>
                <li className="UserBookingLi">Address: <span className="UserBookingLiPopulated">{booking.Spot.address}</span></li>
                <li className="UserBookingLi">Location: <span className="UserBookingLiPopulated">{booking.Spot.city}, {booking.Spot.state}</span></li>
                <span className="UserBookingButtonsSpan">
                  <button className="UserBookingUpdateButton">Update Booking</button>
                  <button className="UserBookingDeleteButton">Delete Booking</button>

                </span>
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CurrentBookings;
