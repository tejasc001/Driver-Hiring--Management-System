import React from 'react';
import { Outlet } from 'react-router-dom';

export default function bookings({ bookings }) {
  return (
    <>
      <div className="booking-container">
        <h2 className="heading-secondary ma-bt-md">My Bookings</h2>
        <Outlet context={bookings} />
      </div>
    </>
  );
}
