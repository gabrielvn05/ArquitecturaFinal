import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface StripeComponentProps {
  amount: number;
  planName: string;
  onSuccess: (result: any) => void;
  onError: (error: any) => void;
}

const CheckoutForm: React.FC<{
  amount: number;
  planName: string;
  onSuccess: (result: any) => void;
  onError: (error: any) => void;
}> = ({ amount, planName, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setIsProcessing(false);
      return;
    }

    try {
      // Crear el método de pago
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: planName,
        },
      });

      if (error) {
        console.error('Error creating payment method:', error);
        onError(error);
        setIsProcessing(false);
        return;
      }

      // En un entorno real, aquí enviarías el paymentMethod.id a tu backend
      // Para esta demo, simularemos un pago exitoso
      console.log('Payment method created:', paymentMethod);
      
      // Simular procesamiento del pago
      setTimeout(() => {
        onSuccess({
          id: paymentMethod.id,
          status: 'succeeded',
          amount: amount * 100, // Stripe maneja centavos
          currency: 'usd',
          description: `Suscripción ${planName}`
        });
        setIsProcessing(false);
      }, 2000);

    } catch (error) {
      console.error('Payment failed:', error);
      onError(error);
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="stripe-form">
      <div className="card-element-container">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
                iconColor: '#666EE8',
              },
              invalid: {
                color: '#9e2146',
              },
            },
            hidePostalCode: true,
          }}
        />
      </div>
      
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="stripe-pay-button"
      >
        {isProcessing ? 'Procesando...' : `Pagar $${amount}`}
      </button>
    </form>
  );
};

const StripeComponent: React.FC<StripeComponentProps> = ({ 
  amount, 
  planName, 
  onSuccess, 
  onError 
}) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm
        amount={amount}
        planName={planName}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  );
};

export default StripeComponent;
