import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function Driver({ cookies }) {
  const { driverId } = useParams();

  const [driver, setDriver] = useState([]);
  const [review,setReview] = useState();
  const [rating,setRating] = useState();

  useEffect(() => {
    function fetchDriver() {
      axios
        .get(`${process.env.REACT_APP_SERVER}/api/v1/user/hireDriver/${driverId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + cookies.jwt,
          },
        })
        .then((res) => {
          setDriver(res.data.data.data);
          console.log(res.data.data.data);
        })
        .catch((e) => console.error(e));
    }
    fetchDriver();
  }, [cookies.jwt, driverId]);

  const handleBooking = () => {
    axios
      .get(`${process.env.REACT_APP_SERVER}/api/v1/booking/checkout-session/${driverId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + cookies.jwt,
        },
      })
      .then((res) => {
        // setUrl(res.data.session.url);
        console.log(res.data.session.url);
        window.location.replace(res.data.session.url);
      })
      .catch((e) => console.error(e));
  };

  const handleReview = (e) => {
    e.preventDefault();
    axios.post(`${process.env.REACT_APP_SERVER}/api/v1/driver/${driverId}/review`,{
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + cookies.jwt,
      },
      data:{
        rating,
        review
      }
    }).then((res) =>{
      if(res.data.status !== 'success'){
        return new Error("Failed to post review");
      }
      setRating("");
      setReview("");
      window.location.reload();
    }).catch(e =>{
      console.error(e);
    })
  }
  return (
    <>
      <section className="section-header">
        <div className="heading-box">
          <div className="heading-img__box">
            <img
              src={`../img/drivers/${
                driver.photo ? driver.photo : 'default.jpg'
              }`}
              alt={`${driver?.name}`}
              className="heading-img"
            />
          </div>
          <h1 className="heading-primary">
            <span>{driver.name}</span>
          </h1>
        </div>
        <div className="overview-box">
          <h2 className="overview-heading">Details</h2>
          <p>
            Experienced and reliable driver with a passion for ensuring safe and
            efficient transportation. Proficient in navigating diverse routes
            and traffic conditions, demonstrating a commitment to punctuality.
            Known for excellent communication skills and a courteous demeanor,
            providing a comfortable and enjoyable passenger experience.
          </p>
          <div className="overview-driver-flex ">
            <ion-icon name="location-outline"></ion-icon>
            <span>{driver.place}</span>
          </div>
          <div className="overview-driver-flex ">
            <ion-icon name="car-sport-outline"></ion-icon>
            <span>{driver.drives}</span>
          </div>
          <div className="overview-driver-flex ">
            <ion-icon name="card-outline"></ion-icon>
            <span>₹{driver.price}/minimum</span>
          </div>
          <div className="overview-driver-flex ">
            <ion-icon name="star-half-outline"></ion-icon>
            <span>{driver.rating}/5</span>
          </div>
          <div className="overview-driver-flex ">
            <ion-icon name="cash-outline"></ion-icon>
            <span>₹{driver.pricePerKm}/km</span>
          </div>
        </div>
      </section>
      <div className="book-driver__card">
        <button
          className="btn btn--green span-all-rows "
          id="book-tour"
          data-driver-id={`${driver._id}`}
          onClick={handleBooking}
        >
          Book driver now!
        </button>
      </div>
      <section className="section-reviews">
        <h2 className="review-heading">Reviews</h2>
        <div className="reviews">
          {driver?.review?.map((review) => (
            <div className="reviews__card" key={review._id}>
              <div className="reviews__avatar">
                <img
                  className="reviews__avatar-img"
                  src={`../img/users/${
                    review?.user?.photo ? review.user.photo : 'default.jpg'
                  }`}
                  alt={`${review?.user?.name}`}
                />
                <h6 className="reviews__user">{review?.user?.name}</h6>
              </div>
              <div className="overview-driver-flex ">
                <ion-icon name="star-half-outline"></ion-icon>
                <span className="reviews__rating">{review.rating}/5</span>
              </div>
              <p className="reviews__text">{review?.review}</p>
            </div>
          ))}
        </div>
      </section>
      <section className='post-review'>
        <h2 className='overview-heading'>Post Review</h2>
        <form className='post-review-form' onSubmit={(e) =>handleReview}>
          <div className='post-review-comm'>
            <label >Rating</label>
            <div>
              <input type='number' min="1" max="5" 
                onWheel={ event => event.currentTarget.blur()}
                placeholder='4.3'
                step="any"
                className='form__input post-review-rating'
                onChange={(e) => setRating(e.target.value)}
                /><span> / 5</span>
            </div>
          </div>
          <div className='post-review-comm'>      
            <label>Review</label>    
            <textarea rows="10" cols="50" 
              placeholder='He is best driver seen so far'
              className='form__input textarea-review'
              required
              onChange={(e) => setReview(e.target.value)}
              />
          </div>
          <button
            className="btn btn--green span-all-rows post-review-button"
            id="review-dirver"
            type='submit'
            >
            Submit
          </button>
          </form>
      </section>
    </>
  );
}
