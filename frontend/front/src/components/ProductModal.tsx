import type { FC, SyntheticEvent } from 'react'
import type { Product } from '../types/product'

type ProductModalProps = {
  selectedProduct: Product | null
  isClosing: boolean
  totalCartItems: number
  hasCartNotification: boolean
  cartAnimationTick: number
  carouselIndex: number
  onClose: () => void
  onOpenCart: () => void
  onPrevSlide: () => void
  onNextSlide: () => void
  onAddToCart: (product: Product) => void
  onImageError: (event: SyntheticEvent<HTMLImageElement, Event>, fallbackSrc?: string) => void
  formatPrice: (value: number) => string
}

const ProductModal: FC<ProductModalProps> = ({
  selectedProduct,
  isClosing,
  totalCartItems,
  hasCartNotification,
  cartAnimationTick,
  carouselIndex,
  onClose,
  onOpenCart,
  onPrevSlide,
  onNextSlide,
  onAddToCart,
  onImageError,
  formatPrice,
}) => {
  if (!selectedProduct) return null

  return (
    <section className={`product-modal ${isClosing ? 'closing' : ''}`} role="dialog" aria-modal="true" aria-label={selectedProduct.name}>
      <div className="modal-topbar">
        <button type="button" className="modal-close" onClick={onClose} aria-label="Cerrar detalle">
          x
        </button>
        <button type="button" className="cart-button modal-cart" aria-label="Carrito" onClick={onOpenCart}>
          {hasCartNotification && cartAnimationTick > 0 && (
            <span key={`cart-dot-modal-${cartAnimationTick}`} className="cart-jump-dot" aria-hidden="true" />
          )}
          {totalCartItems > 0 && <span className="cart-count">{totalCartItems}</span>}
          <svg viewBox="0 0 24 24" className="cart-svg">
            <path d="M4 6h2l1.8 8h9.4l1.8-6H7" />
            <circle cx="10" cy="18.5" r="1.2" />
            <circle cx="16" cy="18.5" r="1.2" />
          </svg>
        </button>
      </div>

      <div className="modal-content">
        <div className="modal-carousel">
          <button type="button" className="carousel-nav" onClick={onPrevSlide} aria-label="Imagen anterior">
            {'\u2039'}
          </button>

          <div className="carousel-frame">
            <img
              src={selectedProduct.images[carouselIndex].src}
              alt={selectedProduct.images[carouselIndex].alt}
              className="carousel-image"
              onError={(event) => onImageError(event, selectedProduct.images[carouselIndex].fallbackSrc)}
            />
          </div>

          <button type="button" className="carousel-nav" onClick={onNextSlide} aria-label="Imagen siguiente">
            {'\u203a'}
          </button>
        </div>

        <h2 className="modal-name">{selectedProduct.name}</h2>
        <p className="modal-meta">
          {selectedProduct.brand ?? 'Sin marca'} {'\u00b7'} {selectedProduct.category ?? 'Sin categoria'}
        </p>
        <p className="modal-price">{formatPrice(selectedProduct.price)}</p>
        <button type="button" className="add-button" aria-label={'Anadir al carrito'} onClick={() => onAddToCart(selectedProduct)}>
          +
        </button>
      </div>
    </section>
  )
}

export default ProductModal
