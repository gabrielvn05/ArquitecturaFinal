import React from 'react';
import { FaTimes, FaPaypal } from 'react-icons/fa';
import PayPalComponent from './PayPalComponent';
import '../styles/PayPalModal.css';

interface PayPalModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: {
    type: string;
    name: string;
    price: number;
    duration: string;
  };
}

const PayPalModal: React.FC<PayPalModalProps> = ({ isOpen, onClose, plan }) => {
  if (!isOpen) return null;

  const handlePaymentSuccess = (details: any) => {
    console.log('Payment successful:', details);
    alert(`¡Pago exitoso! Tu suscripción ${plan.name} ha sido activada.`);
    onClose();
  };

  const handlePaymentError = (error: any) => {
    console.error('Payment error:', error);
    alert('Hubo un error procesando el pago. Por favor intenta de nuevo.');
  };

  return (
    <div className="paypal-modal-overlay">
      <div className="paypal-modal">
        <div className="modal-header">
          <div className="paypal-header">
            <FaPaypal className="paypal-icon" />
            <h2>Pagar con PayPal</h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="payment-summary">
          <div className="plan-info">
            <h3>{plan.name}</h3>
            <p className="plan-description">Descripción del {plan.name}</p>
            <div className="price-display">
              <span className="amount">${plan.price}</span>
            </div>
          </div>
        </div>

        <div className="paypal-payment-section">
          <PayPalComponent
            amount={plan.price}
            planName={plan.name}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        </div>
      </div>
    </div>
  );
};

export default PayPalModal;
