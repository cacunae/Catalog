import type { FC } from 'react'

type CreditsModalProps = {
  isOpen: boolean
  onClose: () => void
}

const CreditsModal: FC<CreditsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <section className="credits-mock-screen" role="dialog" aria-modal="true" aria-label="Creditos y agradecimiento">
      <div className="credits-mock-panel">
        <p className="credits-text">Gracias por encontrar el easter egg y revisar todo el ciclo de vida de esta web.</p>
        <p className="credits-text">Contacto: cri.acu98@gmail.com</p>
        <button type="button" className="credits-close" onClick={onClose}>
          Volver
        </button>
      </div>
    </section>
  )
}

export default CreditsModal
