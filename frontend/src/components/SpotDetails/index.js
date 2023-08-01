
import './SingleSpotPage.css'
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
        {isLoading ? ( // Check if data is loading
          <p>Loading spot details...</p>
        ) : spot ? (
          <>
            <h2 className='SpotName'>{spot.name}</h2>
            <div className='CityStateCountry'>
              {spot.city}, {spot.state}, {spot.country}
            </div>
            <div className='LargeSpotImage'><img src={spot.SpotImages[0] || 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png'}></img></div>
            <div className='SpotDescription'>{spot.description}</div>
          </>
        ) : (
          <p>Spot data not found.</p>
        )}
      </div>
    );


}

export default SpotDetails;
