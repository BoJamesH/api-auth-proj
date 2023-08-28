import './SingleSpotPage.css';
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpot } from '../../store/spots';
import ReviewsList from '../Reviews';

const SpotDetails = () => {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const spot = useSelector((state) => state.spotsState.singleSpot);
  const isLoading = useSelector((state) => state.spotsState.isLoading);
  console.log(spot)

  useEffect(() => {
    dispatch(fetchSpot(parseInt(spotId)));
  }, [dispatch, spotId, isLoading]);

  return (
    <div className='AllSpotDetails'>
      {isLoading ? (
        <p>Loading spot details...</p>
      ) : spot ? (
        <>
          <h2 className='SpotName'>{spot.name}</h2>
          <div className='CityStateCountry'>
            {spot.city}, {spot.state}, {spot.country}
          </div>
          <div className='SpotDetailsImageDiv'>
            <div className='LargeSpotImageDiv'>
              <img
                className='LargeSpotImage'
                src={spot.SpotImages?.[0]?.url || 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png'}
                alt="Large spot image"
              />
            </div>
            {/* Map through the rest of the images (up to four times) */}
            <span className='AllSmallSpotImages'>
              {[...Array(4)].map((_, index) => {
                const image = spot.SpotImages?.[index + 1]; // Get the corresponding image if available
                return (
                  <span className="SmallSpotImageDiv" key={index}>
                    <img
                      className='SmallSpotImage'
                      src={image?.url || 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png'}
                      alt={`Spot image ${index + 1}`}
                    />
                  </span>
                );
              })}
            </span>
          </div>
          {spot.Owner ? ( // Check if the spot has an Owner
            <div className='HostedBy'>Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</div>
          ) : (
            <span className='HostedBy'>Hosted by Unknown Owner</span>
          )}
          <span className='ReserveInfoBox'>
            <div className="contentAboveButton">
              <span className='ReservePricePerNight'>${spot.price} per night</span>
              <img className='starImg' src="https://png.pngtree.com/png-clipart/20201106/ourmid/pngtree-classic-black-stars-clipart-png-image_2395202.jpg" alt="Star icon" />
              {spot.avgRating} · {spot.numReviews} reviews</div>
            <div className='ReserveButtonDiv'>
              <button className='ReserveButton'>Reserve</button>
            </div>
          </span>
          <div className='SpotDescription'>{spot.description}</div>
          <div className='ReviewInfoDiv'><img className='StarImgReviews' src="https://png.pngtree.com/png-clipart/20201106/ourmid/pngtree-classic-black-stars-clipart-png-image_2395202.jpg" alt="Star icon" />
            {spot.avgRating} · <span className='ReviewNum'>{spot.numReviews} reviews </span></div>
            <ReviewsList spotId={spotId} spotOwnerId={spot.Owner.id} />
            {/* {console.log('ownerId and spotId: ' + spotOwnerId + spotId)} */}
        </>
      ) : (
        <p>Spot data not found.</p>
      )}
    </div>
  );
};

export default SpotDetails;
