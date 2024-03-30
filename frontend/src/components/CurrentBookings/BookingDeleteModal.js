import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteBooking } from "../../store/bookings";
import './BookingDeleteModal.css'

const BookingDeleteModal = ({ onClose, onDelete, bookingToDelete }) => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.session.user.id)

  const handleDeleteBooking = () => {
    dispatch(deleteBooking(bookingToDelete, userId));
  };

  return (
    <div className="confirmationModal">
      <p className="deleteModalText">Are you sure you want to delete this booking?</p>
      <div className="modalButtons">
        <button className="YesButton"
          onClick={() => {
            handleDeleteBooking();
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
