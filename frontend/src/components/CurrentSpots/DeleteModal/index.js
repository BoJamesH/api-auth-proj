import { useDispatch } from "react-redux";
import { deleteSpot } from "../../../store/spots";


const ConfirmationModal = ({ onClose, onDelete, spotToDelete }) => {
    const dispatch = useDispatch();

    const handleDeleteSpot = () => {
      // Call the deleteSpot thunk here with the spotToDelete ID
      dispatch(deleteSpot(spotToDelete));
    };

    return (
      <div className="confirmationModal">
        <p>Are you sure you want to delete this spot?</p>
        <div className="modalButtons">
          <button
            onClick={() => {
              handleDeleteSpot(); // Call the handleDeleteSpot function to trigger the thunk
              onClose(); // Close the modal
            }}
          >
            Yes
          </button>
          <button onClick={onClose}>No</button>
        </div>
      </div>
    );
  };

export default ConfirmationModal
