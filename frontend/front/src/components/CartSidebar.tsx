import type { FC } from 'react'
import type { CartItem } from '../types/product'

type CartSidebarProps = {
  isOpen: boolean
  cartItems: CartItem[]
  totalCartAmount: number
  onClose: () => void
  onCheckout: () => void
  formatPrice: (value: number) => string
}

const CartSidebar: FC<CartSidebarProps> = ({ isOpen, cartItems, totalCartAmount, onClose, onCheckout, formatPrice }) => {
  return (
    <aside className={`cart-sidebar ${isOpen ? 'open' : ''}`} aria-label="Carrito de compras">
      <div className="cart-header">
        <h2>Carrito</h2>
        <button type="button" className="filters-close" onClick={onClose} aria-label="Cerrar carrito">
          x
        </button>
      </div>

      <div className="cart-list">
        {cartItems.length === 0 ? (
          <p className="empty-state">Tu carrito esta vacio.</p>
        ) : (
          cartItems.map((item) => (
            <article key={item.product.id} className="cart-item">
              <p className="cart-item-name">{item.product.name}</p>
              <p className="cart-item-meta">
                {item.quantity} x {formatPrice(item.product.price)}
              </p>
              <p className="cart-item-total">{formatPrice(item.product.price * item.quantity)}</p>
            </article>
          ))
        )}
      </div>

      <div className="cart-footer">
        <p className="cart-total-label">Total</p>
        <p className="cart-total-value">{formatPrice(totalCartAmount)}</p>
        <button type="button" className="checkout-button" disabled={cartItems.length === 0} onClick={onCheckout}>
          Proceder la compra
        </button>
      </div>
    </aside>
  )
}

export default CartSidebar
