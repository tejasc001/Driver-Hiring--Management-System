/* eslint-disable */
// import axios from 'axios';
// import { showAlert } from './alerts';

export const login = async (email, password) => {
  try {
    // const res = await axios({
    //   method: 'POST',
    //   url: '/api/v1/users/login',
    //   data: {
    //     email,
    //     password,
    //   },
    // });
    // const data = {
    //   email,
    //   password,
    // };
    // const resData = await fetch('http://localhost:3000/api/v1/users/login', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(data),
    // });
    // const res = await resData.json();

    // console.log(res);
    console.log('hello');
    let res;
    fetch('http://localhost:3000/api/v1/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((response) => {
        response.json();
        console.log(response.json());
      })
      .then((data) => {
        res = data;
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });

    if (res.data.status === 'success') {
      // showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    console.log(err.response.data.message);
    // showAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout',
    });
    if (res.data.status == 'success') location.reload(true);
  } catch (err) {
    console.log(err.response);
    showAlert('error', 'Error logging out! Try again.');
  }
};
