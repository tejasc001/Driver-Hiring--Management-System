import axios from 'axios';
import React, { useState } from 'react';

export default function Setting({ cookies, userName, userContact, userPhoto }) {
  const [name, setName] = useState(userName);
  const [contact, setContact] = useState(userContact);
  const [file, setFile] = useState('');
  const [passwordCurrent, setPasswordCurrent] = useState('');
  const [password, setpassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const updateMe = async (e) => {
    e.preventDefault();
    try {
      const res = await axios({
        method: 'PATCH',
        url: `${process.env.REACT_APP_SERVER}/api/v1/user/updateMe`,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer ' + cookies.jwt,
        },
        data: {
          name,
          contact,
          photo: file,
        },
      });
      console.log(res);
    } catch (e) {
      console.error(e);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      const res = await axios({
        method: 'PATCH',
        url: `${process.env.REACT_APP_SERVER}/api/v1/user/updatePassword`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + cookies.jwt,
        },
        data: {
          passwordCurrent,
          password,
          passwordConfirm,
        },
      });
      console.log(res);
      if (res.status === 200) {
        setPasswordCurrent('');
        setpassword('');
        setPasswordConfirm('');
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <div className="user-view__content">
        <div className="user-view__form-container">
          <h2 className="heading-secondary ma-bt-md">Your account settings</h2>
          <form className="form form-user-data" onSubmit={updateMe}>
            <div className="form__group">
              <label className="form__label" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                className="form__input"
                type="text"
                defaultValue={userName ? userName : ''}
                required
                name="name"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form__group ma-bt-md">
              <label className="form__label" htmlFor="contact">
                Contact
              </label>
              <input
                id="contact"
                className="form__input"
                type="number"
                defaultValue={userContact ? userContact * 1 : ''}
                required
                minLength="10"
                name="contact"
                onChange={(e) => setContact(e.target.value)}
              />
            </div>
            <div className="form__group form__photo-upload">
              <img
                className="form__user-photo"
                src={
                  file
                    ? URL.createObjectURL(file)
                    : `/img/users/${userPhoto ? userPhoto : 'default.jpg'}`
                }
                alt={`${userName}`}
              />
              <input
                className="form__upload"
                type="file"
                accept="image/*"
                id="photo"
                name="photo"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <label htmlFor="photo">Choose new photo</label>
            </div>
            <div className="form__group right">
              <button className="btn btn--small btn--green">
                Save settings
              </button>
            </div>
          </form>
        </div>
        <div className="line">&nbsp;</div>
        <div className="user-view__form-container">
          <h2 className="heading-secondary ma-bt-md">Password change</h2>
          <form
            className="form form-user-password"
            onSubmit={handlePasswordChange}
          >
            <div className="form__group">
              <label className="form__label" htmlFor="password-current">
                Current password
              </label>
              <input
                id="password-current"
                className="form__input"
                type="password"
                placeholder="••••••••"
                required
                minLength="8"
                value={passwordCurrent}
                onChange={(e) => setPasswordCurrent(e.target.value)}
              />
            </div>
            <div className="form__group">
              <label className="form__label" htmlFor="password">
                New password
              </label>
              <input
                id="password"
                className="form__input"
                type="password"
                placeholder="••••••••"
                required
                minLength="8"
                value={password}
                onChange={(e) => setpassword(e.target.value)}
              />
            </div>
            <div className="form__group ma-bt-lg">
              <label className="form__label" htmlFor="password-confirm">
                Confirm password
              </label>
              <input
                id="password-confirm"
                className="form__input"
                type="password"
                placeholder="••••••••"
                required
                minLength="8"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
              />
            </div>
            <div className="form__group right">
              <button className="btn btn--small btn--green btn--save-password">
                Save password
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
