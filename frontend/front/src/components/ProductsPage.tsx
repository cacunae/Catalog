import type { FC, SyntheticEvent } from 'react'
import type { Product } from '../types/product'

type ProductsPageProps = {
  pageIndex: number
  isLastPage: boolean
  pageProducts: Product[]
  isLoadingProducts: boolean
  productsError: string | null
  hasProducts: boolean
  totalCartItems: number
  hasCartNotification: boolean
  cartAnimationTick: number
  onSetRef: (pageIndex: number, node: HTMLElement | null) => void
  onOpenFilters: () => void
  onOpenCart: () => void
  onOpenProduct: (product: Product) => void
  onNextPage: () => void
  onImageError: (event: SyntheticEvent<HTMLImageElement, Event>, fallbackSrc?: string) => void
}

const ProductsPage: FC<ProductsPageProps> = ({
  pageIndex,
  isLastPage,
  pageProducts,
  isLoadingProducts,
  productsError,
  hasProducts,
  totalCartItems,
  hasCartNotification,
  cartAnimationTick,
  onSetRef,
  onOpenFilters,
  onOpenCart,
  onOpenProduct,
  onNextPage,
  onImageError,
}) => {
  return (
    <section
      ref={(node) => {
        onSetRef(pageIndex, node)
      }}
      className={`page-panel products-screen ${isLastPage ? 'last-page' : ''}`}
    >
      <div className="panel-left">
        <button type="button" className="filter-button" aria-label="Filtros" onClick={onOpenFilters}>
          <svg viewBox="0 0 24 24" className="filter-svg">
            <path d="M4 7h16" />
            <path d="M4 12h16" />
            <path d="M4 17h16" />
          </svg>
        </button>
      </div>

      <div className="panel-icons">
        <button type="button" className="cart-button" aria-label="Carrito" onClick={onOpenCart}>
          {hasCartNotification && cartAnimationTick > 0 && (
            <span key={`cart-dot-main-${cartAnimationTick}`} className="cart-jump-dot" aria-hidden="true" />
          )}
          {totalCartItems > 0 && <span className="cart-count">{totalCartItems}</span>}
          <svg viewBox="0 0 24 24" className="cart-svg">
            <path d="M4 6h2l1.8 8h9.4l1.8-6H7" />
            <circle cx="10" cy="18.5" r="1.2" />
            <circle cx="16" cy="18.5" r="1.2" />
          </svg>
        </button>
      </div>

      <div className="products-wrap">
        {isLoadingProducts ? (
          <p className="empty-state">Cargando productos...</p>
        ) : productsError ? (
          <p className="empty-state">{productsError}</p>
        ) : pageProducts.length > 0 ? (
          <div className="products-grid">
            {pageProducts.map((product) => (
              <button key={product.id} type="button" className="product-card" onClick={() => onOpenProduct(product)}>
                <img
                  src={product.images[0].src}
                  alt={product.images[0].alt}
                  className="product-thumb-image"
                  loading="lazy"
                  onError={(event) => onImageError(event, product.images[0].fallbackSrc)}
                />
                <span className="product-name">{product.name}</span>
              </button>
            ))}
          </div>
        ) : (
          <p className="empty-state">No hay productos que coincidan con los filtros.</p>
        )}
      </div>

      {!isLastPage && !isLoadingProducts && !productsError && hasProducts && (
        <button
          type="button"
          className="down-arrow panel-down-arrow"
          aria-label="Mostrar siguientes 9 productos"
          onClick={onNextPage}
        >
          {'\u2193'}
        </button>
      )}

      {isLastPage && !isLoadingProducts && !productsError && hasProducts && (
        <footer className="footer-note">{'Disenado por Cristobal Acuna'}</footer>
      )}
    </section>
  )
}

export default ProductsPage
