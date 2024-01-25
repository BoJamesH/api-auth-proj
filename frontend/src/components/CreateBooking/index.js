import React, { useState, useEffect } from "react";

const CreateBooking = ({ spotBookings, spotPricePerDay }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [bookingPrice, setBookingPrice] = useState(0);

  useEffect(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));


    const totalBookingPrice = diffDays * spotPricePerDay;
    setBookingPrice(totalBookingPrice);
  }, [startDate, endDate, spotPricePerDay]);

  const handleCreateBooking = () => {
    // Implement your logic to create a new booking, including the price
    console.log("Create booking:", startDate, endDate, bookingPrice);
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
      <div>
        <p>Total Price: ${bookingPrice}</p>
      </div>
      <button onClick={handleCreateBooking}>Create Booking</button>
    </div>
  );
};

export default CreateBooking;
