import React from 'react';

export default function Reviews({ reviews }) {
  return (
    <div className="my-reviews">
      <h2 className="heading-secondary ma-bt-md">My Reviews</h2>
      <div className="reviews">
        {reviews?.map((review) => (
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
    </div>
  );
}
