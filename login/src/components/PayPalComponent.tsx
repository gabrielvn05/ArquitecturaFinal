import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

interface PayPalComponentProps {
  amount: number;
  planName: string;
  onSuccess: (details: any) => void;
  onError: (error: any) => void;
}

const PayPalComponent: React.FC<PayPalComponentProps> = ({ 
  amount, 
  planName, 
  onSuccess, 
  onError 
}) => {
  const initialOptions = {
    clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
    currency: "USD",
    intent: "capture",
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <PayPalButtons
        style={{
          layout: "vertical",
          color: "gold",
          shape: "rect",
          label: "paypal",
        }}
        createOrder={(_data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [
              {
                description: `Suscripción ${planName}`,
                amount: {
                  currency_code: "USD",
                  value: amount.toString(),
                },
              },
            ],
          });
        }}
        onApprove={async (_data: any, actions: any) => {
          try {
            const details = await actions.order?.capture();
            console.log('Payment completed successfully:', details);
            onSuccess(details);
          } catch (error) {
            console.error('Error capturing payment:', error);
            onError(error);
          }
        }}
        onError={(error: any) => {
          console.error('PayPal error:', error);
          onError(error);
        }}
        onCancel={(data: any) => {
          console.log('Payment cancelled:', data);
          alert('Pago cancelado');
        }}
      />
    </PayPalScriptProvider>
  );
};

export default PayPalComponent;
