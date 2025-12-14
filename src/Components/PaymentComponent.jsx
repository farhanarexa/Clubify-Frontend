import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { paymentApi, eventRegistrationApi, membershipApi, stripeApi } from '../api/clubifyApi';
import { toast } from 'react-toastify';

// Load Stripe with publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Payment Form Component
const PaymentForm = ({ amount, type, itemId, userEmail, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create payment intent on the backend using the stripeApi service
      let paymentIntentData;
      if (type === 'event') {
        paymentIntentData = await stripeApi.createEventPaymentIntent(itemId, userEmail, amount);
      } else if (type === 'membership') {
        paymentIntentData = await stripeApi.createMembershipPaymentIntent(itemId, userEmail, amount);
      }

      // Confirm the payment using Stripe
      const result = await stripe.confirmCardPayment(paymentIntentData.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        }
      });

      if (result.error) {
        // Show error to your customer (e.g., insufficient funds)
        setError(result.error.message);
        setLoading(false);
      } else {
        // The payment has been processed!
        if (result.paymentIntent.status === 'succeeded') {
          // Payment successful, complete the registration
          if (type === 'event') {
            try {
              // Register user for the event using our API service
              await eventRegistrationApi.registerForEvent({
                eventId: itemId,
                userEmail: userEmail
              });

              // Create payment record
              await paymentApi.createPayment({
                userEmail: userEmail,
                amount: parseFloat(amount),
                type: 'event',
                eventId: itemId,
                stripePaymentIntentId: result.paymentIntent.id,
                status: 'completed'
              });

              toast.success('Successfully registered and paid for event!');
              onSuccess();
            } catch (regError) {
              console.error('Error completing event registration:', regError);
              toast.error('Payment successful, but event registration failed. Please contact support.');
            }
          } else if (type === 'membership') {
            try {
              // Create membership record using our API service
              await membershipApi.createMembership({
                userEmail: userEmail,
                clubId: itemId,
                status: 'active',
                joinedDate: new Date().toISOString()
              });

              // Create payment record
              await paymentApi.createPayment({
                userEmail: userEmail,
                amount: parseFloat(amount),
                type: 'membership',
                clubId: itemId,
                stripePaymentIntentId: result.paymentIntent.id,
                status: 'completed'
              });

              toast.success('Successfully joined club with payment!');
              onSuccess();
            } catch (regError) {
              console.error('Error completing club membership:', regError);
              toast.error('Payment successful, but club joining failed. Please contact support.');
            }
          }
        } else {
          setError('Payment failed. Please try again.');
        }
        setLoading(false);
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError(error.message || 'An error occurred during payment');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="card-element">
          Payment Details
        </label>
        <div className="border border-gray-300 rounded-md p-3 bg-white">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || loading}
          className={`px-6 py-2 rounded-lg text-white transition-colors ${
            !stripe || loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-[#6A0DAD] hover:bg-[#9F62F2]'
          }`}
        >
          {loading ? 'Processing...' : `Pay $${amount}`}
        </button>
      </div>
    </form>
  );
};

// Main Payment Component
const PaymentComponent = ({ amount, type, itemId, userEmail, onSuccess, onCancel }) => {
  return (
    <div className="payment-modal p-6 bg-white rounded-lg shadow-xl max-w-md w-full">
      <h3 className="text-lg font-bold text-gray-800 mb-4">
        {type === 'event' ? 'Pay for Event Registration' : 'Pay for Club Membership'}
      </h3>
      <Elements stripe={stripePromise}>
        <PaymentForm
          amount={amount}
          type={type}
          itemId={itemId}
          userEmail={userEmail}
          onSuccess={onSuccess}
          onCancel={onCancel}
        />
      </Elements>
    </div>
  );
};

export default PaymentComponent;