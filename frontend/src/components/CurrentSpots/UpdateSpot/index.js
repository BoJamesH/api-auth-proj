import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateSpot } from '../../../store/spots';
import { postSpot } from '../../../store/spots';
import { useHistory, useParams } from 'react-router-dom';
import './UpdateSpot.css';
import { useEffect } from 'react';
import { fetchSpot } from '../../../store/spots';
import { fetchCurrentSpots } from '../../../store/spots';

const UpdateSpot = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { spotId } = useParams();
  const spotToUpdate = useSelector((state) => state.spotsState.singleSpot);
  const isLoading = useSelector((state) => state.spotsState.isLoading);

  useEffect(() => {
    dispatch(fetchSpot(parseInt(spotId)));
  }, [dispatch, spotId]);

  // Form state
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [errors, setErrors] = useState({});
  const [imageUrls, setImageUrls] = useState(['', '', '', '', '']);

  useEffect(() => {
    if (spotToUpdate) {
      setAddress(spotToUpdate.address || '');
      setCity(spotToUpdate.city || '');
      setState(spotToUpdate.state || '');
      setCountry(spotToUpdate.country || '');
      setLat(spotToUpdate.lat || '');
      setLng(spotToUpdate.lng || '');
      setName(spotToUpdate.name || '');
      setDescription(spotToUpdate.description || '');
      setPrice(spotToUpdate.price || '');
      setImageUrls(spotToUpdate.SpotImages.map((image) => image.url) || ['', '', '', '', '']);
    }
  }, [spotToUpdate]);

  const handleAddImageUrl = (e, index) => {
    const newImageUrl = e.target.value;
    setImageUrls((prevImageUrls) => {
      const updatedImageUrls = [...prevImageUrls];
      updatedImageUrls[index] = newImageUrl;
      return updatedImageUrls;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newSpot = {
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
      SpotImages: imageUrls,
    };
    try {
      const response = await dispatch(updateSpot(spotId, newSpot));
      await dispatch(fetchCurrentSpots());

      const newSpotId = response.id;

      if (newSpotId) {
        setErrors({});
        history.push(`/spots/details/${spotId}`);
      } else {
        setErrors(response.errors);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        console.error("Error creating spot:", error);
      }
    }
  };



  useEffect(() => {},[errors, useState])
  // useEffect(() => {
  //   setErrors(null);
  // }, [address, city, state, country, lat, lng, name, description, price, imageUrls]);

  console.log(errors)

  if (isLoading) {
    return <p>Loading your property...</p>;
  } else if (!spotToUpdate) {
    return <p>Spot data not found.</p>;
  }

  return (
    <>
    <div className='form-intro'>
      <h2>Update Your Property</h2>
      <h4>Where's your place located?</h4>
      <p>Guests will only get your exact address once they've booked a reservation.</p>
    </div>
    <div className='spot-form-div'>
    <form noValidate={true} className="spot-form" onSubmit={handleSubmit}>
    <div className='form-group'>
      <label>
        Country:
      </label>
        <input className='form-field' type="text" value={country} onChange={(e) => setCountry(e.target.value)}  />
        <div className='CreateFormErrors'>
        {errors.country && (<p>{errors.country}</p>)}
      </div>
      </div>
    <div className='form-group'>
      <label>
        Address:
      </label>
        <input className='form-field' type="text" value={address} onChange={(e) => setAddress(e.target.value)}  />
        <div className='CreateFormErrors'>
        {errors.address && (<p>{errors.address}</p>)}
      </div>
      </div>
      <div className='form-group-block'>
      <label>
        City:
      </label>
        <input className='form-field' type="text" value={city} onChange={(e) => setCity(e.target.value)}  />
        <div className='CreateFormErrors'>
        {errors.city && (<p>{errors.city}</p>)}
      </div>
      <label>
        State:
      </label>
        <input className='form-field' type="text" value={state} onChange={(e) => setState(e.target.value)}  />
        <div className='CreateFormErrors'>
        {errors.state && (<p>{errors.state}</p>)}
      </div>
      <label>
        Latitude:
      </label>
        <input className='form-field' type="text" value={lat} onChange={(e) => setLat(e.target.value)}  />
        <div className='CreateFormErrors'>
        {errors.lat && (<p>{errors.lat}</p>)} {errors.latReq && (<p>{errors.latReq}</p>)}
      </div>
      <label>
        Longitude:
      </label>
        <input className='form-field' type="text" value={lng} onChange={(e) => setLng(e.target.value)}  />
      </div>
      <div className='CreateFormErrors'>
      {errors.lng && (<p>{errors.lng}</p>)} {errors.lngReq && (<p>{errors.lngReq}</p>)}
      </div>
      <div className='form-group'>
      <label>
        Name:
        <input className='form-field' type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <div className='CreateFormErrors'>
      {errors.name && (<p>{errors.name}</p>)}
      </div>
      </div>
      <div className='form-group'>
      <label>
        Description:
      </label>
        <textarea className='form-field' value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div className='CreateFormErrors'>
      {errors.description && (<p>{errors.description}</p>)}
      </div>
      <div className='form-group'>
      <label>
        Price:
      </label>
        <input className='form-field' type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
      </div>
      <div className='CreateFormErrors'>
      {errors.price && (<p>{errors.price}</p>)}
      </div>
      <label>Liven up your rental property with photos</label>
      <p>Submit a link to at least one photo to publish your spot</p>
      <div className='form-group'>
      <input
        type='url'
        className='image-url-field'
        value={imageUrls[0] || ''}
        onChange={handleAddImageUrl}
      />
      <input
        type='url'
        className='image-url-field'
        value={imageUrls[1] || ''}
        onChange={handleAddImageUrl}
      />
      <input
        type='url'
        className='image-url-field'
        value={imageUrls[2] || ''}
        onChange={handleAddImageUrl}
      />
      <input
        type='url'
        className='image-url-field'
        value={imageUrls[3] || ''}
        onChange={handleAddImageUrl}
      />
      <input
        type='url'
        className='image-url-field'
        value={imageUrls[4] || ''}
        onChange={handleAddImageUrl}
      />
      {/* Add more input fields for other image URLs */}
    </div>
      <button className='form-field' type="submit">Submit</button>
    </form>
    </div>
    </>
  );
};

export default UpdateSpot;
