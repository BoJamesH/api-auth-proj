import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SpotCard from "../SpotCard";
import { fetchSpots } from "../../../store/spots";
import './AllSpotsPage.css';

const AllSpots = () => {
  const dispatch = useDispatch();
  const spots = useSelector((state) => state.spotsState.spots);
  const isLoading = useSelector((state) => state.spotsState.isLoading);

  useEffect(() => {
    // Always dispatch the fetchSpots action
    dispatch(fetchSpots());
  }, [dispatch]);

  if (isLoading) {
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
