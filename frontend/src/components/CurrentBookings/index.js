import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserBookings } from "../../store/bookings";
import { useHistory } from "react-router-dom";
import BookingDeleteModal from './BookingDeleteModal.js'
import './CurrentBookings.css'

const CurrentBookings = () => {
  const history = useHistory()
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user)
  const userBookings = useSelector((state) => state.bookingsState.userBookings.Bookings);
  const isLoading = useSelector((state) => state.spotsState.isLoading);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteBookingModal = (bookingToDelete) => {
    setBookingToDelete(bookingToDelete);
    openDeleteModal();
  };


  useEffect(() => {

    if (!sessionUser) {
      return;
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
      <div className="AllUserBookingsDiv">
        {userBookings &&
          userBookings
            .sort((a, b) => new Date(b.startDate) - new Date(a.startDate)) // Sort bookings by most recent first
            .map((booking) => {
              const currentDate = new Date();
              const startDate = new Date(booking.startDate);
              const endDate = new Date(booking.endDate);

              const isPastStartDate = currentDate > startDate;
              const isPastEndDate = currentDate > endDate;

              return (
                <div key={booking.id} className="UserBookingCardDiv">
                  <h3>{booking.Spot.name} Booking</h3>
                  <div className="UserBookingContent">
                    <img
                      className="UserBookingPreviewImg"
                      src={booking.Spot.previewImage}
                      alt="Spot Preview"
                    />
                    <ul className="UserBookingUl">
                    {isPastEndDate &&
                    <li className="UserBookingLi">
                      <span className="BookingCompleteSpan">
                        Booking Complete</span>
                        </li>}
                      <li className="UserBookingLi">
                        Start Date:{" "}
                        <span className="UserBookingLiPopulated">
                          {startDate.toLocaleDateString()}
                        </span>
                      </li>
                      <li className="UserBookingLi">
                        End Date:{" "}
                        <span className="UserBookingLiPopulated">
                          {endDate.toLocaleDateString()}
                        </span>
                      </li>
                      <li className="UserBookingLi">
                        Place:{" "}
                        <span className="UserBookingLiPopulated">
                          {booking.Spot.name}
                        </span>
                      </li>
                      <li className="UserBookingLi">
                        Address:{" "}
                        <span className="UserBookingLiPopulated">
                          {booking.Spot.address}
                        </span>
                      </li>
                      <li className="UserBookingLi">
                        Location:{" "}
                        <span className="UserBookingLiPopulated">
                          {booking.Spot.city}, {booking.Spot.state}
                        </span>
                      </li>
                      <span className="UserBookingButtonsSpan">
                          <>
                            <button
                            className="UserBookingUpdateButton"
                            hidden={isPastStartDate}>
                              Update Booking
                            </button>
                            <button
                              hidden={isPastStartDate}
                              className="UserBookingDeleteButton"
                              onClick={() =>
                                handleDeleteBookingModal(booking)
                              }
                            >
                              Delete Booking
                            </button>
                          </>
                      </span>
                    </ul>
                  </div>
                </div>
              );
            })}
      </div>
      {isDeleteModalOpen && (
        <BookingDeleteModal
          onClose={closeDeleteModal}
          onDelete={() => {
            handleDeleteBookingModal(bookingToDelete);
          }}
          bookingToDelete={bookingToDelete}
        />
      )}
    </div>
  );
}

export default CurrentBookings;
