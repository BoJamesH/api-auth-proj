import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSpotBookings } from "../../store/bookings";
import { fetchSpot } from "../../store/spots";
import { useHistory, useParams } from "react-router-dom";
import './SpotBookings.css'

const SpotBookings = () => {
  const history = useHistory()
  const dispatch = useDispatch();
  const spotBookings = useSelector((state) => state.bookingsState.spotBookings.Bookings);
  console.log(spotBookings)
  const isLoading = useSelector((state) => state.spotsState.isLoading);
  const spotInQuestion = useSelector((state) => state.spotsState.singleSpot)
  const sessionUser = useSelector((state) => state.session.user);
  const { spotId } = useParams();
  const [ownerCatch, setOwnerCatch] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [spotToDelete, setSpotToDelete] = useState(null);
  console.log(spotBookings)

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchSpot(spotId));
      dispatch(fetchSpotBookings(parseInt(spotId)));
      if (spotInQuestion?.Owner.id === sessionUser.id) {
        setOwnerCatch(true);
      }
    };

    fetchData();
  }, [dispatch, spotId, sessionUser.id, spotInQuestion]);



  const handleUpdate = () => {
    console.log("Update button clicked");
  };

  if (spotInQuestion === null) {
    // Render loading or a placeholder while spotInQuestion is being fetched
    return <p>Loading...</p>;
  }

  if (spotBookings && (spotBookings.length < 1)) {
    return (
      <p>There are no current bookings for this property.</p>
    )
  }

  return (
    <div>
      <h2 className="SpotBookingsTitle">Bookings for {spotInQuestion ? spotInQuestion.name : null}</h2>
      {ownerCatch ? (
        <>
        <div className="AllSpotBookingsDiv">
        {spotBookings && spotBookings.map((booking, index) => (
          <div key={index} className="SpotBookingCardDiv">
            <h3>Booking {index + 1}</h3>
            <div className="SpotBookingContent">
              {/* <img className="SpotBookingPreviewImg" src={spotInQuestion?.SpotImages[0] || 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png'} alt="Spot Preview" /> */}

                <div className="SpotBookingLi">Start Date: <span className="SpotBookingLiPopulated">{new Date(booking.startDate).toLocaleDateString()}</span></div>
                <div className="SpotBookingLi">End Date: <span className="SpotBookingLiPopulated">{new Date(booking.endDate).toLocaleDateString()}</span></div>
                <div className="SpotBookedBy">Booked by: </div>
                <div className="SpotBookingLi">{booking.User.firstName} {booking.User.lastName}</div>
                <span className="SpotBookingOwnerButtons">
                    <button className="SpotBookingContactUser">CONTACT USER</button>
                    <button className="SpotBookingCancel">CANCEL BOOKING</button>
                </span>
                {/* <li className="SpotBookingLi">Place: <span className="SpotBookingLiPopulated">{booking.Spot.name}</span></li>
                <li className="SpotBookingLi">Address: <span className="SpotBookingLiPopulated">{booking.Spot.address}</span></li>
                <li className="SpotBookingLi">Location: <span className="SpotBookingLiPopulated">{booking.Spot.city}, {booking.Spot.state}</span></li> */}
                {/* <span className="SpotBookingButtonsSpan">
                  <button className="SpotBookingUpdateButton">Update Booking</button>
                  <button className="SpotBookingDeleteButton">Delete Booking</button>
                </span> */}

            </div>
          </div>
        ))}
      </div>
        </>
        ) : (
      <div className="AllSpotBookingsDiv">
        {spotBookings && spotBookings.map((booking, index) => (
          <div key={index} className="SpotBookingCardDiv">
            <h3>Booking {index + 1}</h3>
            <div className="SpotBookingContent">
              {/* <img className="SpotBookingPreviewImg" src={spotInQuestion?.SpotImages[0] || 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png'} alt="Spot Preview" /> */}

                <div className="SpotBookingLi">Start Date: <span className="SpotBookingLiPopulated">{new Date(booking.startDate).toLocaleDateString()}</span></div>
                <div className="SpotBookingLi">End Date: <span className="SpotBookingLiPopulated">{new Date(booking.endDate).toLocaleDateString()}</span></div>
                {/* <li className="SpotBookingLi">Place: <span className="SpotBookingLiPopulated">{booking.Spot.name}</span></li>
                <li className="SpotBookingLi">Address: <span className="SpotBookingLiPopulated">{booking.Spot.address}</span></li>
                <li className="SpotBookingLi">Location: <span className="SpotBookingLiPopulated">{booking.Spot.city}, {booking.Spot.state}</span></li> */}
                {/* <span className="SpotBookingButtonsSpan">
                  <button className="SpotBookingUpdateButton">Update Booking</button>
                  <button className="SpotBookingDeleteButton">Delete Booking</button>
                </span> */}

            </div>
          </div>
        ))}
      </div>
        )}
    </div>
  );
}

export default SpotBookings;
