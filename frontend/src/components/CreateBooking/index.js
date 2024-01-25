import React, { useState } from "react";

const CreateBooking = ({ spotOwner, spotBookings }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Your logic for preventing overlapping bookings goes here

  const handleCreateBooking = () => {
    // Implement your logic to create a new booking
    console.log("Create booking:", startDate, endDate);
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
      <button onClick={handleCreateBooking}>Create Booking</button>
    </div>
  );
};

export default CreateBooking;
