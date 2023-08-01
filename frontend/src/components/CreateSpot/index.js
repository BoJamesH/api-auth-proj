import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { postSpot } from '../../store/spots';
import { useHistory } from 'react-router-dom';
import './SpotForm.css';

const SpotForm = () => {
  const dispatch = useDispatch();
  const history = useHistory();

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
  const [errors, setErrors] = useState({})
  const [imageUrls, setImageUrls] = useState([]);

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
    // Create the spot object with form data
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
      // Dispatch the action to create the new spot
      const successSpot = await dispatch(postSpot(newSpot));

      // Extract the ID of the newly created spot
      const newSpotId = successSpot.id;
      console.log(newSpotId)

      // Redirect to the details page of the newly created spot
      history.push(`/spots/details/${newSpotId}`);
    } catch (error) {
      // Handle any error here, if necessary
      console.error('Error creating spot:', error);
    }
  };

  return (
    <>
    <div className='form-intro'>
      <h2>List Your Property</h2>
      <h4>Where's your place located?</h4>
      <p>Guests will only get your exact address once they've booked a reservation.</p>
    </div>
    <div className='spot-form-div'>
    <form className="spot-form" onSubmit={handleSubmit}>
    <div className='form-group'>
      <label>
        Country: {errors.country && (<p>{errors.country}</p>)}
      </label>
        <input className='form-field' type="text" value={country} onChange={(e) => setCountry(e.target.value)} required />
      </div>
    <div className='form-group'>
      <label>
        Address: {errors.address && (<p>{errors.address}</p>)}
      </label>
        <input className='form-field' type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
      </div>
      <div className='form-group-block'>
      <label>
        City: {errors.city && (<p>{errors.city}</p>)}
      </label>
        <input className='form-field' type="text" value={city} onChange={(e) => setCity(e.target.value)} required />
      <label>
        State: {errors.state && (<p>{errors.state}</p>)}
      </label>
        <input className='form-field' type="text" value={state} onChange={(e) => setState(e.target.value)} required />
      <label>
        Latitude: {errors.lat && (<p>{errors.lat}</p>)} {errors.latReq && (<p>{errors.latReq}</p>)}
      </label>
        <input className='form-field' type="text" value={lat} onChange={(e) => setLat(e.target.value)} required />
      <label>
        Longitude: {errors.lng && (<p>{errors.lng}</p>)} {errors.lngReq && (<p>{errors.lngReq}</p>)}
      </label>
        <input className='form-field' type="text" value={lng} onChange={(e) => setLng(e.target.value)} required />
      </div>
      <div className='form-group'>
      <label>
        Name: {errors.name && (<p>{errors.name}</p>)}
        <input className='form-field' type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </label>
      </div>
      <div className='form-group'>
      <label>
        Description: {errors.description && (<p>{errors.description}</p>)}
      </label>
        <textarea className='form-field' value={description} onChange={(e) => setDescription(e.target.value)} required />
      </div>
      <div className='form-group'>
      <label>
        Price: {errors.price && (<p>{errors.price}</p>)}
      </label>
        <input className='form-field' type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
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

export default SpotForm;
