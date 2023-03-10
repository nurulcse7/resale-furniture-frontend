import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const CheckoutForm = ({ order }) => {
  const [cardError, setCardError] = useState('');
  const [success, setSuccess] = useState('');
  const [processing, setProcessing] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [clientSecret, setClientSecret] = useState('');

  const stripe = useStripe();
  const elements = useElements();
  const { price, email, productName, _id, productId } = order;

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch(`${process.env.REACT_APP_ApiUrl}create-payment-intent`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `bearer ${localStorage.getItem('access-token')}`,
      },
      body: JSON.stringify({ price }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [price]);
  console.log(order);
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardElement);
    if (card === null) {
      return;
    }
// , paymentMethod
    const { error } = await stripe.createPaymentMethod({
      type: 'card',
      card,
    });

    if (error) {
      console.log(error);
      setCardError(error.message);
    } else {
      setCardError('');
    }
    setSuccess('');
    setProcessing(true);
    const { paymentIntent, error: confirmError } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
          billing_details: {
            name: productName,
            email: email,
          },
        },
      });

    if (confirmError) {
      setCardError(confirmError.message);
      return;
    }
    if (paymentIntent.status === 'succeeded') {
      console.log('card info', card);
      // store payment info in the database
      const payment = {
        price,
        transactionId: paymentIntent.id,
        email,
        order: _id,
      };
      fetch(`${process.env.REACT_APP_ApiUrl}payments`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: `bearer ${localStorage.getItem('access-token')}`,
        },
        body: JSON.stringify(payment),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data.insertedId) {
            axios
              .put(`${process.env.REACT_APP_ApiUrl}furnitures/${productId}`, {
                Status: 'sold',
              })
              .then((res) => {
                console.log(res);
                if (res.data?.acknowledged) {
                  setSuccess('Congrats! your payment successful');
                  setTransactionId(paymentIntent.id);
                }
              });
          }
        });
    }
    setProcessing(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
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
        {/*  */}
        <button
          className='btn btn-sm my-8 btn-primary'
          type='submit'
          disabled={!stripe || !clientSecret || processing}
        >
          Pay
        </button>
      </form>
      <p className='text-secondary'>{cardError}</p>
      {success && (
        <div>
          <p className='text-secondary font-semibold text-xl my-2'>{success}</p>
          <p className='text-blue-500 my-5'>
            Your transactionId:{' '}
            <span className='font-semibold text-cyan-500'>{transactionId}</span>
          </p>
        </div>
      )}
    </>
  );
};

export default CheckoutForm;
