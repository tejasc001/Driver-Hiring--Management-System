import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function DriverDetails({ cookies }) {
  const [price, setPrice] = useState('');
  const [pricePerKm, setPricePerKm] = useState('');
  const [place, setPlace] = useState('');
  const [drives, setDrives] = useState('');
  const [navi, setNavi] = useState(false);
  const navigate = useNavigate();

  const driverSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios({
        method: 'POST',
        url: `${process.env.REACT_APP_SERVER}/api/v1/driver/createDriver`,
        data: {
          price,
          pricePerKm,
          place,
          drives,
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + cookies.jwt,
        },
      });
      console.log(res);
      if (res.status === 200) {
        setNavi(true);
      }
    } catch (e) {
      console.error(e);
    }
  };
  useEffect(() => {
    if (navi) {
      navigate('/dashboard');
    }
  }, [navi, navigate]);
  return (
    <div className="login-form">
      <form className="form form--login" onSubmit={driverSubmit}>
        <div className="form__flex">
          <div className="form__group">
            <label className="form__label" htmlFor="place">
              Place
            </label>
            <input
              id="place"
              className="form__input"
              type="text"
              placeholder="Bengaluru"
              onChange={(e) => setPlace(e.target.value)}
              required
              value={place}
            />
          </div>
          <div className="form__group">
            <label className="form__label" htmlFor="drives">
              Drives
            </label>
            <input
              id="drives"
              className="form__input"
              type="text"
              placeholder="Bus"
              onChange={(e) => setDrives(e.target.value.toLowerCase())}
              required
              value={drives}
            />
          </div>
        </div>
        <div className="form__flex">
          <div className="form__group">
            <label className="form__label" htmlFor="price">
              Price
            </label>
            <input
              id="price"
              className="form__input"
              type="number"
              placeholder="450"
              required
              onChange={(e) => setPrice(e.target.value)}
              value={price}
            />
          </div>
          <div className="form__group">
            <label className="form__label" htmlFor="pricePerKm">
              Price Per Km
            </label>
            <input
              id="pricePerKm"
              className="form__input"
              type="number"
              placeholder="7/km"
              required
              onChange={(e) => setPricePerKm(e.target.value)}
              value={pricePerKm}
            />
          </div>
        </div>
        <div className="form__group">
          <button className="btn btn--green">Submit</button>
        </div>
      </form>
    </div>
  );
}

export default DriverDetails;
