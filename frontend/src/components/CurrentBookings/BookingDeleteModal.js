import React from "react";
import { useDispatch } from "react-redux";
import './BookingDeleteModal.css'

const BookingDeleteModal = ({ onClose, onDelete, bookingToDelete }) => {
  const dispatch = useDispatch();

  // const handleDeleteBooking = () => {
  //   // dispatch(deleteBooking(bookingToDelete));
  // };

  return (
    <div className="confirmationModal">
      <p className="deleteModalText">Are you sure you want to delete this booking?</p>
      <div className="modalButtons">
        <button className="YesButton"
          onClick={() => {
            // handleDeleteBooking();
            onClose();
          }}
        >
          Yes
        </button>
        <button className="NoButton" onClick={onClose}>No</button>
      </div>
    </div>
  );
};

export default BookingDeleteModal;
