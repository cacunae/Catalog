import { useEffect, useMemo, useState } from 'react'
import { fetchProducts, type ProductQueryParams } from '../services/productsService'
import type { ApiProduct, Product } from '../types/product'

const DETAIL_IMAGES = ['/mock/real/detail-01.jpg', '/mock/real/detail-02.jpg']

const buildFallbackMain = (id: string) => {
  const numeric = Number(id.replace(/\D/g, ''))
  const normalized = Number.isFinite(numeric) && numeric > 0 ? ((numeric - 1) % 18) + 1 : 1
  return `/mock/real/product-${String(normalized).padStart(2, '0')}.jpg`
}

const mapApiProduct = (item: ApiProduct): Product => {
  const fallbackMain = buildFallbackMain(item.id)
  const mainSrc = item.imageUrl && item.imageUrl.trim() ? item.imageUrl : fallbackMain

  return {
    id: item.id,
    name: item.name,
    price: Number(item.price ?? 0),
    brand: item.brand ?? undefined,
    category: item.category ?? undefined,
    images: [
      { id: `${item.id}-main`, src: mainSrc, alt: `Imagen principal de ${item.name}`, fallbackSrc: fallbackMain },
      { id: `${item.id}-detail-1`, src: DETAIL_IMAGES[0], alt: `Detalle de ${item.name}` },
      { id: `${item.id}-detail-2`, src: DETAIL_IMAGES[1], alt: `Vista alternativa de ${item.name}` },
    ],
  }
}

export type UseProductsParams = {
  searchTerm: string
  brandFilter: string
  categoryFilter: string
  sortBy: string
  sortDir: 'asc' | 'desc'
}

export const useProducts = ({ searchTerm, brandFilter, categoryFilter, sortBy, sortDir }: UseProductsParams) => {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(true)
  const [productsError, setProductsError] = useState<string | null>(null)

  const query = useMemo<ProductQueryParams>(
    () => ({
      page: 0,
      size: 100,
      sortBy,
      sortDir,
      search: searchTerm,
      brand: brandFilter,
      category: categoryFilter,
    }),
    [searchTerm, brandFilter, categoryFilter, sortBy, sortDir],
  )

  useEffect(() => {
    let isCancelled = false

    const load = async () => {
      setIsLoadingProducts(true)
      setProductsError(null)
      try {
        const payload = await fetchProducts(query)
        const apiItems = Array.isArray(payload.items) ? payload.items : []
        if (!isCancelled) {
          setProducts(apiItems.map(mapApiProduct))
        }
      } catch (error) {
        if (!isCancelled) {
          const message = error instanceof Error ? error.message : 'Error cargando productos'
          setProductsError(message)
          setProducts([])
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingProducts(false)
        }
      }
    }

    void load()

    return () => {
      isCancelled = true
    }
  }, [query])

  return { products, isLoadingProducts, productsError }
}
