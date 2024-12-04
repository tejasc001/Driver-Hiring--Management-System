import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [cookies, setCookies] = useCookies();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setpasswordConfirm] = useState('');
  const [contact, setContact] = useState('');
  const [type, setType] = useState('');
  const [navi, setNavi] = useState(false);

  const navigate = useNavigate();

  const signUpSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios({
        method: 'POST',
        url:  `${process.env.REACT_APP_SERVER}/api/v1/user/signup`,
        data: {
          name,
          email,
          password,
          passwordConfirm,
          role: {
            type,
          },
          contact,
        },
      });
      console.log(res);
      if (res.status === 201) {
        setName('');
        setEmail('');
        setPassword('');
        setpasswordConfirm('');
        setContact('');
        setType('');
        setNavi(true);
        setCookies('jwt',res.data.token,{
          expires: new Date(
            Date.now() + 90 * 24 * 60 * 60 * 1000
          ),
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (navi) {
      if (type === 'user') navigate('/drivers');
      if (type === 'driver') navigate('/driver-details');
      setNavi(false);
    }
  }, [navi, navigate, type]);

  return (
    <div className="login-form">
      <h2 className="heading-secondary ma-bt-lg">Create an account</h2>
      <form className="form form--login" onSubmit={signUpSubmit}>
        <div className="form__flex">
          <div className="form__group">
            <label className="form__label" htmlFor="fullname">
              Full Name
            </label>
            <input
              id="fullname"
              className="form__input"
              type="text"
              placeholder="John Doe"
              onChange={(e) => setName(e.target.value)}
              required
              value={name}
            />
          </div>
          <div className="form__group">
            <label className="form__label" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              className="form__input"
              type="email"
              placeholder="you@example.com"
              onChange={(e) => setEmail(e.target.value)}
              required
              value={email}
            />
          </div>
        </div>
        <div className="form__flex">
          <div className="form__group">
            <label className="form__label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              className="form__input"
              type="password"
              placeholder="••••••••"
              required
              minLength="8"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>
          <div className="form__group">
            <label className="form__label" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              className="form__input"
              type="password"
              placeholder="••••••••"
              required
              onChange={(e) => setpasswordConfirm(e.target.value)}
              minLength="8"
              value={passwordConfirm}
            />
          </div>
        </div>
        <div className="form__flex">
          <div className="form__group">
            <label className="form__label">Role</label>
            <div className="form__group">
              <input
                id="user"
                className="form__radio-input"
                type="radio"
                name="role"
                value="user"
                required
                onChange={(e) => setType(e.target.value)}
              />
              <label className="form__radio-label" htmlFor="user">
                User
              </label>
              <input
                id="driver"
                className="form__radio-input"
                type="radio"
                name="role"
                value="driver"
                onChange={(e) => setType(e.target.value)}
                required
              />
              <label className="form__radio-label" htmlFor="driver">
                Driver
              </label>
            </div>
          </div>
          <div className="form__group">
            <label className="form__label" htmlFor="contact">
              Contact Number
            </label>
            <input
              id="contact"
              className="form__input"
              type="tel"
              placeholder="9999999999"
              required
              onChange={(e) => setContact(e.target.value)}
              maxLength="10"
              value={contact}
            />
          </div>
        </div>
        <div className="form__group">
          <button className="btn btn--green">Sign Up</button>
        </div>
      </form>
    </div>
  );
}
