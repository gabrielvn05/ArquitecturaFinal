import React from 'react';
import { FaTimes, FaStripe } from 'react-icons/fa';
import StripeComponent from './StripeComponent';
import '../styles/StripeModal.css';

interface StripeModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: {
    type: string;
    name: string;
    price: number;
    duration: string;
  };
}

const StripeModal: React.FC<StripeModalProps> = ({ isOpen, onClose, plan }) => {
  if (!isOpen) return null;

  const handlePaymentSuccess = (result: any) => {
    console.log('Payment successful:', result);
    alert(`¡Pago exitoso! Tu suscripción ${plan.name} ha sido activada.`);
    onClose();
  };

  const handlePaymentError = (error: any) => {
    console.error('Payment error:', error);
    alert('Hubo un error procesando el pago. Por favor intenta de nuevo.');
  };

  return (
    <div className="stripe-modal-overlay">
      <div className="stripe-modal">
        <div className="modal-header">
          <div className="stripe-header">
            <FaStripe className="stripe-icon" />
            <h2>Pagar con Tarjeta</h2>
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

        <div className="stripe-payment-section">
          <StripeComponent
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

export default StripeModal;
