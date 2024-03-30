import React from "react";
import { useDispatch } from "react-redux";
import { deleteSpot } from "../../../store/spots";
import './DeleteModal.css'

const ConfirmationModal = ({ onClose, onDelete, spotToDelete }) => {
  const dispatch = useDispatch();

  const handleDeleteSpot = () => {
    dispatch(deleteSpot(spotToDelete));
  };

  return (
    <div className="confirmationModal">
      <p className="deleteModalText">Are you sure you want to delete this spot?</p>
      <div className="modalButtons">
        <button className="YesButton"
          onClick={() => {
            handleDeleteSpot();
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

export default ConfirmationModal;
