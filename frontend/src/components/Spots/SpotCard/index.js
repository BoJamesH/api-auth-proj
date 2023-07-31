import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSpot } from "../../../store/spots";
import './SpotCard.css'

const SpotCard = ({ spotId }) => {
  const dispatch = useDispatch();
  const spot = useSelector((state) => state.spotsState.spots.find((spot) => spot.id === parseInt(spotId)));
  const isLoading = useSelector((state) => state.spotsState.isLoading);

  useEffect(() => {
    // Dispatch the fetchSpot action when the component mounts and 'spotId' is available
    if (!isLoading && spotId && !spot) {
      dispatch(fetchSpot(spotId));
    }
  }, [dispatch, isLoading, spotId, spot]);

  // Render the single spot
  return (
    <>
      {!isLoading && spot ? (
        <div className="spotCard">
          <div className="spotImgCard">
            {/* Use the spot.previewImage if available, otherwise use the backup URL */}
            <img
              className="imgCard"
              src={spot.previewImage || "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png"}
              alt={`Property with id of ${spot.id}`}
            />
          </div>
          <div className="locationRatingCard">
            {spot.city}, {spot.state} StarImgPlaceholder {spot.avgRating}
          </div>
          <div className="priceCard">${spot.price} night</div>
        </div>
      ) : (
        <p>Loading spot...</p>
      )}
    </>
  );
};

export default SpotCard;
