/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe(
  'pk_test_51NlmVkSH4aLqjktTDgfxH9kMSPhNdT0Szv59gd8A9CuMsq4TCcho2p7spcqFFCovyMrrE3y7P1CXWkRFk2Tc0Vcu00PNokr1Cp'
);

export const bookDriver = async (driverId) => {
  try {
    // 1) Get checkout session from API
    const session = await axios(
      `/api/v1/bookings/checkout-session/${driverId}`
    );
    // console.log(session);

    // 2) Create checkout form + chanre credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
