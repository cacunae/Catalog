import type { FC } from 'react'

type CheckoutModalProps = {
  isOpen: boolean
  isClosing: boolean
  isCardInfoModalOpen: boolean
  isCardInfoModalClosing: boolean
  onClose: () => void
  onCashPayment: () => void
  onCardPayment: () => void
  onHappyPayment: () => void
  onCloseCardInfo: () => void
}

const CheckoutModal: FC<CheckoutModalProps> = ({
  isOpen,
  isClosing,
  isCardInfoModalOpen,
  isCardInfoModalClosing,
  onClose,
  onCashPayment,
  onCardPayment,
  onHappyPayment,
  onCloseCardInfo,
}) => {
  if (!isOpen) return null

  return (
    <section
      className={`payment-mock-screen ${isClosing ? 'closing' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Seleccion de metodo de pago"
    >
      <button type="button" className="payment-mock-back" aria-label="Volver a productos" onClick={onClose}>
        {'\u2190'}
      </button>
      <div className="payment-mock-options">
        <button type="button" className="payment-mock-option" aria-label="Pagar con efectivo" onClick={onCashPayment}>
          <svg viewBox="0 0 24 24" className="payment-icon">
            <rect x="3" y="6" width="18" height="12" rx="2.2" />
            <circle cx="12" cy="12" r="2.6" />
            <path d="M6.5 9.8h2.4" />
            <path d="M15.1 14.2h2.4" />
          </svg>
        </button>

        <button type="button" className="payment-mock-option" aria-label="Pagar con tarjeta" onClick={onCardPayment}>
          <svg viewBox="0 0 24 24" className="payment-icon">
            <rect x="2.8" y="6" width="18.4" height="12" rx="2.1" />
            <path d="M3.3 10h17.4" />
            <path d="M6.3 14.6h3.2" />
            <path d="M11 14.6h3.6" />
          </svg>
        </button>

        <button type="button" className="payment-mock-option" aria-label="Pagar en caja feliz" onClick={onHappyPayment}>
          <svg viewBox="0 0 24 24" className="payment-icon">
            <circle cx="12" cy="12" r="8.2" />
            <circle cx="9.3" cy="10.3" r="0.9" />
            <circle cx="14.7" cy="10.3" r="0.9" />
            <path d="M8.8 14c0.8 1.2 1.9 1.8 3.2 1.8s2.4-0.6 3.2-1.8" />
          </svg>
        </button>
      </div>

      {isCardInfoModalOpen && (
        <div className={`card-info-modal ${isCardInfoModalClosing ? 'closing' : ''}`} role="dialog" aria-modal="true">
          <div className="card-info-panel">
            <p className="card-info-text">
              En este punto es donde se debiese conectar con la API proveedora del servicio de cobro con tarjetas,
              si estas viendo esto es porque terminaste de revisar todo el ciclo de vida de la web.
            </p>
            <button type="button" className="card-info-ok" onClick={onCloseCardInfo}>
              OK
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

export default CheckoutModal
