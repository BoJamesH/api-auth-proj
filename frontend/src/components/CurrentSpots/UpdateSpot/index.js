import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateSpot } from '../../../store/spots';
import { postSpot } from '../../../store/spots';
import { useHistory, useParams } from 'react-router-dom';
import '../../CreateSpot/SpotForm.css'
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
      if (index >= updatedImageUrls.length) {
        updatedImageUrls.push(newImageUrl);
      } else {
        updatedImageUrls[index] = newImageUrl;
      }
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
    };
    try {
      const response = await dispatch(updateSpot(spotToUpdate.id, newSpot, imageUrls));
      await dispatch(fetchSpot(spotToUpdate.id));
        setErrors({});
        history.push(`/spots/details/${spotToUpdate.id}`);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        console.error("Error creating spot:", error);
      }
    }
  };

  const handlePriceChange = (e) => {
    const newPrice = parseFloat(e.target.value);
    setPrice(newPrice);
  };

  useEffect(() => {}, [errors])

  if (isLoading) {
    return <p>Loading your property...</p>;
  } else if (!spotToUpdate) {
    return <p>Spot data not found.</p>;
  }

  return (
    <>
    <div className='CreateFormIntro'>
      <h2>Update Your Property</h2>
      <h4>Where's your place located?</h4>
      <p>Guests will only get your exact address once they've booked a reservation.</p>
    </div>
    <div className='CreateFormDiv'>
    <form noValidate={true} className="CreateForm" onSubmit={handleSubmit}>
      <label>
        Country:
      </label>
        <input className='CreateFormField CreateCountry' type="text" value={country} placeholder='Country' onChange={(e) => setCountry(e.target.value)}  />
        <div className='CreateFormErrors'>
        {errors.country && (<p>{errors.country}</p>)}
      </div>
    <div className='CreateFormGroup'>
      <label>
        Address:
      </label>
        <input className='CreateFormField CreateAddress' type="text" value={address} placeholder='Address' onChange={(e) => setAddress(e.target.value)}  />
        <div className='CreateFormErrors'>
        {errors.address && (<p>{errors.address}</p>)}
      </div>
      </div>
      <label className='CityLabel'>
        City:
      </label>
      <label className='StateLabel'>
        State:
      </label>
        <span className='CreateCityStateSpan'>
        <input className='CreateCity' type="text" value={city} placeholder='City' onChange={(e) => setCity(e.target.value)}  />
        <div className='CreateFormErrors'>
        {errors.city && (<p>{errors.city}</p>)}
      </div>
      <select
          className='CreateState'
          value={state}
          onChange={(e) => setState(e.target.value)}
        >
        <option value='-'> - </option>
        <option value='Alabama'>Alabama</option>
        <option value='Alaska'>Alaska</option>
        <option value='Arizona'>Arizona</option>
        <option value='Arkansas'>Arkansas</option>
        <option value='California'>California</option>
        <option value='Colorado'>Colorado</option>
        <option value='Connecticut'>Connecticut</option>
        <option value='Delaware'>Delaware</option>
        <option value='Florida'>Florida</option>
        <option value='Georgia'>Georgia</option>
        <option value='Hawaii'>Hawaii</option>
        <option value='Idaho'>Idaho</option>
        <option value='Illinois'>Illinois</option>
        <option value='Indiana'>Indiana</option>
        <option value='Iowa'>Iowa</option>
        <option value='Kansas'>Kansas</option>
        <option value='Kentucky'>Kentucky</option>
        <option value='Louisiana'>Louisiana</option>
        <option value='Maine'>Maine</option>
        <option value='Maryland'>Maryland</option>
        <option value='Massachusetts'>Massachusetts</option>
        <option value='Michigan'>Michigan</option>
        <option value='Minnesota'>Minnesota</option>
        <option value='Mississippi'>Mississippi</option>
        <option value='Missouri'>Missouri</option>
        <option value='Montana'>Montana</option>
        <option value='Nebraska'>Nebraska</option>
        <option value='Nevada'>Nevada</option>
        <option value='New Hampshire'>New Hampshire</option>
        <option value='New Jersey'>New Jersey</option>
        <option value='New Mexico'>New Mexico</option>
        <option value='New York'>New York</option>
        <option value='North Carolina'>North Carolina</option>
        <option value='North Dakota'>North Dakota</option>
        <option value='Ohio'>Ohio</option>
        <option value='Oklahoma'>Oklahoma</option>
        <option value='Oregon'>Oregon</option>
        <option value='Pennsylvania'>Pennsylvania</option>
        <option value='Rhode Island'>Rhode Island</option>
        <option value='South Carolina'>South Carolina</option>
        <option value='South Dakota'>South Dakota</option>
        <option value='Tennessee'>Tennessee</option>
        <option value='Texas'>Texas</option>
        <option value='Utah'>Utah</option>
        <option value='Vermont'>Vermont</option>
        <option value='Virginia'>Virginia</option>
        <option value='Washington'>Washington</option>
        <option value='West Virginia'>West Virginia</option>
        <option value='Wisconsin'>Wisconsin</option>
        <option value='Wyoming'>Wyoming</option>
        <option value='District of Columbia'>District of Columbia</option>
      </select>
      </span>
        <div className='CreateFormErrors'>
        {errors.state && (<p>{errors.state}</p>)}
      </div>
      <label className='LatLabel'>
        Latitude:
      </label>
      <label className='LngLabel'>
        Longitude:
      </label>
      <span className='CreateLatLngSpan'>
        <input className='CreateLat' type="text" value={lat} placeholder='Latitude' onChange={(e) => setLat(e.target.value)}  />
        <input className='CreateLng' type="text" value={lng} placeholder='Longitude' onChange={(e) => setLng(e.target.value)}  />
      </span>
      <div className='CreateFormErrors'>
        {errors.lat && (<p>{errors.lat}</p>)} {errors.latReq && (<p>{errors.latReq}</p>)}
      </div>
      <div className='CreateFormErrors'>
      {errors.lng && (<p>{errors.lng}</p>)} {errors.lngReq && (<p>{errors.lngReq}</p>)}
      </div>
      <label>
        Property Title:
      </label>
        <input className='CreateFormField' type="text" value={name} placeholder='Property title' onChange={(e) => setName(e.target.value)} />
      <div className='CreateFormErrors'>
      {errors.name && (<p>{errors.name}</p>)}
      </div>
      <label>
        Description:
      </label>
        <textarea className='CreateFormField CreateDescription' rows={20} value={description} placeholder='Property description' onChange={(e) => setDescription(e.target.value)} />
      <div className='CreateFormErrors'>
      {errors.description && (<p>{errors.description}</p>)}
      </div>
      <label>
        Price:
      </label>
      <input
          className='CreateFormField'
          type="number"
          value={price}
          onChange={handlePriceChange}
        />
      <div className='CreateFormErrors'>
      {errors.price && (<p>{errors.price}</p>)}
      </div>
      <label hidden={true}>Liven up your rental property with photos</label>
      <p hidden={true}>Submit a link to at least one photo to publish your spot</p>
      {!imageUrls[0] && <div style={{ color: 'red' }}>You must enter at least one image URL.</div>}
      <input
        type='url'
        className='image-url-field'
        value={imageUrls[0] || ''}
        onChange={(e) => handleAddImageUrl(e, 0)} 
        hidden={true}
      />
      <input
        type='url'
        className='image-url-field'
        value={imageUrls[1] || ''}
        onChange={(e) => handleAddImageUrl(e, 1)}
        hidden={true}
      />
      <input
        type='url'
        className='image-url-field'
        value={imageUrls[2] || ''}
        onChange={(e) => handleAddImageUrl(e, 2)}
        hidden={true}
      />
      <input
        type='url'
        className='image-url-field'
        value={imageUrls[3] || ''}
        onChange={(e) => handleAddImageUrl(e, 3)}
        hidden={true}
      />
      <input
        type='url'
        className='image-url-field'
        value={imageUrls[4] || ''}
        onChange={(e) => handleAddImageUrl(e, 4)}
        hidden={true}
      />
      <div className='CreateSubmitButtonDiv'>
      <button className='CreateSubmitButton' type="submit">Update</button>
      </div>
    </form>
    </div>
    </>
  );
};

export default UpdateSpot;
