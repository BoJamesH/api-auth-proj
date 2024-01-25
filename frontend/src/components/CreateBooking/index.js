import React, { useState, useEffect } from "react";

const CreateBooking = ({ spotBookings, spotPricePerDay }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [bookingPrice, setBookingPrice] = useState(0);
  const [bookingConflict, setBookingConflict] = useState(null);

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
    <div className="CreateBookingForm">
      <h2>Create Booking</h2>
      <div>
        <label htmlFor="startDate">Start Date:</label>
        <input
          type="date"
          id="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="endDate">End Date:</label>
        <input
          type="date"
          id="endDate"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      {bookingConflict && (
        <div>
          <p>Booking Conflict: Previous Booking for {bookingConflict.startDate} - {bookingConflict.endDate}</p>
        </div>
      )}
      <div>
        <p>Total Price: {isNaN(bookingPrice) ? "N/A" : `$${bookingPrice}`}</p>
      </div>
      <button onClick={handleCreateBooking}>Create Booking</button>
    </div>
  );
};

export default CreateBooking;
