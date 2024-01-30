import React, { useState, useEffect } from "react";
import './CreateBooking.css'
import { useParams, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchSpot } from '../../store/spots';
import { createBooking } from "../../store/bookings";

const CreateBooking = ({ spotBookings, spotPricePerDay }) => {
  // NOTE: ADD MODAL FOR CONFIRMATION OF BOOKING, THEN START ON UPDATE BOOKING
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [bookingPrice, setBookingPrice] = useState(0);
  const [bookingConflict, setBookingConflict] = useState(null);
  const [dateError, setDateError] = useState("");

  const { spotId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const spot = useSelector((state) => state.spotsState.singleSpot);
  const isLoading = useSelector((state) => state.spotsState.isLoading);
  const sessionUser = useSelector((state) => state.session.user);

  useEffect(() => {
    dispatch(fetchSpot(parseInt(spotId)));
  }, [dispatch, spotId, isLoading]);

  useEffect(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

    const totalBookingPrice = diffDays * spotPricePerDay;
    setBookingPrice(totalBookingPrice);

    let conflict = false;

    if (spotBookings) {
      conflict = spotBookings.some((booking) => {
        const bookingStart = new Date(booking.startDate);
        const bookingEnd = new Date(booking.endDate);

        // Check if there is any overlap between the selected dates and existing bookings
        return (
          (start >= bookingStart && start <= bookingEnd) ||
          (end >= bookingStart && end <= bookingEnd) ||
          (start <= bookingStart && end >= bookingEnd)
        );
      });
    }

    // Set the booking conflict state
    setBookingConflict(conflict ? spotBookings[0] : null);

    // Ensure at least two days grace period for bookings
    const today = new Date();
    const minimumStartDate = new Date(today);
    minimumStartDate.setDate(today.getDate() + 2);

    if (start < minimumStartDate) {
      setDateError("Start date must be at least two days from now");
    } else if (end < start) {
      setDateError("End date cannot be before the start date");
    } else {
      setDateError("");
    }
  }, [startDate, endDate, spotPricePerDay, spotBookings]);

  const handleCreateBooking = async (e, startDate, endDate, spotId) => {
    e.preventDefault();
    console.log("Create booking:", 'START DATE:', startDate, 'END DATE', endDate);
    const newBooking = {
      startDate: startDate,
      endDate: endDate,
    }
    try {
      const response = await dispatch(createBooking(newBooking, spotId))
      if (response.ok) {
        console.log('SUCCESS!!! Booking created.')
      }
    } catch (error) {
      console.log(error)
    }
    return
  };

  return (
    <>
    <div className='CityStateCountry'>
      {spot.city}, {spot.state}, {spot.country}
    </div>
    <div className='SpotDetailsImageDiv'>
      <div className='LargeSpotImageDiv'>
        <img
          className='LargeSpotImage'
          src={spot.SpotImages?.[0]?.url || 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png'}
          alt="Large spot image"
        />
      </div>
      <span className='AllSmallSpotImages'>
        {[...Array(4)].map((_, index) => {
          const image = spot.SpotImages?.[index + 1];
          return (
            <span className="SmallSpotImageDiv" key={index}>
              <img
                className='SmallSpotImage'
                src={image?.url || 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png'}
                alt={`Spot image ${index + 1}`}
              />
            </span>
          );
        })}
      </span>
    </div>
    <div className="CreateBookingForm">
      <h2>Create Booking</h2>
      <div className="CreateBookingDiv">
        <label htmlFor="startDate">Start Date:</label>
        <input
          className="StartDateInput"
          type="date"
          id="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>
      <div className="CreateBookingDiv">
        <label htmlFor="endDate">End Date:</label>
        <input
          className="EndDateInput"
          type="date"
          id="endDate"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      {dateError && (
        <div className="ErrorDiv">
          <p className="ErrorText">{dateError}</p>
        </div>
      )}
      {bookingConflict && (
        <div className="ConflictDiv">
          <p className="ConflictText">
            Booking Conflict: Property Currently Rented{" "}
            {new Date(bookingConflict.startDate).toLocaleDateString("en-US")} -{" "}
            {new Date(bookingConflict.endDate).toLocaleDateString("en-US")}
          </p>
        </div>
      )}

      <div>
        <p className="TotalPriceP">Total Price:  <span className="TotalPriceSpan">{isNaN(bookingPrice) ? "N/A" : `$${bookingPrice}`}</span></p>
      </div>
      <button
        onClick={(e) => handleCreateBooking(e, startDate, endDate, spot?.id)}
        disabled={bookingConflict !== null || dateError !== ""}
        className={(bookingConflict !== null || dateError !== "") ? "conflictButton" : "CreateBookingButton"}
      >
        Create Booking
      </button>
      {isSuccessModalOpen && (
        <div className="success-modal">
          <p>You are booked!</p>
          <button onClick={closeSuccessModal}>OK</button>
        </div>
      )}
    </div>
    </>
  );
};

export default CreateBooking;
