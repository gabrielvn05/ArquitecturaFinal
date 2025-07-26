import React, { useState } from 'react';
import { FaPaypal, FaStripe, FaTimes } from 'react-icons/fa';
import PayPalComponent from './PayPalComponent';
import '../styles/PaymentModal.css';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: {
    type: string;
    name: string;
    price: number;
    duration: string;
  };
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, plan }) => {
  const [selectedMethod, setSelectedMethod] = useState<'paypal' | 'stripe' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handlePaymentSuccess = (details: any) => {
    setIsProcessing(false);
    console.log('Payment successful:', details);
    alert(`¡Pago exitoso! Tu suscripción ${plan.name} ha sido activada.`);
    onClose();
  };

  const handlePaymentError = (error: any) => {
    setIsProcessing(false);
    console.error('Payment error:', error);
    alert('Hubo un error procesando el pago. Por favor intenta de nuevo.');
  };

  const handleStripePayment = () => {
    setIsProcessing(true);
    // Aquí integrarías Stripe
    setTimeout(() => {
      setIsProcessing(false);
      alert('Funcionalidad de Stripe próximamente disponible');
    }, 2000);
  };

  return (
    <div className="payment-modal-overlay">
      <div className="payment-modal">
        <div className="modal-header">
          <h2>Completar Pago</h2>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="payment-details">
          <div className="plan-summary">
            <h3>{plan.name}</h3>
            <div className="price-info">
              <span className="amount">${plan.price}</span>
              <span className="duration">{plan.duration}</span>
            </div>
          </div>
        </div>

        <div className="payment-methods">
          <h3>Selecciona tu método de pago:</h3>
          
          <div className="payment-options">
            <button 
              className={`payment-option ${selectedMethod === 'paypal' ? 'selected' : ''}`}
              onClick={() => setSelectedMethod('paypal')}
              disabled={isProcessing}
            >
              <FaPaypal className="payment-icon" />
              <span>PayPal</span>
            </button>

            <button 
              className={`payment-option ${selectedMethod === 'stripe' ? 'selected' : ''}`}
              onClick={() => setSelectedMethod('stripe')}
              disabled={isProcessing}
            >
              <FaStripe className="payment-icon" />
              <span>Tarjeta de Crédito</span>
            </button>
          </div>

          <div className="payment-form">
            {selectedMethod === 'paypal' && (
              <div className="paypal-section">
                <h4>Pagar con PayPal:</h4>
                <PayPalComponent
                  amount={plan.price}
                  planName={plan.name}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </div>
            )}

            {selectedMethod === 'stripe' && (
              <div className="stripe-section">
                <h4>Pagar con Tarjeta:</h4>
                <button 
                  className="stripe-pay-btn"
                  onClick={handleStripePayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Procesando...' : `Pagar $${plan.price} con Stripe`}
                </button>
                <p className="coming-soon">* Próximamente disponible</p>
              </div>
            )}
          </div>
        </div>

        {isProcessing && (
          <div className="processing-overlay">
            <div className="spinner"></div>
            <p>Procesando pago...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
