import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentSpots } from "../../store/spots";
import { deleteSpot } from "../../store/spots";
import ConfirmationModal from "./DeleteModal/index.js";
import "./CurrentSpots.css";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

const CurrentSpots = () => {
  const history = useHistory()
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user)
  const spots = useSelector((state) => state.spotsState.currentSpots);
  const isLoading = useSelector((state) => state.spotsState.isLoading);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [spotToDelete, setSpotToDelete] = useState(null);

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };


  useEffect(() => {
    if (!sessionUser) {
      return;
    }

    if (spots.length === 0) {
      dispatch(fetchCurrentSpots());
    }
  }, [dispatch, isLoading, sessionUser]);

  const handleUpdate = () => {
    console.log("Update button clicked");
  };

  const handleDeleteSpotModal = (spotId) => {
    setSpotToDelete(spotId);
    openDeleteModal();
  };

  if (!sessionUser) {
    return (
      <p className='NoUser'>You must be logged in to view your properties.</p>
    )
  }

  return (
    <div className="currentSpots">
      <div className="CurrentTitleCreateButtonDiv">
      <h2>Manage Your Properties</h2>
      <Link to='/spots/new'>
      <button className="CurrentCreateSpotButton">List a New Property</button>
      </Link>
      </div>
      {isLoading ? (
        <p className="CurrentLoading">Loading properties...</p>
      ) : spots.length > 0 ? (
        <div className="spotCardGrid">
          {spots.map((spot) => (
            <div key={spot.id}
              className="customSpotCardDiv">
              <img
                className="customSpotImg"
                src={spot.previewImage || "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png"}
                alt={`Property with id of ${spot.id}`}
                onClick={() => {
                history.push(`/spots/details/${spot.id}`);
              }}
              />
              <div className="customSpotLocationRatingDiv">
                {spot.city}, {spot.state}
                <div className="customStarsAndAvg"
                  onClick={() => {history.push(`/spots/details/${spot.id}`)}}>
                  <img className="customStarImg" src="https://png.pngtree.com/png-clipart/20201106/ourmid/pngtree-classic-black-stars-clipart-png-image_2395202.jpg" alt="Star icon" />
                  {spot.avgRating && spot.avgRating !== 'New' ? spot.avgRating.toFixed(1) : 'New'}
                </div>
              </div>
              <span className="customPriceLine">
                <span className="customPrice">${spot.price.toFixed(2)}</span><span className="customPerNight">per night</span>
              </span>
              <div className="UpdateDeleteButtonsDiv">
              <button className="CurrentBookingsButton CurrentButtons" onClick={() => {
                  history.push(`/spots/${spot.id}/bookings`)
                }}>
                  Bookings
                </button>
                <button className="UpdateButton CurrentButtons" onClick={() => {
                  history.push(`/spots/${spot.id}/edit`)
                }}>
                  Update
                </button>
                <button className="DeleteButton CurrentButtons" onClick={() => handleDeleteSpotModal(spot.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
          {isDeleteModalOpen && (
        <ConfirmationModal
          onClose={closeDeleteModal}
          onDelete={() => {
            handleDeleteSpotModal(spotToDelete);
          }}
          spotToDelete={spotToDelete}
        />
      )}
        </div>
      ) : (
        <p className="CurrentNoProperties">You don't have any properties.</p>
      )}
    </div>
  );
};

export default CurrentSpots;
