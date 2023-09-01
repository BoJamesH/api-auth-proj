import './SingleSpotPage.css';
import { useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpot } from '../../store/spots';
import ReviewsList from '../Reviews';

const SpotDetails = () => {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const spot = useSelector((state) => state.spotsState.singleSpot);
  const isLoading = useSelector((state) => state.spotsState.isLoading);
  const sessionUser = useSelector((state) => state.session.user)

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
            <span className='AllSmallSpotImages'>
              {[...Array(4)].map((_, index) => {
                const image = spot.SpotImages?.[index + 1];
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
            <div className="ContentAboveButton">
              <h2 className='ReservePricePerNight'>${spot.price.toFixed(2)}</h2><span className='PerNightReserveBox'> per night</span>
              <span className='RightSideReserveBox'>
              <span className='ReserveBoxStar'>★</span>
              <span className='ReserveAvgRating'></span>{spot.avgRating !== null && spot.avgRating ? `${parseFloat(spot.avgRating.toFixed(1))} · ${spot.numReviews} reviews` : 'New'}</span></div>
            <div className='ReserveButtonDiv'>
              {sessionUser === null && (
                <div className='ReserveNotLoggedIn'>You must be logged in to create a booking.</div>
              )}
            <button className='ReserveButton' hidden={sessionUser === null} onClick={() => history.push(`/spots/${spotId}/bookings`)}>Bookings</button>
            </div>
          </span>
          <div className='SpotDescription'>{spot.description}</div>
          <div className='ReviewInfoDiv'>
            <span className='StarsReviewsAboveReviewList'>
              <span className='AvgRating'>★ {spot.avgRating !== null && spot.avgRating ? `${parseFloat(spot.avgRating.toFixed(1))} · ${spot.numReviews} reviews` : 'New'}</span>
            </span>
          </div>
            <ReviewsList spotId={spotId} spotOwnerId={spot.ownerId} />
        </>
      ) : (
        <p>Spot data not found.</p>
      )}
    </div>
  );
};

export default SpotDetails;
