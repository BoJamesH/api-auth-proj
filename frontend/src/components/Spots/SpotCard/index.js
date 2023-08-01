import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom"; // Import useHistory hook
import { fetchSpot } from "../../../store/spots";
import './SpotCard.css';

const SpotCard = ({ spotId }) => {
  const dispatch = useDispatch();
  const history = useHistory(); // Get the history object
  const spot = useSelector((state) => state.spotsState.spots.find((spot) => spot.id === parseInt(spotId)));
  const isLoading = useSelector((state) => state.spotsState.isLoading);

  useEffect(() => {
    // Dispatch the fetchSpot action when the component mounts and 'spotId' is available
    if (!isLoading && spotId && !spot) {
      dispatch(fetchSpot(spotId));
    }
  }, [dispatch, isLoading, spotId, spot]);

  // Handle clicking on the SpotCard to navigate to the spot page
  const handleClick = () => {
    if (spot) {
      history.push(`/spots/details/${spot.id}`);
    }
  };

  // Render the single spot
  return (
    <>
      {!isLoading && spot ? (
        <div className="spotCard" title={spot.name} onClick={handleClick}> {/* Add the onClick handler */}
          <div className="spotImgCard">
            <img
              className="imgCard"
              src={spot.previewImage || "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png"}
              alt={`Property with id of ${spot.id}`}
            />
          </div>
          <div className="locationRatingCard">
            {spot.city}, {spot.state} <div className="starsAndAvg"><img className='starImg' src="https://png.pngtree.com/png-clipart/20201106/ourmid/pngtree-classic-black-stars-clipart-png-image_2395202.jpg" alt="Star icon" /> {spot.avgRating}</div>
          </div>
          <span className="priceLine"><span className="price">${spot.price}</span>  night</span>
        </div>
      ) : (
        <p>Loading spot...</p>
      )}
    </>
  );
};

export default SpotCard;
