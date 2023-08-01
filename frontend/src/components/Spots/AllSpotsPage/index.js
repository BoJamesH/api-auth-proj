import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SpotCard from "../SpotCard";
import { fetchSpots } from "../../../store/spots";
import './AllSpotsPage.css'

const AllSpots = () => {
  const dispatch = useDispatch();
  const spots = useSelector((state) => state.spotsState.spots);
  const isLoading = useSelector((state) => state.spotsState.isLoading);

  useEffect(() => {
    if (isLoading) {
      // Fetch spots only when isLoading is true
      dispatch(fetchSpots());
    }
  }, [dispatch, isLoading]);

  // Check if spots is still an empty array (initial state) or if it has spots data
  if (isLoading || spots.length === 0) {
    return <p>Loading spots...</p>;
  }

  return (
    <>
    <div className='spotCardGrid'>
      {spots.map(({ id }) => (
        <SpotCard key={id} spotId={id} /> // Pass the spot's id as a prop to the SpotCard component
      ))}
      </div>
    </>
  );
};

export default AllSpots;
