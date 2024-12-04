import React from 'react';

export default function Billing({ billing }) {
  let curr = 0;
  billing?.forEach((billing) => {
    if (billing.paid) curr += billing.price;
  });
  return (
    <div className="my-reviews">
      <h2 className="heading-secondary ma-bt-md">My Billing</h2>
      <div className="billing-container">
        <p>
          Driver Hired: <span>{billing?.length}</span>
        </p>
        <p>
          Spent: ₹<span>{curr}</span>
        </p>
        <div className="billing-driver-container">
          {billing?.map((billing) => (
            <div className="billing-driver">
              <div className="billing-driver-name">
                <img
                  src={`../img/drivers/${
                    billing?.driver?.photo
                      ? billing.driver.photo
                      : 'default.jpg'
                  }`}
                  alt={billing.driver.name}
                />
                <p>{billing.driver.name}</p>
              </div>
              <p>{billing.driver.drives}</p>
              <div className="billing-driver-price">
                <p>₹{billing.driver.price}</p>
                <div
                  className={billing.paid ? 'billing-paid' : 'billing-unpaid'}
                >
                  {billing.paid ? 'PAID' : 'UNPAID'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
