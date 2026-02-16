import { useEffect, useMemo, useRef, useState, type SyntheticEvent } from 'react'
import reactLogo from './assets/react.svg'
import cashRegisterSound from './assets/dragon-studio-cash-register-kaching-376867.mp3'
import doSound from './assets/do.mp3'
import reSound from './assets/re.mp3'
import miSound from './assets/mi.mp3'
import './App.css'
import StartScreen from './components/StartScreen'
import ProductsPage from './components/ProductsPage'
import FiltersSidebar from './components/FiltersSidebar'
import CartSidebar from './components/CartSidebar'
import CheckoutModal from './components/CheckoutModal'
import CreditsModal from './components/CreditsModal'
import ProductModal from './components/ProductModal'
import { useProducts } from './hooks/useProducts'
import type { CartItem, Product } from './types/product'

const SCROLL_DURATION_MS = 1800
const MODAL_FADE_MS = 220
const CHECKOUT_FADE_MS = 240
const CARD_INFO_FADE_MS = 220
const ITEMS_PER_PAGE = 9
const JAVA_LOGO_URL = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg'
const EASTER_EGG_SOUNDS = [doSound, reSound, miSound]

const easeInOutCubic = (value: number) => {
  if (value < 0.5) return 4 * value * value * value
  return 1 - Math.pow(-2 * value + 2, 3) / 2
}

const formatPrice = (value: number) => `$${value.toFixed(2)}`

function App() {
  const pageStackRef = useRef<HTMLElement | null>(null)
  const productPageRefs = useRef<Array<HTMLElement | null>>([])
  const animationFrameRef = useRef<number | null>(null)
  const modalCloseTimeoutRef = useRef<number | null>(null)
  const checkoutCloseTimeoutRef = useRef<number | null>(null)
  const cardInfoCloseTimeoutRef = useRef<number | null>(null)
  const cashSoundRef = useRef<HTMLAudioElement | null>(null)
  const easterEggSoundsRef = useRef<HTMLAudioElement[]>([])
  const easterEggStepResetTimeoutRef = useRef<number | null>(null)

  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [brandFilter, setBrandFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [alphabeticalOrder, setAlphabeticalOrder] = useState<'none' | 'asc' | 'desc'>('none')
  const [priceOrder, setPriceOrder] = useState<'none' | 'asc' | 'desc'>('none')

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isProductModalClosing, setIsProductModalClosing] = useState(false)
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCheckoutMockOpen, setIsCheckoutMockOpen] = useState(false)
  const [isCheckoutMockClosing, setIsCheckoutMockClosing] = useState(false)
  const [isCardInfoModalOpen, setIsCardInfoModalOpen] = useState(false)
  const [isCardInfoModalClosing, setIsCardInfoModalClosing] = useState(false)
  const [isCreditsMockOpen, setIsCreditsMockOpen] = useState(false)
  const [easterEggStep, setEasterEggStep] = useState(0)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [cartAnimationTick, setCartAnimationTick] = useState(0)
  const [hasCartNotification, setHasCartNotification] = useState(false)

  const totalCartAmount = useMemo(
    () => cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0),
    [cartItems],
  )

  const totalCartItems = useMemo(() => cartItems.reduce((total, item) => total + item.quantity, 0), [cartItems])

  const sortParams = useMemo(() => {
    if (alphabeticalOrder !== 'none') {
      return { sortBy: 'name', sortDir: alphabeticalOrder }
    }
    if (priceOrder !== 'none') {
      return { sortBy: 'price', sortDir: priceOrder }
    }
    return { sortBy: 'id', sortDir: 'asc' as const }
  }, [alphabeticalOrder, priceOrder])

  const { products, isLoadingProducts, productsError } = useProducts({
    searchTerm,
    brandFilter,
    categoryFilter,
    sortBy: sortParams.sortBy,
    sortDir: sortParams.sortDir,
  })

  const totalPages = Math.max(1, Math.ceil(products.length / ITEMS_PER_PAGE))
  const productPages = Array.from({ length: totalPages }, (_, pageIndex) =>
    products.slice(pageIndex * ITEMS_PER_PAGE, (pageIndex + 1) * ITEMS_PER_PAGE),
  )

  const scrollToPanel = (target: HTMLElement | null) => {
    const container = pageStackRef.current
    if (!container || !target) return

    const targetTop = target.offsetTop
    const startTop = container.scrollTop
    const distance = targetTop - startTop

    if (Math.abs(distance) < 1) return

    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      container.scrollTop = targetTop
      return
    }

    const previousSnapType = container.style.scrollSnapType
    container.style.scrollSnapType = 'none'
    const startTime = performance.now()

    const animate = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / SCROLL_DURATION_MS, 1)
      const eased = easeInOutCubic(progress)

      container.scrollTop = startTop + distance * eased

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate)
        return
      }

      container.style.scrollSnapType = previousSnapType
      animationFrameRef.current = null
    }

    animationFrameRef.current = requestAnimationFrame(animate)
  }

  const goToProducts = () => scrollToPanel(productPageRefs.current[0] ?? null)
  const goToProductsPage = (pageIndex: number) => scrollToPanel(productPageRefs.current[pageIndex] ?? null)

  const clearFilters = () => {
    setSearchTerm('')
    setBrandFilter('')
    setCategoryFilter('')
    setAlphabeticalOrder('none')
    setPriceOrder('none')
  }

  const openProduct = (product: Product) => {
    if (modalCloseTimeoutRef.current !== null) {
      window.clearTimeout(modalCloseTimeoutRef.current)
      modalCloseTimeoutRef.current = null
    }
    setIsProductModalClosing(false)
    setSelectedProduct(product)
    setCarouselIndex(0)
  }

  const closeProduct = () => {
    if (!selectedProduct || isProductModalClosing) return
    setIsProductModalClosing(true)
    modalCloseTimeoutRef.current = window.setTimeout(() => {
      setSelectedProduct(null)
      setIsProductModalClosing(false)
      modalCloseTimeoutRef.current = null
    }, MODAL_FADE_MS)
  }

  const addToCart = (product: Product) => {
    setCartItems((current) => {
      const existing = current.find((item) => item.product.id === product.id)
      if (!existing) {
        return [...current, { product, quantity: 1 }]
      }

      return current.map((item) =>
        item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
      )
    })
    setHasCartNotification(true)
    setCartAnimationTick((prev) => prev + 1)
  }

  const openCart = () => {
    setIsCartOpen(true)
    setHasCartNotification(false)
  }

  const playCashRegisterSound = () => {
    const sound = cashSoundRef.current
    if (!sound) return
    sound.currentTime = 0
    void sound.play().catch(() => {
    })
  }

  const openCheckoutMock = () => {
    if (cartItems.length === 0) return
    if (checkoutCloseTimeoutRef.current !== null) {
      window.clearTimeout(checkoutCloseTimeoutRef.current)
      checkoutCloseTimeoutRef.current = null
    }
    if (cardInfoCloseTimeoutRef.current !== null) {
      window.clearTimeout(cardInfoCloseTimeoutRef.current)
      cardInfoCloseTimeoutRef.current = null
    }
    setIsCardInfoModalClosing(false)
    setIsCardInfoModalOpen(false)
    if (easterEggStepResetTimeoutRef.current !== null) {
      window.clearTimeout(easterEggStepResetTimeoutRef.current)
      easterEggStepResetTimeoutRef.current = null
    }
    setEasterEggStep(0)
    setIsCheckoutMockClosing(false)
    setIsCreditsMockOpen(false)
    setIsCartOpen(false)
    setIsCheckoutMockOpen(true)
  }

  const closeCheckoutMock = () => {
    if (!isCheckoutMockOpen || isCheckoutMockClosing) return
    setIsCardInfoModalClosing(false)
    setIsCardInfoModalOpen(false)
    if (easterEggStepResetTimeoutRef.current !== null) {
      window.clearTimeout(easterEggStepResetTimeoutRef.current)
      easterEggStepResetTimeoutRef.current = null
    }
    setEasterEggStep(0)
    setIsCheckoutMockClosing(true)
    checkoutCloseTimeoutRef.current = window.setTimeout(() => {
      setIsCheckoutMockOpen(false)
      setIsCheckoutMockClosing(false)
      checkoutCloseTimeoutRef.current = null
    }, CHECKOUT_FADE_MS)
  }

  const openCardInfoModal = () => {
    if (cardInfoCloseTimeoutRef.current !== null) {
      window.clearTimeout(cardInfoCloseTimeoutRef.current)
      cardInfoCloseTimeoutRef.current = null
    }
    setIsCardInfoModalClosing(false)
    setIsCardInfoModalOpen(true)
  }

  const closeCardInfoModal = () => {
    if (!isCardInfoModalOpen || isCardInfoModalClosing) return
    setIsCardInfoModalClosing(true)
    cardInfoCloseTimeoutRef.current = window.setTimeout(() => {
      setIsCardInfoModalOpen(false)
      setIsCardInfoModalClosing(false)
      cardInfoCloseTimeoutRef.current = null
    }, CARD_INFO_FADE_MS)
  }

  const handleHappyPaymentClick = () => {
    const sounds = easterEggSoundsRef.current
    if (sounds.length !== EASTER_EGG_SOUNDS.length) return

    const currentStep = easterEggStep
    const audio = sounds[currentStep]
    if (!audio) return

    if (easterEggStepResetTimeoutRef.current !== null) {
      window.clearTimeout(easterEggStepResetTimeoutRef.current)
      easterEggStepResetTimeoutRef.current = null
    }

    audio.currentTime = 0
    void audio.play().catch(() => {
      // Ignore autoplay restrictions and keep UX responsive.
    })

    if (currentStep >= EASTER_EGG_SOUNDS.length - 1) {
      setEasterEggStep(0)
      const onEnded = () => {
        setIsCheckoutMockOpen(false)
        setIsCheckoutMockClosing(false)
        setIsCreditsMockOpen(true)
      }
      audio.addEventListener('ended', onEnded, { once: true })
      return
    }

    setEasterEggStep(currentStep + 1)
    easterEggStepResetTimeoutRef.current = window.setTimeout(() => {
      setEasterEggStep(0)
      easterEggStepResetTimeoutRef.current = null
    }, 2000)
  }

  const goNextSlide = () => {
    if (!selectedProduct) return
    const len = selectedProduct.images.length
    setCarouselIndex((prev) => (prev + 1) % len)
  }

  const goPrevSlide = () => {
    if (!selectedProduct) return
    const len = selectedProduct.images.length
    setCarouselIndex((prev) => (prev - 1 + len) % len)
  }

  const handleImageError = (event: SyntheticEvent<HTMLImageElement, Event>, fallbackSrc?: string) => {
    if (!fallbackSrc) return
    const image = event.currentTarget
    if (image.dataset.fallbackApplied === '1') return
    image.dataset.fallbackApplied = '1'
    image.src = fallbackSrc
  }

  useEffect(() => {
    if (!selectedProduct) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeProduct()
      if (event.key === 'ArrowLeft') goPrevSlide()
      if (event.key === 'ArrowRight') goNextSlide()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [selectedProduct, isProductModalClosing])

  useEffect(() => {
    return () => {
      if (modalCloseTimeoutRef.current !== null) {
        window.clearTimeout(modalCloseTimeoutRef.current)
      }
      if (checkoutCloseTimeoutRef.current !== null) {
        window.clearTimeout(checkoutCloseTimeoutRef.current)
      }
      if (cardInfoCloseTimeoutRef.current !== null) {
        window.clearTimeout(cardInfoCloseTimeoutRef.current)
      }
      if (easterEggStepResetTimeoutRef.current !== null) {
        window.clearTimeout(easterEggStepResetTimeoutRef.current)
      }
      if (cashSoundRef.current) {
        cashSoundRef.current.pause()
        cashSoundRef.current = null
      }
      if (easterEggSoundsRef.current.length > 0) {
        easterEggSoundsRef.current.forEach((audio) => audio.pause())
        easterEggSoundsRef.current = []
      }
    }
  }, [])

  useEffect(() => {
    cashSoundRef.current = new Audio(cashRegisterSound)
    cashSoundRef.current.preload = 'auto'
  }, [])

  useEffect(() => {
    easterEggSoundsRef.current = EASTER_EGG_SOUNDS.map((soundSrc) => {
      const audio = new Audio(soundSrc)
      audio.preload = 'auto'
      return audio
    })
  }, [])

  useEffect(() => {
    if (!isCheckoutMockOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isCardInfoModalOpen) {
          closeCardInfoModal()
          return
        }
        closeCheckoutMock()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isCheckoutMockOpen, isCheckoutMockClosing, isCardInfoModalOpen, isCardInfoModalClosing])

  return (
    <>
      <main ref={pageStackRef} className="page-stack">
        <StartScreen reactLogo={reactLogo} javaLogoUrl={JAVA_LOGO_URL} onStart={goToProducts} />

        {productPages.map((pageProducts, pageIndex) => {
          const isLastPage = pageIndex === totalPages - 1
          return (
            <ProductsPage
              key={`products-page-${pageIndex + 1}`}
              pageIndex={pageIndex}
              isLastPage={isLastPage}
              pageProducts={pageProducts}
              isLoadingProducts={isLoadingProducts}
              productsError={productsError}
              hasProducts={products.length > 0}
              totalCartItems={totalCartItems}
              hasCartNotification={hasCartNotification}
              cartAnimationTick={cartAnimationTick}
              onSetRef={(index, node) => {
                productPageRefs.current[index] = node
              }}
              onOpenFilters={() => setIsFiltersOpen(true)}
              onOpenCart={openCart}
              onOpenProduct={openProduct}
              onNextPage={() => goToProductsPage(pageIndex + 1)}
              onImageError={handleImageError}
            />
          )
        })}
      </main>

      {(isFiltersOpen || isCartOpen) && (
        <button
          type="button"
          className={`filters-overlay ${isCartOpen ? 'cart-open' : ''}`}
          aria-label="Cerrar panel lateral"
          onClick={() => {
            setIsFiltersOpen(false)
            setIsCartOpen(false)
          }}
        />
      )}

      <FiltersSidebar
        isOpen={isFiltersOpen}
        searchTerm={searchTerm}
        brandFilter={brandFilter}
        categoryFilter={categoryFilter}
        alphabeticalOrder={alphabeticalOrder}
        priceOrder={priceOrder}
        onClose={() => setIsFiltersOpen(false)}
        onSearchChange={setSearchTerm}
        onBrandChange={setBrandFilter}
        onCategoryChange={setCategoryFilter}
        onAlphabeticalOrderChange={setAlphabeticalOrder}
        onPriceOrderChange={setPriceOrder}
        onReset={clearFilters}
      />

      <CartSidebar
        isOpen={isCartOpen}
        cartItems={cartItems}
        totalCartAmount={totalCartAmount}
        onClose={() => setIsCartOpen(false)}
        onCheckout={openCheckoutMock}
        formatPrice={formatPrice}
      />

      <CheckoutModal
        isOpen={isCheckoutMockOpen}
        isClosing={isCheckoutMockClosing}
        isCardInfoModalOpen={isCardInfoModalOpen}
        isCardInfoModalClosing={isCardInfoModalClosing}
        onClose={closeCheckoutMock}
        onCashPayment={playCashRegisterSound}
        onCardPayment={openCardInfoModal}
        onHappyPayment={handleHappyPaymentClick}
        onCloseCardInfo={closeCardInfoModal}
      />

      <CreditsModal isOpen={isCreditsMockOpen} onClose={() => setIsCreditsMockOpen(false)} />

      <ProductModal
        selectedProduct={selectedProduct}
        isClosing={isProductModalClosing}
        totalCartItems={totalCartItems}
        hasCartNotification={hasCartNotification}
        cartAnimationTick={cartAnimationTick}
        carouselIndex={carouselIndex}
        onClose={closeProduct}
        onOpenCart={openCart}
        onPrevSlide={goPrevSlide}
        onNextSlide={goNextSlide}
        onAddToCart={addToCart}
        onImageError={handleImageError}
        formatPrice={formatPrice}
      />
    </>
  )
}

export default App
