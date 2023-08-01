import './SingleSpotPage.css';
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpot } from '../../store/spots';

const SpotDetails = () => {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const spot = useSelector((state) => state.spotsState.singleSpot);
  const isLoading = useSelector((state) => state.spotsState.isLoading);

  useEffect(() => {
    dispatch(fetchSpot(parseInt(spotId)));
  }, [dispatch, spotId]);

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
          <div className='HostedBy'>Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</div>
          <div className='SpotDescription'>{spot.description}</div>
        </>
      ) : (
        <p>Spot data not found.</p>
      )}
    </div>
  );
};

export default SpotDetails;
