import React, { useState, useEffect } from "react";
import './CreateBooking.css'
import { useParams, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchSpot } from '../../store/spots';

const CreateBooking = ({ spotBookings, spotPricePerDay }) => {
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

    let conflict = false; // Declare conflict outside the if block

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

    // Check for date error
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

  const handleCreateBooking = () => {
    if (bookingConflict) {
      // Display conflict message with formatted dates
      const conflictStartDate = new Date(bookingConflict.startDate).toLocaleDateString();
      const conflictEndDate = new Date(bookingConflict.endDate).toLocaleDateString();
      console.log(`Booking Conflict: Previous Booking for ${conflictStartDate} - ${conflictEndDate}`);
    } else {
      // Implement your logic to create a new booking, including the price
      console.log("Create booking:", startDate, endDate, bookingPrice);
    }
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
        onClick={handleCreateBooking}
        disabled={bookingConflict !== null || dateError !== ""}
        className={(bookingConflict !== null || dateError !== "") ? "conflictButton" : "CreateBookingButton"}
      >
        Create Booking
      </button>
    </div>
    </>
  );
};

export default CreateBooking;
