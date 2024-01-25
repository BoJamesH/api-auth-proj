import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSpotBookings } from "../../store/bookings";
import { fetchSpot } from "../../store/spots";
import CreateBooking from "../CreateBooking";
import { useHistory, useParams } from "react-router-dom";
import './SpotBookings.css';

const SpotBookings = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const spotBookings = useSelector((state) => state.bookingsState.spotBookings.Bookings);
  const isLoading = useSelector((state) => state.spotsState.isLoading);
  const spotInQuestion = useSelector((state) => state.spotsState.singleSpot);
  const sessionUser = useSelector((state) => state.session.user);
  const { spotId } = useParams();
  const [ownerCatch, setOwnerCatch] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [spotToDelete, setSpotToDelete] = useState(null);
  const spotInQuestionMemoized = useMemo(() => spotInQuestion, [spotInQuestion]);

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (spotId && sessionUser.id && !spotInQuestion) {
        await dispatch(fetchSpot(spotId));
      }

      if (spotId) {
        dispatch(fetchSpotBookings(parseInt(spotId)));
      }

      if (spotInQuestion?.Owner.id === sessionUser.id) {
        setOwnerCatch(true);
      }
    };

    fetchData();
  }, [spotId, sessionUser.id, spotInQuestion]);

  const handleUpdate = () => {
    console.log("Update button clicked");
  };

  if (spotInQuestion === null) {
    return <p>Loading...</p>;
  }

  if (spotBookings && spotBookings.length < 1) {
    return (
      <p>There are no current bookings for this property.</p>
    );
  }

  return (
    <div>
      <h2 className="SpotBookingsTitle">Bookings for {spotInQuestion ? spotInQuestion.name : null}</h2>
      {ownerCatch && <p className="OwnerP">You Own This Property</p>}
      {ownerCatch ? (
        <>
          <div className="AllSpotBookingsDiv">
            {spotBookings && spotBookings.map((booking, index) => (
              <div key={index} className="SpotBookingCardDiv">
                <h3>Booking {index + 1}</h3>
                <div className="SpotBookingContent">
                  <div className="SpotBookingLi">Start Date: <span className="SpotBookingLiPopulated">{new Date(booking.startDate).toLocaleDateString()}</span></div>
                  <div className="SpotBookingLi">End Date: <span className="SpotBookingLiPopulated">{new Date(booking.endDate).toLocaleDateString()}</span></div>
                  <div className="SpotBookedBy">Booked by: </div>
                  <div className="SpotBookingLi">{booking.User.firstName} {booking.User.lastName}</div>
                  <span className="SpotBookingOwnerButtons">
                    <button className="SpotBookingContactUser">CONTACT USER</button>
                    <button className="SpotBookingCancel">CANCEL BOOKING</button>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <CreateBooking spotOwner={spotInQuestion.Owner} spotBookings={spotBookings} />
        // <div className="AllSpotBookingsDiv">
        //   {spotBookings && spotBookings.map((booking, index) => (
        //     <div key={index} className="SpotBookingCardDiv">
        //       <h3>Booking {index + 1}</h3>
        //       <div className="SpotBookingContent">
        //         <div className="SpotBookingLi">Start Date: <span className="SpotBookingLiPopulated">{new Date(booking.startDate).toLocaleDateString()}</span></div>
        //         <div className="SpotBookingLi">End Date: <span className="SpotBookingLiPopulated">{new Date(booking.endDate).toLocaleDateString()}</span></div>
        //       </div>
        //     </div>
        //   ))}
        // </div>
      )}
    </div>
  );
}

export default SpotBookings;
