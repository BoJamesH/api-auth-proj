import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom"; 
import { fetchSpot } from "../../../store/spots";
import '../../CurrentSpots/CurrentSpots.css'

const SpotCard = ({ spotId }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const spot = useSelector((state) => state.spotsState.spots.find((spot) => spot.id === parseInt(spotId)));
  const isLoading = useSelector((state) => state.spotsState.isLoading);

  useEffect(() => {
    if (!isLoading && spotId && !spot) {
      dispatch(fetchSpot(spotId));
    }
  }, [dispatch, isLoading, spotId, spot]);

  const handleClick = () => {
    if (spot) {
      history.push(`/spots/details/${spot.id}`);
    }
  };

  return (
    <>
      {!isLoading && spot ? (
        <div className="customSpotCardDiv" title={spot.name} onClick={handleClick}>
          <div className="customSpotImgCard">
            <img
              className="customSpotImg"
              src={spot.previewImage || "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png"}
              alt={`Property with id of ${spot.id}`}
            />
          </div>
          <div className="customSpotLocationRatingDiv">
            {spot.city}, {spot.state}
            <div className="customStarsAndAvg">
              ★ {spot.avgRating ? (spot.avgRating.toFixed(1)) : 'New'}
            </div>
          </div>
          <span className="customPriceLine">
          <span className="customPrice">
            {spot && spot.price ? `$${parseFloat(spot.price.toFixed(2))}` : null}
          </span>
          <span className="customPerNight">per night</span>
          </span>

        </div>
      ) : (
        <p>Loading spot...</p>
      )}
    </>
  );
};

export default SpotCard;
